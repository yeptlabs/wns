/**
 * @WNS - The NodeJS Middleware and Framework
 * 
 * @copyright: Copyright &copy; 2012- YEPT &reg;
 * @page: http://wns.yept.net/
 * @docs: http://wns.yept.net/docs/
 * @license: http://wns.yept.net/license/
 */

/**
 * WNS class builder
 * @version 0.2.0
 * @author Pedro Nasser
 */

module.exports=wnBuild;

var buildStart, buildEnd, self;
var fs = require('fs');
var util = require('util');
var path = require('path');
var vm = require('vm');
var lodash = _ = require('lodash')
var q = require('q');

/**
 * Constructor;
 */
function wnBuild(classes,parent)
{
	self=this;

	if (!parent.getModulePath || !parent.getClassName || !parent.npmPath)
		{ return false; }

	buildStart=+new Date;

	// Owner of the build.
	this.parent = parent;

	// Store classes's file path
	this.classesPath = {};
	// Store classes's file source
	this.classesCode = {};
	// Object to store classes's build object.
	this.classesBuild = {};
	// Object to store classes's literal object.
	this.classesObject = {};
	// Store classes.
	this.classes = {};

	// Object to store not compiled class source
	this.prototypeSource = {};
	// Object to store compiled class source
	this.compiledProtoSource = {};
	// Object to store VM.Script from each class.
	this.vmProtoScript = {};

	// Store parent information.
	this.modulePath = parent.getModulePath() || '.';
	this.npmPath = parent.npmPath || [];
	this.moduleClass = parent.getClassName() || 'WNS';

	// NPM already loaded modules.
	this.loadedModules = {
		q: q,
		lodash: lodash
	};

	for (c in classes)
	{
		if (typeof classes[c] == 'string')
			this.addSource(c,classes[c],true);
		else if (typeof classes[c] == 'array')
			for (l in classes[c])
				this.addSource(c,classes[c][l],true);
	}

	this.load();
};

/**
 * Add a specifica source code to the builder
 * @param string $className
 * @param string $sourceCode
 */
wnBuild.prototype.addSource = function (className,classPath,withoutLoad)
{
	if (typeof className !== 'string'||typeof classPath !== 'string' || !fs.existsSync(classPath))
		return false;

	var sourceCode = fs.readFileSync(classPath,'utf8');

	if (!this.classesPath[className])
		this.classesPath[className]=classPath;
	else
	{
		if (typeof this.classesPath[className]=='string')
			this.classesPath[className]=[this.classesPath[className],classPath]
		else
			this.classesPath[className].push(classPath);
	}

	if (!this.classesCode[className])
		this.classesCode[className]=sourceCode;
	else
	{
		if (typeof this.classesCode[className]=='string')
			this.classesCode[className]=[this.classesCode[className],sourceCode]
		else
			this.classesCode[className].push(sourceCode);
	}

	if (!withoutLoad)
		this.load(className);
};

wnBuild.prototype.extend = function (build,newbuild,className)
{
	if (newbuild.constructor && newbuild.constructor.toString().indexOf('[native code]')==-1)
	{ build.constructor = newbuild.constructor; }

	for (b in build)
		if (newbuild[b]!==undefined)
			build[b]=_.merge(build[b]||{},newbuild[b]);
};

/**
 * Loads all or a specific class's build object from the its sourceCode.
 * @param string $className 
 */
wnBuild.prototype.load = function (className)
{
	var module = {};
	if (className)
	{
		var loadList = {};
		loadList[className]=true;
	} else
		var loadList = this.classesCode;

	for (c in loadList)
	{
		source = this.classesCode[c];
		this.classesBuild[c] = { extend: [], public: {}, private: {}, methods:{}, dependencies: [] };

		// Eval class source or a list of sources.
		if (typeof source == 'string')
		{
			var ctx = { module: { exports: {} }, require: require };
			try {
				vm.runInNewContext(source,ctx,c+'.js');
			} catch (e)
			{
				throw new Error(e.message+' - building `'+c+'` class');
			}

			if (this.checkStructure(ctx.module.exports)==false)
			{
				delete this.classesBuild[c];
				continue;
			}

			this.extend(this.classesBuild[c],ctx.module.exports,c);
		}
		else if (source instanceof Array)
			for (s in source)
			{
				var ctx = { module: { exports: {} }, require: require };
				try {
					vm.runInNewContext(source[s],ctx,c+'.js');
				} catch (e)
				{
					throw new Error(e.message+' - building `'+c+'` class');
				}

				if (this.checkStructure(ctx.module.exports)==false)
				{
					delete this.classesBuild[c];
					continue;
				}

				this.extend(this.classesBuild[c],ctx.module.exports,c);
			}
	}


	for (c in loadList)
	{
		// Remove invalid dependencies.
		if (this.classesBuild[c])
		{
			this.classesBuild[c].extend = this.removeInvalidDependencies(this.classesBuild[c].extend);
			this.loadDependencies(this.classesBuild[c].dependencies);
		}
	}
};


/**
 * Build all classes already loaded.
 * @return object object with the result of class compilation
 */
wnBuild.prototype.build = function ()
{
	var _done = 0;

	// Check if some classes are not already loaded and count them.
	for (c in this.classesBuild)
		if (this.classesBuild[c] != undefined && this.classesBuild[c].loaded != true)
			_done++;

	this.classes = {};

	// While classes building is not done try to build.
	while (_done > 0)
	{
		for (c in this.classesBuild)
		{
			if (this.classes[c] == undefined)
			{
				var _c=this.buildClass(c);
				if (_c.loaded == true)
				{
					_done--;
					this.classes[c] = _c;
				} else if (_c == -1)
				{
					_done--;
					this.classes[c] = {};
				}
			}
		}
	}

	buildEnded=+new Date;
	this.buildTime = buildEnded - buildStart;

	return this.classes;
};

/**
 * Build a single class.
 * @param string $className class that will be builded
 * @return wnClass class instance constructor
 */
wnBuild.prototype.buildClass = function (className)
{
	var targetClass = this.classesBuild[className];

	// Check if dependencies are already loaded.
	if (!targetClass || !this.checkDependencies(targetClass.extend))
		return false;

	// Compile and compress the class source code and create a prototype source.
	this.compilePrototype(className);

	// Create a function to create a new instance from the prototype when called.
	var builder = this;

	var evalBuilder = "var classBuilder = function () {\n";
		evalBuilder += '	builder.vmProtoScript[className].runInThisContext();\n';
		evalBuilder += "	var klass = new classObject;\n";
		evalBuilder += "	Object.defineProperty(klass,'_proto',{ value: builder.classesBuild[className], enumerable: false })\n";
		evalBuilder += '	klass.construct&&klass.construct.apply(klass,arguments);\n';
		evalBuilder += '	return klass;\n};';
	eval(evalBuilder);

	Object.defineProperty(classBuilder, 'build', {
		value: this.classesBuild[className],
		writable: false,
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(classBuilder, 'object', {
		value: this.compileObject(className),
		writable: false,
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(classBuilder, 'protoSource', {
		value: this.prototypeSource[className],
		writable: false,
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(classBuilder, 'loaded', {
		value: true,
		enumerable: false
	});

	return classBuilder;
};

/**
 * Get the target class's builder.
 * Create a source code from it.
 * Compile the source as a prototype.
 * Save the new prototype object.
 * @param string $className
 * @param array $extend class extension list
 */
wnBuild.prototype.compilePrototype = function (targetClass)
{
	// Catch all errors
	try {

		// Check if class is loaded.
		if (!this.classesBuild[targetClass] || this.classesBuild[targetClass].source)
			process.exit("Error on compiling class `"+targetClass+"`, it's not loaded.");

		var build = this.classesBuild[targetClass];
		var self = builder = this;
		var fullExtend = [];

		// Get all classes dependencies and put a single array.
		(function (extend) {
			for (e in extend)
			{
				var ext=fullExtend.reverse();
					ext.push(extend[e]);
					ext.reverse();
					fullExtend=ext;
				arguments.callee(self.classes[extend[e]].build.extend);
			}
		})(build.extend);

		// Begin of the classLoader source code.
		var classLoader = 'var classObject = (function () {\n';
		classLoader+='//@'+targetClass+'\n\n';
		classLoader+='var self={}, className="'+targetClass+'";\n';
		classLoader+='function '+targetClass+'() { self = this; this.className = "'+targetClass+'"; }\n';
		classLoader+='var klass = '+targetClass+',\n';
		classLoader+=' proto = '+targetClass+'.prototype,\n';
		classLoader+=' __extend = '+util.inspect(fullExtend)+';\n';
		classLoader+='proto.construct = function () {};\n';

		// Importing extensions source code.
		classLoader+='\n// Importing WNS extensions\n\n';
		for (e in fullExtend)
		{
			classLoader+='// - Extension: '+ fullExtend[e]+'\n';
			var extendSource = builder.prototypeSource[fullExtend[e]];
			classLoader+=extendSource;
		}

		// Start of the targetClass's source code.
		classLoader +='\n// Begin of '+targetClass+' \n';

		// Importing every NPM dependencies 
		classSource = '\n// Declaring NPM dependencies \n';
		classSource += '	var deps = '+util.inspect(build.dependencies)+';\n';
		classSource += '	for (e in deps)\n';
		classSource += "		eval ('var '+deps[e].replace(\/\\\-\|\\\.\/g,\"_\")+'=builder.loadedModules[deps[e]];');\n";

		// Declare private properties
		classSource += '\n// Declaring private properties \n';
		classSource += 'var _=builder.loadedModules.lodash,q=builder.loadedModules.q,$$=self,';
		for (p in build.private)
		{
			if (p == 'proto' || p == 'klass' || build.dependencies.indexOf(p)!==-1)
				continue;
			if (typeof build.private[p] != 'function')
				classSource += p+" = "+util.inspect(build.private[p],false,null,false);
			else
				classSource += p+" = "+build.private[m].toString();
			classSource+=",";
		}
		classSource=classSource.substr(0,classSource.length-1)+";\n";

		// Declare public properties
		classSource += '\n// Declaring public properties\n';
		for (p in build.public)
		{
			if (typeof build.public[p] != 'function')
				classSource += "proto['"+p+"'] = "+util.inspect(build.public[p],false,null,false)+";\n";
			else
				classSource += "proto['"+p+"'] = "+build.public[m].toString()+";\n";
		}

		// Declare privileged methods
		var promiseRegExp = new RegExp('^\\\$');
		classSource += '\n// Declaring methods\n';
		for (m in build.methods)
		{
			var methodName=m;
			var fn = build.methods[m].toString();
			if (promiseRegExp.test(m))
			{
				classSource += "proto['"+methodName+"'] = function () { var done=q.defer(); var self = this; return ("+fn+").apply(self,arguments); };\n";
			} else
				classSource += "proto['"+methodName+"'] = "+fn+";\n";
		}

		// Declare the constructor.
		classSource += '\n// Constructor\n';
		if (build.hasOwnProperty('constructor') && build.constructor!==undefined)
			classSource += 'proto.construct='+build.constructor.toString()+";\n";

		// Replace all unknown functions.
		classSource = classSource.replace(/\[Function\]/gim, 'function () {}');

		// Add to the classLoader source code the class's sourceCode.
		classLoader += classSource+'\n return klass; })();';

		// Store the compiled and not compiled source code.
		this.prototypeSource[targetClass] = classSource;
		this.compiledProtoSource[targetClass] = classLoader;

		// Create a VM.Script from the classLoader;
		this.vmProtoScript[targetClass] = vm.createScript(classLoader,this.moduleClass+'.'+targetClass);
	} catch (e)
	{
		console.log('\nError on compiling `'+targetClass+'`: '+e.message);
		throw e;
		process.exit();
	}
};

/**
 * Get the target class's builder.
 * Create a source code from it.
 * Compile the source as an literal object.
 * Save the declared object.
 * @param string $className
 * @param array $extend class extension list
 */
wnBuild.prototype.compileObject = function (targetClass)
{
	// Catch all errors
	try {

		// Check if class is loaded.
		if (!this.classesBuild[targetClass] || this.classesBuild[targetClass].source)
			process.exit("Error on compiling class `"+targetClass+"`, it's not loaded.");

		var build = this.classesBuild[targetClass];
		var self = builder = this;
		var fullExtend = [];

		// Get all classes dependencies and put a single array.
		(function (extend) {
			for (e in extend)
			{
				var ext=fullExtend.reverse();
					ext.push(extend[e]);
					ext.reverse();
					fullExtend=ext;
				arguments.callee(self.classes[extend[e]].build.extend);
			}
		})(build.extend);

		// Begin of the classLoader source code.
		var classLoader = 'var classObject = (function () {\n';
		classLoader+='//@'+targetClass+'\n\n';
		classLoader+='var self={}, className="'+targetClass+'";\n';
		classLoader+='function '+targetClass+'() { self = this; this.className = "'+targetClass+'"; }\n';
		classLoader+='var klass = '+targetClass+',\n';
		classLoader+=' proto = '+targetClass+',\n';
		classLoader+=' __extend = '+util.inspect(fullExtend)+';\n';
		classLoader+='proto.construct = function () {};\n';

		// Importing extensions source code.
		classLoader+='\n// Importing WNS extensions\n\n';
		for (e in fullExtend)
		{
			classLoader+='// - Extension: '+ fullExtend[e]+'\n';
			var extendSource = builder.prototypeSource[fullExtend[e]];
			classLoader+=extendSource;
		}

		// Start of the targetClass's source code.
		classLoader +='\n// Begin of '+targetClass+' \n';

		// Importing every NPM dependencies 
		classSource = '\n// Declaring NPM dependencies \n';
		classSource += '	var deps = '+util.inspect(build.dependencies)+'; builder.loadDependencies(deps);\n';
		classSource += '	for (e in deps)\n';
		classSource += "		eval ('var '+deps[e].replace(\/\\\-\|\\\.\/g,\"_\")+'=builder.loadedModules[deps[e]];');\n";

		// Declare private properties
		classSource += '\n// Declaring private properties \n';
		classSource += 'var _=builder.loadedModules.lodash,q=builder.loadedModules.q,$$=self,';
		for (p in build.private)
		{
			if (p == 'proto' || p == 'klass')
				continue;
			if (typeof build.private[p] != 'function')
				classSource += p+" = "+util.inspect(build.private[p],false,null,false);
			else
				classSource += p+" = "+build.private[m].toString();
			classSource+=",";
		}
		classSource=classSource.substr(0,classSource.length-1)+";\n";

		// Declare public properties
		classSource += '\n// Declaring public properties\n';
		for (p in build.public)
		{
			if (typeof build.public[p] != 'function')
				classSource += "proto['"+p+"'] = "+util.inspect(build.public[p],false,null,false)+";\n";
			else
				classSource += "proto['"+p+"'] = "+build.public[m].toString()+";\n";
		}

		// Declare privileged methods
		var promiseRegExp = new RegExp('^\\\$');
		classSource += '\n// Declaring privileged methods\n';
		for (m in build.methods)
		{
			var methodName=m;
			var fn = build.methods[m].toString();
			if (promiseRegExp.test(m))
			{
				classSource += "proto['"+methodName+"'] = function () { var done=q.defer(); var self = this; return ("+fn+").apply(self,arguments); };\n";
			} else
				classSource += "proto['"+methodName+"'] = "+fn+";\n";
		}

		// Declare the constructor.
		classSource += '\n// Constructor\n';
		if (build.hasOwnProperty('constructor') && build.constructor!==undefined)
			classSource += 'proto.construct='+build.constructor.toString()+";\n";

		// Replace all unknown functions.
		classSource = classSource.replace(/\[Function\]/gim, 'function () {}');

		// Add to the classLoader source code the class's sourceCode.
		classLoader += classSource+'\n return klass; })();';

		// Create a VM.Script from the classLoader;
		var ctx = vm.createContext({ classObject: {} });
		var script = vm.createScript(classLoader,this.moduleClass+'.'+targetClass);
		script.runInThisContext(ctx);

		return classObject;

	} catch (e)
	{
		console.log('\nError on compiling `'+targetClass+'`: '+e.message);
		throw e;
		process.exit();
	}
};

/**
 * Recompile a class from classesSource with new properties.
 * @param string $targetClass class name
 * @param object $obj class extension object
 * @return object
 */
wnBuild.prototype.recompile = function (className,obj)
{
	this.classes[className] = this.classes[className] || {};
	this.classes[className].loaded = false;
	var _nc = _.merge(this.classesBuild[className],obj);
	var _c = this.buildClass(className);

	if (_c.loaded == true)
		return _c;
	else
		return this.classes[className];
};

/**
 * Check if the class is compiled.
 * @param string $className class name
 * @return boolean exists?
 */
wnBuild.prototype.exists = function (className)
{
	return this.classes[className] != undefined && this.classes[className].loaded;
};

/**
 * Check class source structure.
 * @param object $targetClass class source object
 * @return boolean is this json structure in the right format?
 */
wnBuild.prototype.checkStructure = function (targetClass)
{
	return _(targetClass).isObject() && !_(targetClass).isEmpty();
};

/**
 * Check class dependencies
 * @param array $extensions extension list
 * @return boolean are all extensions already loaded?
 */
wnBuild.prototype.checkDependencies = function (extensions)
{
	if (!extensions instanceof Array)
		return false;

	for (e in extensions)
	{
		if (this.classes[extensions[e]] == undefined || this.classes[extensions[e]].loaded != true)
			return false;
	}

	return true;
};

/**
 * Remove from the dependencies list classes that are not loaded.
 * @param array $extensions extension list
 * @return array list of valid extensions.
 */
wnBuild.prototype.removeInvalidDependencies = function (extensions)
{
	var _ext = [];

	for (e in extensions)
	{
		if (this.classesBuild[extensions[e]] !== undefined)
			_ext.push(extensions[e]);
	}

	return _ext;
};

/**
 * Install and load npm dependencies.
 */
wnBuild.prototype.loadDependencies = function (dep)
{
	dep = _.toArray(dep);
	for (d in dep)
	{
		if (!this.loadedModules[dep[d]])
		{
			var npmPath=undefined;
			var globalModule=undefined;

			try {
				globalModule = require(dep[d]);
			} catch (e) {}
			
			for (n in this.npmPath)
			{
				var npmDir=path.resolve(this.npmPath[n]+'/'+dep[d]);
				if (fs.existsSync(npmDir))
					{ npmPath = npmDir; break; }
			}

			if (npmPath)
			{
				var module=require(npmPath);
				this.loadedModules[dep[d]]=module;
			} else if (globalModule!==undefined)
			{
				this.loadedModules[dep[d]]=globalModule;
			}
			else
				dep.splice(d,1);
		}
	}
};
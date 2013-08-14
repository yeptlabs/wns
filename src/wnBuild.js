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
var buildStart, buildEnd;

/**
 * Constructo; */
function wnBuild(classesSource,parent)
{
	var self = this;

	if (!parent.getModulePath || !parent.getClassName || !parent.npmPath)
		{ console.log('BUILD ERROR: '+parent+' is not a module.'); process.exit(); }

	buildStart=+new Date;
	this.classesSource = {};
	this.sourceCode = {};
	this.modulePath = parent.getModulePath() || '.';
	this.npmPath = parent.npmPath || [];
	this.moduleClass = parent.getClassName() || 'WNS';
	this.compiled = {};
	this.loadedModules = {};

	// Check all classes structures..
	for (c in classesSource)
	{
		if (this.checkStructure(classesSource[c]))
		{
			this.classesSource[c] = Object.extend({ extend: [], public: {}, private: {}, methods:{}, dependencies: {} },classesSource[c]);
			if (!this.classesSource[c].extend)
				this.classesSource[c].extend = [];
		}
	}

	// Remove invalid dependencies.
	for (c in this.classesSource)
		this.classesSource[c].extend = this.removeInvalidDependencies(this.classesSource[c].extend);
};

/**
 * Build all classes already imported.
 * @return object object with the result of class compilation
 */
wnBuild.prototype.build = function ()
{
	var _done = 0;

	for (c in this.classesSource)
		if (this.classesSource[c] != undefined && this.classesSource[c].loaded != true)
			_done++;

	this.classes = {};
	// this.protos={};
	while (_done > 0)
	{
		for (c in this.classesSource)
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
	var targetClass = this.classesSource[className];

	if (!this.checkDependencies(targetClass.extend))
		return false;

	var build = Object.extend(true,{},targetClass),
		__self = this,
		_ext = [];

	(function (extend) {
		for (e in extend)
		{
			var ext=_ext.reverse();
				ext.push(extend[e]);
				ext.reverse();
				_ext=ext;
			arguments.callee(__self.classes[extend[e]].build.extend);
		}
	})(build.extend);
	build.extend = _ext;

	// Creating sourceCode and prototype.
	this.compileClass(className,_ext);

	var builder = this;
	// Preparing the builder caller.
	var evalBuilder = "var classBuilder = function "+className+"() {\n";
		evalBuilder += '	builder.loadDependencies(build.dependencies);\n';
		evalBuilder += '	for (e in build.dependencies)\n';
		evalBuilder += "		eval ('var '+build.dependencies[e].replace(\/\\\-\/g,\"_\")+'=builder.loadedModules[build.dependencies[e]];');\n";
		evalBuilder += '	eval(builder.compiled[className]);\n';
		evalBuilder += "	eval('var klass = new '+className+';');\n";
		evalBuilder += '	klass.construct&&klass.construct.apply(klass,arguments);\n';
		evalBuilder += '	return klass;\n}';
	eval(evalBuilder);

	Object.defineProperty(classBuilder, 'build', {
		value: build,
		writable: false,
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(classBuilder, 'source', {
		value: this.sourceCode[className],
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
 * Get the target class object.
 * Build a compiled source code from the target class and it's extensions.
 * Then evaluate the source code. Saving the new class prototype.
 * @param string $className
 * @param array $extend class extension list
 */
wnBuild.prototype.compileClass = function (targetClass,extend)
{
	var targetClass = targetClass+'';

	if (!this.classesSource[targetClass] || this.classesSource[targetClass].source)
		process.exit("Error on compiling class `"+targetClass+"`");

	var classLoader = '';
		builder = this,
		build = this.classesSource[targetClass];

	classLoader+='//@'+targetClass+'\n\n';

	classLoader+='\n// Initialization\n';
	classLoader+='var self={}, className="'+targetClass+'";\n';
	classLoader+='function '+targetClass+'() { self = this; this.className = "'+targetClass+'"; };\n';
	classLoader+='var klass = '+targetClass+';\n';
	classLoader+='var classProto = '+targetClass+'.prototype;\n';
	classLoader+='var __extend = '+util.inspect(extend)+';\n';
	classLoader+='classProto.construct = function () {};\n';

	classLoader+='\n// Importing WNS extensions\n\n';

	for (e in extend)
	{
		classLoader+='// - Extend: '+ extend[e]+'\n';
		var extendSource = builder.sourceCode[extend[e]];
		classLoader+=extendSource+'\n';
	}

	classLoader +='\n// Class: '+targetClass+' \n';

	var classSource = "(function () {\n";

		classSource += '\n// Declaring private vars \n';
		classSource += "var _=self,";
		// Declare private vars
		for (p in build.private)
		{
			if (p == 'classProto' || p == 'klass')
				continue;
			if (typeof build.private[p] != 'function')
				classSource += p+" = "+util.inspect(build.private[p],false,null,false);
			else
				classSource += p+" = "+build.private[m].toString();
			classSource+=",";
		}
		classSource=classSource.substr(0,classSource.length-1)+";\n";
	
		classSource += '\n// Declaring methods\n';

		// Redeclare privileged methods
		for (m in build.methods)
		{
			classSource += "classProto['"+m+"'] = "+build.methods[m].toString()+";\n";
		}

		classSource += '\n// Declaring public vars\n';

		// Declare public vars
		for (p in build.public)
		{
			if (p == 'classProto' || p == 'klass')
				continue;
			if (typeof build.public[p] != 'function')
				classSource += "classProto['"+p+"'] = "+util.inspect(build.public[p],false,null,false)+";\n";
			else
				classSource += "classProto['"+p+"'] = "+build.public[m].toString()+";\n";
		}

		classSource += '\n// Constructor\n';

		if (build.hasOwnProperty('constructor'))
			classSource += 'classProto.construct='+build.constructor.toString()+";\n";

		// Replace all unknown functions.
		classSource = classSource.replace(/\[Function\]/gim, 'function () {}');

	classSource += "\n})();\n";

	classLoader += classSource;

	try {
		this.sourceCode[targetClass] = classSource;
		this.compiled[targetClass] = classLoader;
	} catch (e)
	{
		console.log('\nError on compiling `'+targetClass+'`: '+e.message);
		process.exit();
	}
}

/**
 * Recompile a class from classesSource with new properties.
 * @param string $targetClass class name
 * @param object $obj class extension object
 * @return object recompiled class object
 */
wnBuild.prototype.recompile = function (className,obj)
{
	this.classes[className] = this.classes[className] || {};
	this.classes[className].loaded = false;

	var _nc = Object.extend(true,this.classes[className].build,obj);
	this.classesSource[className] = _nc;
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
	return (targetClass instanceof Object);
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
 * Remove class invalid dependencies.
 * @param array $extensions extension list
 * @return array list of valid extensions.
 */
wnBuild.prototype.removeInvalidDependencies = function (extensions)
{
	var _ext = [];

	for (e in extensions)
	{
		if (this.classesSource[extensions[e]] != undefined)
			_ext.push(extensions[e]);
	}

	return _ext;
};

/**
 * Install and load npm dependencies.
 */
wnBuild.prototype.loadDependencies = function (dep)
{
	for (d in dep)
	{
		if (!this.loadedModules[dep[d]])
		{
			var npmPath;
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
			} else
			{
				console.log("\nCan't find the `"+dep[d]+"` module.\n");
				process.exit();
			}
		}
	}
};   

/**
 * Generate the unit test from the classSource
 * @param string $classname name of the class
 * @param wnClass $docSource class object source
 */
wnBuild.prototype.makeTest = function (className, docSource)
{

	if (this.classes[className]==undefined)
		return false;

	var comments = docSource.match(/\/\*[\s\S]+?\*\//gim),
		blackList = 'methods extend private public';
		typeList = 'this boolean string function array object self';

	for (c in comments)
		if (c < 2)
			docSource=docSource.replace(comments[c],'');

	var findIt = new RegExp('','gim');
	var matchDoc = new RegExp('','gim');
	var matches = docSource.match(/\/\*[\s\S]+?\*\/\s+\w+\:/gim);
	var props = {}, type= 'undefined';

	for (m in matches)
	{
		var validTypes = [];		
		var	def = matches[m],
			getDoc = def.match(/[\/\*\*](\W|\w)+[\*\/]/gim)[0],
			prop = def.replace(/[\/\*\*](\W|\w)+[\*\/]/gim,'').replace(/\W/gim,''),
			params = def.match(/@param \$[\w]+ [\w]+ .+/g),
			returns = def.match(/@return .+/g),
			paramsList = [];

		if (blackList.indexOf(prop)!=-1)
		{
			type = prop;
			continue;
		}

		for (p in params)
		{
			var _param = {};
			var data = params[p].split(' ')
			_param.name = data[1];
			_param.accept = data[2];
			data=data.splice(3)
			_param.desc = data.join(' ');
			paramsList.push(_param);
		}

		if (returns !==null && returns.length>0)
		{
			returns=(returns[0]+'').toLowerCase();
			var types = returns.split(' ')[1].split('|');
			for (t in types)
				if (typeList.indexOf(types[t])!==-1)
					validTypes.push(types[t]);
		}

		if (validTypes.length>0)
			props[prop] = function (klass) 
			{
				if (typeof klass[this.prop] !== 'function')
					return false;

				var exec, self = this;
				try {
					var d = domain.create();
					d.on('error', function(er) {});
					d.run(function() {
					  exec = klass[self.prop].apply(klass,params);
					});
				} catch (e) {
					return false;
				}

				var typof = typeof exec;

				for (v in this.validTypes)
					if (this.validTypes[0].indexOf(typof)===-1 && this.validTypes[v]!=='mixed' && this.validTypes[v]!=='any')
						console.log(' ~> ['+this.prop+'] Expected `'+this.validTypes+'` but it was `'+typof+'`');

			}.bind({ prop: prop, validTypes: validTypes });
	}

	Object.defineProperty(this.classes[className], 'test', {
		value: props,
		writable: true,
		configurable: true,
		enumerable: false
	});
};

/**
 * Generate a documentation of the class.
 * @param string $classname name of the class
 * @param wnClass $docSource class object source
 */
wnBuild.prototype.makeDoc = function (className, docSource)
{

	if (this.classes[className]==undefined)
		return false;

	var comments = docSource.match(/\/\*[\s\S]+?\*\//gim),
		blackList = 'methods extend private public';

	for (c in comments)
		if (c < 2)
			docSource=docSource.replace(comments[c],'');

	var findIt = new RegExp('','gim'),
		matchDoc = new RegExp('','gim'),
		matches = docSource.match(/\/\*[\s\S]+?\*\/\s+\w+\:/gim);

	var props = {}, type= 'undefined';
	for (m in matches)
	{
		var	def = matches[m],
			getDoc = def.match(/[\/\*\*](\W|\w)+[\*\/]/gim)[0],
			prop = def.replace(/[\/\*\*](\W|\w)+[\*\/]/gim,'').replace(/\W/gim,''),
			params = def.match(/@param \$[\w]+ [\w]+ .+/g),
			paramsList = [];
		if (blackList.indexOf(prop)!=-1)
		{
			type = prop;
			continue;
		}
		for (p in params)
		{
			var _param = {};
			var data = params[p].split(' ')
			_param.name = data[1];
			_param.accept = data[2];
			data=data.splice(3)
			_param.desc = data.join(' ');
			paramsList.push(_param);
		}
		props[prop] = {
			desc: getDoc,
			type: type
		};
		if (type == 'methods')
			props[prop].params = paramsList;
	}

	Object.defineProperty(this.classes[className], 'doc', {
		value: props,
		writable: true,
		configurable: true,
		enumerable: false
	});
};
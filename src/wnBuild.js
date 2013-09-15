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

/**
 * Constructor;
 */
function wnBuild(sourceCode,parent)
{
	self=this;

	if (!parent.getModulePath || !parent.getClassName || !parent.npmPath)
		{ console.log('BUILD ERROR: '+parent+' is not a module.'); process.exit(); }

	buildStart=+new Date;

	// Owner of the build.
	this.parent = parent;
	// Store classes's file source
	this.classesCode = sourceCode;
	// Object to store classes's build object.
	this.classesBuild = {};
	// Store classes.
	this.classes = {};
	// Object to store not compiled class source
	this.classesSource = {};
	// Object to store compiled class source
	this.compiledSource = {};
	// Object to store VM.Script from each class.
	this.vmScript = {};

	// Store parent information.
	this.modulePath = parent.getModulePath() || '.';
	this.npmPath = parent.npmPath || [];
	this.moduleClass = parent.getClassName() || 'WNS';

	// NPM already loaded modules.
	this.loadedModules = {};

	this.load();

	this.onDebug = function (event, exec_state, event_data, data) {
	    try {
	        if (event == Debug.DebugEvent.BeforeCompile) {
	            if (Debug.ScriptCompilationType.Eval === event_data.script().compilationType()) {
	                var source = event_data.script().source();
	                if (source.match(/^\/\/\@\w+/gim)) {
	                    var className = source.match(/^\/\/\@\w+/gim),
                            id = source.match(/\/\/\#[\w|\-]+/gim) || '';
	                    id = id ? id[0].split('#')[1] : '';
	                    cName = className[0].split('@')[1];

	                    if (className && !self.debugScripts[id + '/' + cName]) {
	                        self.debugScripts[id + '/' + cName] = source;
	                        var fileName = self.moduleClass + "/" + cName;
	                        if (id !== '') {
	                            fileName = self.moduleClass + "/" + cName + "/" + id;
	                        }
	                        event_data.script().setSource(event_data.script().source() +
                                " //@ sourceURL=_" + fileName + ".js");
	                    }
	                }
	            }
	        }
	    } catch (e) {
	    }
	}

	if (v8debug) {
	    var Debug = v8debug.Debug;
	    Debug.setListener(this.onDebug);
	}
};

/**
 * Add a specifica source code to the builder
 * @param string $className
 * @param string $sourceCode
 */
wnBuild.prototype.addSource = function (className,sourceCode,withoutLoad)
{
	if (typeof className !== 'string'||typeof sourceCode !== 'string')
		return false;

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
			build[b]=Object.extend(true,build[b],newbuild[b]);
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
		module = { exports: {} };
		source = this.classesCode[c];
		this.classesBuild[c] = { extend: [], public: {}, private: {}, methods:{}, dependencies: {}};

		// Eval class source or a list of sources.
		if (typeof source == 'string')
		{
			eval(source);
			this.extend(this.classesBuild[c],module.exports,c);
		}
		else if (source instanceof Array)
			for (s in source)
			{
				eval(source[s]);
				this.extend(this.classesBuild[c],module.exports,c);
			}
	}


	for (c in loadList)
	{
		// Remove invalid dependencies.
		this.classesBuild[c].extend = this.removeInvalidDependencies(this.classesBuild[c].extend);
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

	// Compile and compress the class source code and create a prototype.
	this.compileClass(className);

	// Create a function to create a new instance from the prototype when called.
	var build = self.classesBuild[className];
	// var ctx = vm.createContext(global);
	// ctx.builder = this;
	var evalBuilder = "var classBuilder = function () {\n";
		evalBuilder += '	this.builder.vmScript[className].runInThisContext();\n';
		evalBuilder += "	var klass = new classObject;\n";
		evalBuilder += '	klass.construct&&klass.construct.apply(klass,arguments);\n';
		evalBuilder += '	return klass;\n};';
	eval(evalBuilder);
	classBuilder.prototype.builder = this;

	Object.defineProperty(classBuilder, 'build', {
		value: this.classesBuild[className],
		writable: false,
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(classBuilder, 'source', {
		value: this.classesSource[className],
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
 * Minify the code.
 * @param string $code
 * @param string $className
 * @return string
 */
wnBuild.prototype.minify = function (code,className) {
	return code;
};

/**
 * Get the target class's builder.
 * Create a source code from it.
 * Compile the source. (if not DEV mode minify it)
 * Save the new prototype object.
 * @param string $className
 * @param array $extend class extension list
 */
wnBuild.prototype.compileClass = function (targetClass)
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
			var extendSource = builder.classesSource[fullExtend[e]];
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
		classSource += 'var _=underscore,$$=self,';
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
			if (p == 'proto' || p == 'klass')
				continue;
			if (typeof build.public[p] != 'function')
				classSource += "proto['"+p+"'] = "+util.inspect(build.public[p],false,null,false)+";\n";
			else
				classSource += "proto['"+p+"'] = "+build.public[m].toString()+";\n";
		}

		// Declare privileged methods
		classSource += '\n// Declaring privileged methods\n';
		for (m in build.methods)
		{
			classSource += "proto['"+m+"'] = "+build.methods[m].toString()+";\n";
		}

		// Declare the constructor.
		classSource += '\n// Constructor\n';
		if (build.hasOwnProperty('constructor') && build.constructor!==undefined)
			classSource += 'proto.construct='+build.constructor.toString()+";\n";

		// Replace all unknown functions.
		classSource = classSource.replace(/\[Function\]/gim, 'function () {}');

		// Add to the classLoader source code the class's sourceCode.
		classLoader += classSource+'\n return klass; })();';

		// Try to minify the sourceCode.
		classLoader=builder.minify(classLoader,targetClass);

		// Store the compiled and not compiled source code.
		this.classesSource[targetClass] = classSource;
		this.compiledSource[targetClass] = classLoader;

		// Create a VM.Script from the classLoader;
		this.vmScript[targetClass] = vm.createScript(classLoader);
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
 * @return object
 */
wnBuild.prototype.recompile = function (className,obj)
{
	this.classes[className] = this.classes[className] || {};
	this.classes[className].loaded = false;
	var _nc = Object.extend(true,this.classesBuild[className],obj);
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
wnBuild.prototype.makeTest = function (className)
{

	if (this.classes[className]==undefined)
		return false;

	var sources;
	if (this.classesCode[className] instanceof Array)
		sources=this.classesCode[className];
	else 
		sources = [this.classesCode[className]];
	for (s in sources)
	{
		var docSource = sources[s];

		var comments = docSource.match(/\/\*[\s\S]+?\*\//gim),
			blackList = 'methods extend private public';
			typeList = 'this boolean string function array object self';

		for (c in comments)
			if (c < 2)
				docSource=docSource.replace(comments[c],'');

		var findIt = new RegExp('','gim');
		var matchDoc = new RegExp('','gim');
		var matches = docSource.match(/\/\*[\s\S]+?\*\/\s+\w+\:/gim);
		var props = this.classes[className].test || {}, type= 'undefined';

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

	}
};

/**
 * Generate a documentation of the class.
 * @param string $classname name of the class
 * @param wnClass $docSource class object source
 */
wnBuild.prototype.makeDoc = function (className)
{
	if (this.classes[className]==undefined)
		return false;

	var sources;
	if (this.classesCode[className] instanceof Array)
		sources=this.classesCode[className];
	else 
		sources = [this.classesCode[className]];

	for (s in sources)
	{

		var docSource = sources[s];
		var comments = docSource.match(/\/\*[\s\S]+?\*\//gim),
			blackList = 'methods extend private public';

		for (c in comments)
			if (c < 2)
				docSource=docSource.replace(comments[c],'');

		var findIt = new RegExp('','gim'),
			matchDoc = new RegExp('','gim'),
			matches = docSource.match(/\/\*[\s\S]+?\*\/\s+\w+\:/gim);

		var props = this.classes[className].doc || {}, type= 'undefined';
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

	}
};
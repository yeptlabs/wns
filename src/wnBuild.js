/**
 * Source of the wnBuild class.
 * 
 * @author: Pedro Nasser
 * @link: http://wns.yept.net/
 * @license: http://yept.net/projects/wns/#license
 * @copyright: Copyright &copy; 2012 WNS
 */

/**
 * This class it's the main class of WNS.
 * It converts JSON, in the correct format, to WNS classes.
 *
 * @author Pedro Nasser
 * @package system
 * @since 1.0.0
 */

module.exports=wnBuild;

/**
 * Constructor
 */
function wnBuild(classesSource)
{
	this.classesSource = {};

	for (c in classesSource)
	{
		if (this.checkStructure(classesSource[c]))
		{
			this.classesSource[c] = Object.extend({ extend: [], public: {}, private: {}, methods:{} },classesSource[c]);
			if (!this.classesSource[c].extend)
				this.classesSource[c].extend = [];
		}
	}

	for (c in this.classesSource)
	{
		this.classesSource[c].extend = this.removeInvalidDependencies(this.classesSource[c].extend);
	}
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
 * Recompile a class from classesSource with new properties.
 * @param string $className class name
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
	{
		return _c;
	} else
	{
		return this.classes[className];
	}
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
		_ext = [],
		sourceCode = this.compileClass(className);

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

	var __builder = this,
		__extend = build.extend;
	eval("var classBuilder = function "+className+"() { return this.build.apply(undefined,arguments); }");
	eval("var klass = function "+className+"() {}");

	// Class builder.
	classBuilder.prototype.build = function () {
		eval('var '+className+' = new klass;');
		eval('var self = '+className+';');
		for (e in build.extend)
		{
			var extendSource = __builder.classes[build.extend[e]].source.replace(/\[CLASSNAME\]/g,className);
			eval(extendSource);
		}
		eval(sourceCode.replace(/\[CLASSNAME\]/g,className));
		eval(className+'.constructor&&'+className+'.constructor.apply('+className+', arguments);');
		return self;
	};

	Object.defineProperty(classBuilder, 'build', {
		value: build,
		writable: false,
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(classBuilder, 'source', {
		value: sourceCode,
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

wnBuild.prototype.compileClass = function (targetClass)
{
	var targetClass = targetClass+'',
		sourceClass = '[CLASSNAME]';
	if (!this.classesSource[targetClass] || this.classesSource[targetClass].source)
		return 'k.constructor=function () { throw new Error("Error on compiling class `'+targetClass+'`"); }';

	var classSource = sourceClass+".className = '"+sourceClass+"';\n",
		builder = this,
		build = this.classesSource[targetClass];
		
	classSource += "(function () {\n";

		classSource += "var _=self,";
		// Declare private vars
		for (p in build.private)
		{
			if (p == '__builder')
				continue;
			if (typeof build.private[p] != 'function')
				classSource += p+" = "+util.inspect(build.private[p],false,null,false);
			else
				classSource += p+" = "+build.private[m].toString();
			classSource+=",";
		}
		classSource=classSource.substr(0,classSource.length-1)+";\n";
	
		// Redeclare privileged methods
		for (m in build.methods)
		{
			classSource += sourceClass+"['"+m+"'] = "+build.methods[m].toString()+";\n";
		}

	classSource += "})();\n";

	// Declare public vars
	for (p in build.public)
	{
		if (p == '__builder')
			continue;
		if (typeof build.public[p] != 'function')
			classSource += sourceClass+"['"+p+"'] = "+util.inspect(build.public[p],false,null,false)+"; ";
		else
			classSource += sourceClass+"['"+p+"'] = "+build.public[m].toString()+"; ";
	}

	if (build.hasOwnProperty('constructor'))
		classSource += sourceClass+'.constructor='+build.constructor.toString()+";\n";

	// Replace all unknown functions.
	classSource = classSource.replace(/\[Function\]/gim, 'function () {}');

	return classSource;
}

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
 * Create new memory instance to the object
 * @param mixed $property any kind of property
 * @result mixed new instance of the property
 */
wnBuild.prototype.newValue = function (property)
{
	if (property == null || property == undefined)
		return property;

	var type = typeof property;

	if (type != 'object')
	{
		if (property==undefined || property==null)
			return property;
		if (type === 'function')
			return property;
		if (type === 'boolean')
			return property == true;
		if (type == 'string')
			return property + "";
		var _i = new (global[type.substr(0,1).toUpperCase()+type.substr(1).toLowerCase()])(property);

		return (type == 'number') && _i.toValue ? _i.toValue() : _i;
	}
	else {
		if (property.length != undefined)
		{
			var obj = new Array;
			for (p in property)
				obj.push(property[p]);
			return obj;
		} else
		{
			var obj=new Object;
			for (p in property)
				obj[p]=property[p];
			return obj;
		}
	}
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

	var props = {};
	for (m in matches)
	{
		var	def = matches[m],
			getDoc = def.match(/[\/\*\*](\W|\w)+[\*\/]/gim)[0],
			prop = def.replace(/[\/\*\*](\W|\w)+[\*\/]/gim,'').replace(/\W/gim,'');
		if (blackList.indexOf(prop)!=-1)
			continue;
		props[prop] = getDoc;
	}

	Object.defineProperty(this.classes[className], 'doc', {
		value: props,
		writable: true,
		configurable: true,
		enumerable: false
	});
};
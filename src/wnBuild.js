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
			this.classesSource[c] = classesSource[c];
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
		self = this,
		_ext = [];

	(function (extend) {
		for (e in extend)
		{
			var ext=_ext.reverse();
				ext.push(extend[e]);
				ext.reverse();
				_ext=ext;
			arguments.callee(self.classes[extend[e]].build.extend);
		}
	})(build.extend);
	build.extend = _ext;

	var __builder = this;
	eval("var classBuilder = function "+className+"() { return this.build.apply(undefined,arguments); }");
	eval("var klass = function "+className+"() {}");

	// Class builder.
	classBuilder.prototype.build = function () {

		var k = new klass;

		// Importing extensions
		for (e in build.extend)
		{

				(function () {

					var extendBuild=self.classes[build.extend[e]].build;

					// Declare private variables
					for (p in extendBuild.private)
					{
						if (p == '__builder')
							continue;
						eval('var '+p+' = __builder.newValue(extendBuild.private[p]);');
					}

					var _className = self.newValue(className),
						_extend = self.newValue(build.extend),
						_buildMethods = self.newValue(extendBuild.methods),
						extendBuild=self.classes[build.extend[e]].build;

					// Redeclare privileged methods.
					for (m in _buildMethods)
					{
						k[m] = eval('['+_buildMethods[m].toString()+']')[0];
					}
				
					// Push public vars to the build
					Object.extend(true,build.public,extendBuild.public);

					var extendBuild=self.classes[build.extend[e]].build;

					// Define this constructor as the main constructor.
					if (extendBuild.propertyIsEnumerable('constructor'))
						build.constructor=eval('['+extendBuild.constructor+']')[0];

				})();
		}

		// Import local build
		Object.extend(true,build.public,targetClass.public);
		Object.extend(true,build.methods,targetClass.methods);
		Object.extend(true,build.private,targetClass.private);

		// Redeclare;
		(function () {
		
			// Declare private vars
			for (p in build.private)
			{
				if (p == '__builder')
					continue;
				eval('var '+p+' = __builder.newValue(build.private[p]);');
			}

			// Redeclare privileged methods
			for (m in build.methods)
			{
				k[m] = eval('['+build.methods[m].toString()+']')[0];
			}

		})();

		// Import constructor
		k.constructor=build.constructor;
		if (targetClass.propertyIsEnumerable('constructor'))
			k.constructor = targetClass.constructor;

		// Redeclare public vars
		for (p in build.public)
		{
			k[p] = __builder.newValue(build.public[p]);
		}

		// Call constructor.
		k.constructor&&k.constructor.apply(k, arguments);

		return k;
	
	};

	Object.defineProperty(classBuilder, 'build', {
		value: build,
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
 * Check class source structure.
 * @param object $targetClass class source object
 * @return boolean is this json structure in the right format?
 */
wnBuild.prototype.checkStructure = function (targetClass)
{
	return targetClass && targetClass.private && targetClass.public && targetClass.methods;
};

/**
 * Check class dependencies
 * @param array $extensions extension list
 * @return boolean are all extensions already loaded?
 */
wnBuild.prototype.checkDependencies = function (extensions)
{
	if (typeof extensions != 'object')
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
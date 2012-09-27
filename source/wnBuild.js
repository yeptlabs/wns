/**
 * Source of the wnBuild class.
 * 
 * @author: Pedro Nasser
 * @link: http://pedroncs.com/projects/webnode/
 * @license: http://pedroncs.com/projects/webnode/#license
 * @copyright: Copyright &copy; 2012 WebNode Server
 */

/**
 * {full_description}
 *
 * @author Pedro Nasser
 * @version $Id$
 * @pagackge system.base
 * @since 1.0.0
 */

module.exports=wnBuild;

/* wnBuild Class */
function wnBuild(classes) {

	// Import classes.
	this.classes = classes || {};

	// Result;
	this.result = {};

};

/**
 * Recompile and class.
 * @param STRING $className
 * @param OBJECT $obj
 */
wnBuild.prototype.recompile = function (className,obj) {

	this.result[className].loaded = false;

	var _nc = Object.extend(true,this.result[className].build,obj);
		_c=this.buildClass(_nc,className);
	if (_c && _c.loaded == true) { // Loaded.
		return _c;
	} else { //Invalid structure
		return this.result[className];
	}

};

/**
 * Build all classes.
 */
wnBuild.prototype.build = function () {

	var _done = 0;
	for (c in this.classes) { if (this.classes[c] != undefined && this.classes[c].loaded != true) _done++; }

	while (_done > 0) {
		for (c in this.classes)
		{
			if (this.classes[c] != undefined && this.classes[c].loaded != true) {
				var _c=this.buildClass(this.classes[c],c);
				if (_c) { // Loaded.
					_done--;
					this.result[c] = _c;
				} else if (_c == -1) { //Invalid structure
					_done--;
					delete this.classes[c];
				}
			}
		}
	}

	return this.result;

};

/**
 * Build a single class.
 * @param OBJECT $targetClass
 * @param STRING $className
 */
wnBuild.prototype.buildClass = function (targetClass,className) {

	// Checking object structure...
	if (!this.checkStructure(targetClass)) return -1;

	// Checking dependencies...
	if (!this.checkDependencies(targetClass.extend)) return false;

	// Remove invalid dependencies...
	targetClass.extend = this.removeInvalidDependencies(targetClass.extend);

	// Build object.
	var build = {};

	// Importing from dependencies..
	for (k in targetClass.extend)
	{
		Object.extend(true,build,this.result[targetClass.extend[k]].build);
	}

	// Importing from targetClass
	Object.extend(true,build,targetClass);

	// Creating descriptor of the public properties and methods..
	var desc = this.createDescriptor(build);

	// Get builder.
	var _builder = this;
	eval("var klass = function "+className+"() {}");

	// Importing descriptor.
	Object.defineProperties(klass.prototype,desc);

	// Class builder.
	function classInstance() {

		var k = new klass;
	
		// Import private.
		for (p in build.private) {
			k[p] = build.private[p];
		}
		// Import private methods
		for (m in build.methods) {
			k[m] = build.methods[m];
		}

		// Import constructor
		k.constructor = build.constructor;

		// Redeclare public vars
		for (p in build.public) {
			k[p] = _builder.newValue(build.public[p]);
		}

		// Call constructor.
		k.constructor.apply(k, arguments);

		return k;
	
	};

	// Save the descriptor
	Object.defineProperty(classInstance, 'build', {
		value: build,
		writable: false,
		enumerable: false,
		configurable: false
	});

	// Define as loaded.
	Object.defineProperty(classInstance, 'loaded', {
		value: true,
		enumerable: false
	});

	return classInstance;

};

/**
 * Create the descriptor of all properties of the targetClass
 * @param OBJECT $targetClass
 */
wnBuild.prototype.createDescriptor = function (targetClass) {

	var _desc = {
		_private: {
			value: {}
		},
		_methods: {
			value: {}
		}
	};

	// Public import
	for (p in targetClass.public) {
		_desc[p] = {
			value: targetClass.public[p],
			enumerable: true,
			configurable: false,
			writable: true
		};
	}

	// Public import
	for (p in targetClass.private) {
		_desc._private.value[p] = targetClass.private[p];
	}

	// Methods import
	for (p in targetClass.methods) {
		// Its privileged?
		if (p.substr(0,1) == '_') {
			_desc._methods.value[p.substr(1)] = targetClass.methods[p];
		} else {
			_desc[p] = {
				value: targetClass.methods[p],
				enumerable: true,
				configurable: false,
				writable: true
			};
		}
	}

	return _desc;
}

/**
 * Check class source structure.
 * @param OBJECT $targetClass
 */
wnBuild.prototype.checkStructure = function (targetClass) {
	return targetClass && targetClass.private && targetClass.public && targetClass.extend && targetClass.methods && targetClass.constructor;
};

/**
 * Check class dependencies
 * @param ARRAY $extensions
 */
wnBuild.prototype.checkDependencies = function (extensions) {
	if (typeof extensions != 'object') return false;
	for (e in extensions)
	{
		if (this.result[extensions[e]] == undefined || this.result[extensions[e]].loaded != true) return false;
	}
	return true;
};

/**
 * Remove class invalid dependencies.
 * @param ARRAY $extensions
 */
wnBuild.prototype.removeInvalidDependencies = function (extensions) {
	var _ext = [];
	for (e in extensions)
	{
		if (this.classes[extensions[e]] != undefined) _ext.push(extensions[e]);
	}
	return _ext;
};

/**
 * Create new memory variable to the property.
 * @param ANY $property
 */
wnBuild.prototype.newValue = function (property) {
	var type = typeof property;
	if (type != 'object') {
		if (property==undefined || property==null) return property;
		if (type === 'function') return property;
		if (type == 'string') return property + "";
		var _i = new (global[type.substr(0,1).toUpperCase()+type.substr(1).toLowerCase()])(property);
		return (type == 'number') && _i.toValue ? _i.toValue() : _i;
	}
	else {
		if (property.length != undefined) {
			var obj = new Array;
			for (p in property) obj.push(property[p]);
			return obj;
		} else {
			var obj=new Object;
			for (p in property) obj[p]=property[p];
			return obj;

		}
	}
};
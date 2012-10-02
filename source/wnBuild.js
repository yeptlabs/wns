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
function wnBuild(classesSource) {

	this.classesSource = {};

	// Import classes.
	for (c in classesSource)
	{
		// Remove invalid classes.
		if (this.checkStructure(classesSource[c])) {
			this.classesSource[c] = classesSource[c];
			// Remove invalid dependencies...
			if (!this.classesSource[c].extend) this.classesSource[c].extend = [];
		}
	}

	// Remove invalid dependencies
	for (c in this.classesSource)
	{
		// Remove a invalid extend if has been deleted.
		this.classesSource[c].extend = this.removeInvalidDependencies(this.classesSource[c].extend);
	}

};

/**
 * Recompile a class from classesSource with new properties.
 * @param STRING $className
 * @param OBJECT $obj
 * @param OBJECT recompiled class object
 */
wnBuild.prototype.recompile = function (className,obj) {

	if (!this.classes[className].loaded) return false;

	this.classes[className].loaded = false;

	var _nc = Object.extend(true,this.classes[className].build,obj);
		_c=this.buildClass(className);
	if (_c.loaded == true) { // Loaded.
		return _c;
	} else {
		return this.classes[className];
	}

};

/**
 * Build all classes.
 * @return OBJECT object with the result of class compilation
 */
wnBuild.prototype.build = function () {

	var _done = 0;
	for (c in this.classesSource) { if (this.classesSource[c] != undefined && this.classesSource[c].loaded != true) _done++; }

	this.classes = {};
	while (_done > 0) {
		for (c in this.classesSource)
		{
			if (this.classes[c] == undefined) {
				var _c=this.buildClass(c);
				if (_c.loaded == true) { // Loaded.
					_done--;
					this.classes[c] = _c;
				} else if (_c == -1) { //Invalid structure
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
 * @param OBJECT $targetClass
 * @param STRING $className
 * @return OBJECT class builder
 */
wnBuild.prototype.buildClass = function (className) {

	var targetClass = this.classesSource[className];

	// Check if extension is ready.
	if (!this.checkDependencies(targetClass.extend)) return false;

	// Build object.
	var build = {
		constructor: function () {},
		methods: {},
		public: {}
	};

	// Importing from dependencies..
	build.extendMethods = {};
	var self = this;
	for (k in targetClass.extend)
	{
		(function () {
			var extendBuild=self.classes[targetClass.extend[k]].build;

			var foundit = false;
			// Declare private variables
			for (p in extendBuild.private) {
				eval('var '+p+' = extendBuild.private[p];');
			}

			// Redeclare privileged methods.
			for (m in extendBuild.methods) {
				build.methods[m] = eval('['+extendBuild.methods[m].toString()+']')[0];
			}

			// Push public vars to the build
			Object.extend(true,build.public,extendBuild.public);

			// Define this constructor as the main constructor.
			build.constructor=eval('['+extendBuild.constructor+']')[0] || build.constructor;

		})();
	}

	// Importing from targetClass
	Object.extend(true,build,targetClass);

	// Creating descriptor of the public properties and methods..
	var desc = this.createDescriptor(build);

	// Get builder.
	var _builder = this;
	eval("var classBuilder = function "+className+"() { return this.build.apply(undefined,arguments); }");
	eval("var klass = function "+className+"() {}");

	// Importing descriptor.
	Object.defineProperties(klass.prototype,desc);

	// Class builder.
	classBuilder.prototype.build = function () {

		var k = new klass;

		// Declare private vars
		for (p in build.private) {
			eval('var '+p+' = build.private[p];');
		}

		// Redeclare privileged methods
		for (m in targetClass.methods) {
			k[m] = eval('['+targetClass.methods[m].toString()+']')[0];
		}

		// Import constructor
		k.constructor = build.constructor;

		// Redeclare public vars
		for (p in build.public) {
			k[p] = _builder.newValue(build.public[p]);
		}

		// Call constructor.
		k.constructor&&k.constructor.apply(k, arguments);

		return k;
	
	};

	// Save the descriptor
	Object.defineProperty(classBuilder, 'build', {
		value: build,
		writable: false,
		enumerable: false,
		configurable: false
	});

	// Define as loaded.
	Object.defineProperty(classBuilder, 'loaded', {
		value: true,
		enumerable: false
	});

	return classBuilder;

};

/**
 * Create the descriptor of all properties of the targetClass
 * @param OBJECT $targetClass
 * @return OBJECT result descriptor
 */
wnBuild.prototype.createDescriptor = function (targetClass) {

	var descriptor = {
		_private: {
			value: {}
		},
		_methods: {
			value: {}
		}
	};

	// Public import
	for (p in targetClass.public) {
		descriptor[p] = {
			value: targetClass.public[p],
			enumerable: true,
			configurable: false,
			writable: true
		};
	}

	// Public import
	for (p in targetClass.private) {
		descriptor._private.value[p] = targetClass.private[p];
	}

	// Methods import
	for (p in targetClass.methods) {
		// Its privileged?
		if (p.substr(0,1) == '_') {
			descriptor._methods.value[p.substr(1)] = targetClass.methods[p];
		} else {
			descriptor[p] = {
				value: targetClass.methods[p],
				enumerable: true,
				configurable: false,
				writable: true
			};
		}
	}

	return descriptor;
}

/**
 * Check class source structure.
 * @param OBJECT $targetClass
 * @return BOOLEAN true if structure is correct, false if not
 */
wnBuild.prototype.checkStructure = function (targetClass) {
	return targetClass && targetClass.private && targetClass.public && targetClass.methods;
};

/**
 * Check class dependencies
 * @param ARRAY $extensions
 * @return BOOLEAN true if all dependencies are already loaded
 */
wnBuild.prototype.checkDependencies = function (extensions) {
	if (typeof extensions != 'object') return false;
	for (e in extensions)
	{
		if (this.classes[extensions[e]] == undefined || this.classes[extensions[e]].loaded != true) return false;
	}
	return true;
};

/**
 * Remove class invalid dependencies.
 * @param ARRAY $extensions
 * @return ARRAY valid extensions and if its not ok remove from the list
 */
wnBuild.prototype.removeInvalidDependencies = function (extensions) {
	var _ext = [];
	for (e in extensions)
	{
		if (this.classesSource[extensions[e]] != undefined) _ext.push(extensions[e]);
	}
	return _ext;
};

/**
 * Create new memory variable to the property.
 * @param ANY $property
 * @result ANY new instance of the data
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
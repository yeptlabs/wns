/**
 * UTIL: Object functions extension.
 */

var	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,
	class2type = {
	  "[object Boolean]": "boolean",
	  "[object Number]": "number",
	  "[object String]": "string",
	  "[object Function]": "function",
	  "[object Array]": "array",
	  "[object Date]": "date",
	  "[object RegExp]": "regexp",
	  "[object Object]": "object"
	},
	jQuery = {
	  isFunction: function (obj) {
		return jQuery.type(obj) === "function"
	  },
	  isArray: Array.isArray ||
	  function (obj) {
		return jQuery.type(obj) === "array"
	  },
	  isWindow: function (obj) {
		return obj != null && obj == obj.window
	  },
	  isNumeric: function (obj) {
		return !isNaN(parseFloat(obj)) && isFinite(obj)
	  },
	  type: function (obj) {
		return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
	  },
	  isPlainObject: function (obj) {
		if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
		  return false
		}
		try {
		  if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
			return false
		  }
		} catch (e) {
		  return false
		}
		var key;
		for (key in obj) {}
		return key === undefined || hasOwn.call(obj, key)
	  }
	};

module.exports = {

	isEmpty: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	}

};
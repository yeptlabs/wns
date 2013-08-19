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

	// Is a given value an array?
	// Delegates to ECMA5's native Array.isArray
	isArray: function(obj) {
	  return toString.call(obj) == '[object Array]';
	},

	// Is a given variable an object?
	isObject: function(obj) {
	  return obj === Object(obj);
	}

};
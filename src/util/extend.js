/**
 * UTIL: Method that extends `this` or the target with other object's properties
 * Got from jQuery source (http://jquery.com/)
 * @param boolean $deep (optional) if true, the merge becomes recursive (aka. deep copy).
 * @param object $target (optional) the object to extend. It will receive the new properties.
 * @param object $object1 an object containing additional properties to merge in.
 * @param object $objectN (optional) additional objects containing properties to merge in.
 * @param object the merge of the target and the other objects
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

// module.exports = function () {
// 	var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
// 		i = 1,
// 		length = arguments.length,
// 		deep = false;

// 	  if (typeof target === "boolean") {
// 		deep = target;
// 		target = arguments[1] || {};
// 		i = 2;
// 	  }
// 	  if (typeof target !== "object" && !jQuery.isFunction(target)) {
// 		target = {}
// 	  }
// 	  if (length === i) {
// 		target = this;
// 		--i;
// 	  }
// 	  for (i; i < length; i++) {
// 		if ((options = arguments[i]) != null) {
// 		  for (name in options) {
// 			src = target[name];
// 			copy = options[name];
// 			if (target === copy) {
// 			  continue
// 			}
// 			if (deep && name != 'super_' && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
// 			  if (copyIsArray) {
// 				copyIsArray = false;
// 				clone = src && jQuery.isArray(src) ? src : []
// 			  } else {
// 				clone = src && jQuery.isPlainObject(src) ? src : {};
// 			  }
// 			  // WARNING: RECURSION
// 			  target[name] = this.extend(deep, clone, copy);
// 			} else if (copy !== undefined) {
// 			  target[name] = copy;
// 			}
// 		  }
// 		}
// 	  }
// 	return target;
// }

module.exports = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy || copy === options ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && name != 'super_' && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = this.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};
/**
 * Source of the wnObject class.
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

// Exports.
module.exports = wnObject;
	
/**
 * Constructor
 * {description}
 */	
function wnObject() {}

/**
 * Method that extends `this` or the target with other object's properties
 * Got from jQuery source (http://jquery.com/)
 * @param boolean $deep (optional) if true, the merge becomes recursive (aka. deep copy).
 * @param object $target (optional) the object to extend. It will receive the new properties.
 * @param object $object1 an object containing additional properties to merge in.
 * @param object $objectN (optional) additional objects containing properties to merge in.
 * @param object the merge of the target and the other objects
 */
wnObject.extend = function () {
	var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false,
		toString = Object.prototype.toString,
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
	  if (typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		i = 2;
	  }
	  if (typeof target !== "object" && !jQuery.isFunction(target)) {
		target = {}
	  }
	  if (length === i) {
		target = this;
		--i;
	  }
	  for (i; i < length; i++) {
		if ((options = arguments[i]) != null) {
		  for (name in options) {
			src = target[name];
			copy = options[name];
			if (target === copy) {
			  continue
			}
			if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
			  if (copyIsArray) {
				copyIsArray = false;
				clone = src && jQuery.isArray(src) ? src : []
			  } else {
				clone = src && jQuery.isPlainObject(src) ? src : {};
			  }
			  // WARNING: RECURSION
			  target[name] = this.extend(deep, clone, copy);
			} else if (copy !== undefined) {
			  target[name] = copy;
			}
		  }
		}
	  }
	return target;
}
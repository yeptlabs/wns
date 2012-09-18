/**
 * Source of the wnUrlManager class.
 * 
 * @author: Pedro Nasser
 * @link: http://pedroncs.com/projects/webnode/
 * @license: http://pedroncs.com/projects/webnode/#license
 * @copyright: Copyright © 2012 WebNode Server
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
module.exports = wnUrlManager;
	
// wnUrlManager Class
function wnUrlManager (parent) {

	/**
	 * Constructor
	 * {description}
	 */
	this.construct = function (parent) {
		// Extend with the parent..
		this.super_=parent;
	}

	/**
	 * @var object the URL rules (pattern=>route).
	 */
	this.rules = [
		["<file:.*\\.\\w+>","<file>"],
		["<controller:[\\w'-]+>/<action:[\\w|\\W]+>","<controller>/<action>"]
	];

	/**
	 * Return the object with all the rules in the format (pattern=>route)
	 * @return object list of all rules
	 */
	this.getRules = function () {
		return this.rules;
	};

	/**
	 * @var array where it stores all wnUrlRule objects
	 */
	 this._rules = [];

	/**
	 * Returns the list of wnUrlRule objects
	 * @return array list of all wnUrlRules
	 */
	this.getRulesList = function () {
		return this._rules;
	};

	/**
	 * Extends the rules object with new rules (possible overwrite)
	 * @param object $rules new rules (pattern=>route)
	 * @return wnUrlManager instance
	 */
	this.addRules = function (rules) {
		if (typeof rules == 'object') {
			var _rules = this.rules.reverse();
			for (r in rules) {
				_rules.push([r,rules[r]]);
			}
			this.rules = _rules.reverse();
		}
		return this;
	};

	/**
	 * Clear the array of wnUrlRule and then creates all rules again from the rules object.
	 * @return wnUrlManager instance
	 */
	this.process = function () {
		// Clear all instance of 
		delete this._rules;
		this._rules = [];
		// Create and push new wnUrlRules
		for (r in this.rules) {
			var _r1 = this.rules[r][0].replace(/\x5C+/gim,"\x5C"),
				_r2 = this.rules[r][1].replace(/\x5C+/gim,"\x5C");
			this._rules.push(this.createUrlRule(_r2,_r1));
		}
		return this;
	}

	/**
	 * Creates a URL rule instance.
	 * @param string $route the route part of the rule
	 * @param string $pattern the pattern part of the rule
	 * @return wnUrlRule instance
	 */
	this.createUrlRule = function (route,pattern) {
		var _class = this.getUrlRuleClass();
		return new _class(route,pattern);
	}

	/**
	 * Get the class of the UrlRule
	 * @param string $route the route part of the rule
	 * @param string $pattern the pattern part of the rule
	 * @return wnUrlRule instance
	 */
	this.getUrlRuleClass = function () {
		return this.super_.c.wnUrlRule;
	}

	/**
	 * Find out which route rule is the right pattern.
	 * @return wnUrlRule instance
	 */
	this.parseRequest = function (request) {
		// Match the request with a all rules
		for (r in this._rules) {
			var _parsed = this._rules[r].parseRequest(this,request);
			if (_parsed != false) return _parsed;
		}
		return false;
	}

	// Construct function
	this.construct.apply(this,arguments);

}
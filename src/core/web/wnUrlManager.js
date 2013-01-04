/**
 * Source of the wnUrlManager class.
 * 
 * @author: Pedro Nasser
 * @link: http://wns.yept.net/
 * @license: http://yept.net/projects/wns/#license
 * @copyright: Copyright &copy; 2012 WNS
 */

/**
 * Description coming soon.
 *
 * @author Pedro Nasser
 * @package system.core.web
 * @since 1.0.0
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnComponent'],

	/**
	 * PRIVATE
	 */
	private: {
	
		_rules: []
	
	},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var object the URL rules (pattern=>route).
		 */
		rules: [
			["<file:.*\\.\\w+>","<file>"],
			["<controller:[\\w'-]+>/<action:[\\w|\\W]+>","<controller>/<action>"]
		],

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 */	
		init: function () {
			var newRules = this.getConfig('rules');
			this.addRules(newRules);
			this.process();
		},

		/**
		 * Return the object with all the rules in the format (pattern=>route)
		 * @return object list of all rules
		 */
		getRules: function ()
		{
			return this.rules;
		},

		/**
		 * Returns the list of wnUrlRule objects
		 * @return array list of all wnUrlRules
		 */
		getRulesList: function ()
		{
			return _rules;
		},

		/**
		 * Find out which route rule is the right pattern.
		 * @return wnUrlRule instance
		 */
		parseRequest: function (request)
		{
			// Match the request with a all rules
			for (r in _rules)
			{
				var _parsed = _rules[r].parseRequest(this,request);
				if (_parsed != false)
					return _parsed;
			}
			return false;
		},


		/**
		 * Get the class of the UrlRule
		 * @param string $route the route part of the rule
		 * @param string $pattern the pattern part of the rule
		 * @return wnUrlRule instance
		 */
		getUrlRuleClass: function () 
		{
			return this.c.wnUrlRule;
		},

		/**
		 * Creates a URL rule instance.
		 * @param string $route the route part of the rule
		 * @param string $pattern the pattern part of the rule
		 * @return wnUrlRule instance
		 */
		createUrlRule: function (route,pattern)
		{
			var _class = this.getUrlRuleClass();
			return new _class(route,pattern);
		},

		/**
		 * Extends the rules object with new rules (possible overwrite)
		 * @param object $rules new rules (pattern=>route)
		 * @return wnUrlManager instance
		 */
		addRules: function (rules)
		{
			if (typeof rules == 'object')
			{
				var _rules = this.rules;
				for (r in rules)
					_rules.unshift([r,rules[r]]);
				this.rules = _rules;
			}
			return this;
		},

		/**
		 * Clear the array of wnUrlRule and then creates all rules again from the rules object.
		 * @return wnUrlManager instance
		 */
		process: function ()
		{
			_rules = [];
			this._rules = [];
			for (r in this.rules)
			{
				var _r1 = this.rules[r][0].replace(/\x5C+/gim,"\x5C"),
					_r2 = this.rules[r][1].replace(/\x5C+/gim,"\x5C");
				_rules.push(this.createUrlRule(_r2,_r1));
			}
			return this;
		}

	}

};
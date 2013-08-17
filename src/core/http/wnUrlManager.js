/**
 * @WNS - The NodeJS Middleware and Framework
 * 
 * @copyright: Copyright &copy; 2012- YEPT &reg;
 * @page: http://wns.yept.net/
 * @docs: http://wns.yept.net/docs/
 * @license: http://wns.yept.net/license/
 */

/**
 * No description yet.
 *
 * @author Pedro Nasser
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
		rules: [],

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
			_rules = [];
			this.rules = [				
				["<file:.*\\.\\w+>","<file>"],
				["<controller:[\\w'-]+>/<action:[\\w|\\W]+>","<controller>/<action>"]
			];
			this.addRules(newRules,true);
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
		 * @return object
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
		addRules: function (rules,prepend)
		{
			if (typeof rules == 'object')
			{
				for (r in rules)
				{
					if (prepend)
						this.rules.unshift([r,rules[r]]);
					else
						this.rules.push([r,rules[r]]);
				}
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
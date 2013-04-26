/**
 * Source of the wnDustTemplate class.
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
	extend: ['wnTemplate'],

	/**
	 * NPM dependencies
	 */
	dependencies: ["dustjs-linkedin"],

	/**
	 * PRIVATE
	 *
	 * Only get and set by their respectives get and set private functions.
	 *
	 * Example:
	 * If has a property named $id.
	 * It's getter function will be `this.getId`, and it's setter `this.setId`.
	 * To define a PRIVILEGED function you put a underscore before the name.
	 */
	private: {},

	/**
	 * Public Variables
	 * Can be accessed and defined directly.
	 */
	public: {},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Render template.
		 */
		render: function (text,obj,cb)
		{
			// var compiled = dustjs_linkedin.compile(text, "tmp");
   //  		dustjs_linkedin.loadSource(compiled);
			// dustjs_linkedin.render('tmp',obj,cb);
			dustjs_linkedin.renderSource(text,obj,cb);
		}

	}

};
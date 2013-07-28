/**
 * Source of an wnScript class.
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
 * @package system.core.base
 * @since 1.0.0
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnScript'],

	/**
	 * PRIVATE Variables
	 */
	private: {},

	/**
	 * Public Variables
	 */
	public: {},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 */	
		init: function ()
		{
			this.setInterval(1000);
			this.start();
		},

		/**
		 * Function called every script loop.
		 * This is where the script should be written.
		 */
		run: function ()
		{	
			
		}

	}

};
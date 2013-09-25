/**
 * Extends WNS core's wnController class.
 */

// Exports
module.exports = {

	/**
	 * Public Variables
	 */
	public: {
		embedScript: [
			'//code.jquery.com/jquery.js',
			'/js/bootstrap.min.js'
		],
		clientScript: []
	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Called after any controller is initialized.
		 */	
		afterInit: function ()
		{
		}

	}

};
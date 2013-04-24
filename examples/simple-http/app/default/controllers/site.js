/**
 * Controller: Site
 *
 * @author Pedro Nasser
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnController'],

	/**
	 * PRIVATE
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
		 * Action: Index
		 */
		actionIndex: function () {
			this.title='Index';
			this.render('index');
		},

		/**
		 * Action: Error
		 */
		actionError: function () {
			this.title='ERROR';
			this.render('error');
		}

	}

};
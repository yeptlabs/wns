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
			this.title='Home';
			this.render('index');
		},

		/**
		 * Action: Signup
		 */
		actionSignup: function () {
			this.title='Sign up';
			this.render('signup');
		},

		/**
		 * Action: Signin
		 */
		actionSignin: function () {
			this.title='Sign in';
			this.render('signin');
		},

		/**
		 * Action: Error
		 */
		actionError: function () {
			if (this.request.code == 404)
			{
				this.title='Not found';
				this.render('notfound');
			}
			else
			{
				this.title='ERROR';
				this.render('error');
			}
		}

	}

};
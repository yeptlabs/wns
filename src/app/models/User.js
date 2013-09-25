/**
 * Example of a Active Record Model
 * 
 * @author: Pedro Nasser
 * @link: http://wns.yept.net/
 * @license: http://yept.net/projects/wns/#license
 * @copyright: Copyright &copy; 2012 WNS
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnActiveRecord'],

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
		 * Return the name of the db collection or table.
		 */
		collectionName: function ()
		{
			return 'User';
		},

		/**
		 * Example of a schema.
		 */
		schema: function ()
		{
			return {
				email: {
					type: String,
					label: 'Email'
				},
				name: {
					type: String,
					label: 'Name'
				},
				password: {
					type: String,
					label: 'Password'
				}
			};
		}
	}

};
/**
 * Source of the wnDbConnection class.
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
 * @package system.core.db
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
		_query: '',
		_queryHash: ''
	},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'result': {}
		}
	
	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer.
		 */	
		init: function (config,c,query)
		{
			this.setQuery(query);
		},

		/**
		 * Connect to the database
		 */
		setQuery: function (query)
		{
			_query = query+'';
			_queryHash = crypto.createHash('md5').update(_query).digest("hex");
		}
	
	}

};
/**
 * Source of the wnDbQuery class.
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
		_connection: null,
		_db: null,
		_query: null
	},

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
		init: function (config,c,conn,query)
		{
			_connection = conn;
			this.setQuery(query);
			_db = _connection.dataObject;
		},

		/**
		 * Returns the query object.
		 */
		getQuery: function ()
		{
			return _query;
		},

		/**
		 * Define as query.
		 * @param object $query 
		 */
		setQuery: function (query)
		{
			_query = query || {};
		},

		/**
		 * Executes the query.
		 * @param function $cb callback function
		 * @return boolean success?
		 */
		exec: function (cb)
		{
			_connection.getSchema().getQueryBuilder().exec(this.getQuery(),cb);
		}


	}

};
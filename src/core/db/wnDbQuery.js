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
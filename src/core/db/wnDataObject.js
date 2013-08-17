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
		_db: null
	},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var DRIVER_OBJECT database driver
		 */
		driver: undefined,

		/**
		 * @var string module's name of the database driver
		 */
		driverModule: '',

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'ready': {},
			'connect': {},
			'close': {},
			'result': {},
			'error': {}
		}

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer.
		 */		
		init: function (conn)
		{
			_db=conn;
		},

		/**
	 	 * @return wnDbConnection database connection. The connection is active.
	 	 */
		getDbConnection: function ()
		{
			return _db;
		},

		/**
		 * Data Object open connection.
		 */
		_open: function ()
		{
		},

		/**
		 * Execute a data request
		 * @param $params object parameters
		 * @param $cb function callback
		 */
		_execute: function (params,cb)
		{
			cb&&cb();
		},

		/**
		 * Execute a query
		 * @param $query string query
		 * @param $cb function callback
		 */
		_query: function (query,cb)
		{
			cb&&cb();
		}
	
	}

};
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
	extend: ['wnDataObject'],

	/**
	 * NPM dependencies
	 */
	dependencies: ['mysql'],

	/**
	 * PRIVATE
	 */
	private: {
		_serverConfig: {}
	},

	/**
	 * Public Variables
	 */
	public: {
		openFunc: '_open'
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
			this.driver = mysql;
		},

		/**
		 * Create mongodb connection then extend this class
		 * with all the Server object.
		 */
		_open: function ()
		{
			this.setConfig(_serverConfig);
			this.e.ready();
		},

		/**
		 * Connect to the database
		 * When it cannects it calls the callback function
		 * @param $cb function callback function
		 */
		_connect: function (cb)
		{
			var pool = this.driver.createPool(this.getConfig());
			pool.queueLimit = this.getConfig('queueLimit') || pool.queueLimit;
			pool.connectionLimit = this.getConfig('connectionLimit') || pool.connectionLimit;
			pool.getConnection(function (err,connection) {
				self.e.connect(err,connection);
				if (err)
				{
					cb(err,null);
				} else
				{
					cb(err,connection);
				}
			});
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
			this._connect(function (err,con) {
				if (con)
				{
					con.query(query,function (err,rows,fields) {
						self.e.result(err, rows, fields);
						cb&&cb(err,rows,fields);
						con.destroy();
					});
				} else
				{
					cb&&cb(err);
				}
			});
		}
	
	}

};
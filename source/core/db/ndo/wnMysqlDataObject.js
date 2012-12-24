/**
 * Source of the wnMysqlDataObject class.
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
	extend: ['wnDataObject'],

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

		/**
		 * @var string module's name of the database driver
		 */
		driverModule: 'mysql'

	},

	/**
	 * Methods
	 */
	methods: {

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
			var self = this,
				con = this.driver.createConnection(this.getConfig());
				
			con.connect(function (err) {
				self.e.connect(err,con);
				if (err)
				{
					cb(err,null);
				} else
				{
					cb(err,con);
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
			var self = this;
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
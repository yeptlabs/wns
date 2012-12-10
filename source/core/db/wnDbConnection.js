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
	private: {},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var boolean is still trying to connect to the database?
		 */
		connecting: false,

		/**
		 * @var boolean connection to the database failed?
		 */
		failed: false,

		/**
		 * @var boolean has been connected to the database successfully?
		 */
		connected: false,

		/**
		 * @var DATABASE_OBJECT where it will be stored the connection
		 */
		connection: undefined,

		/**
		 * @var integer setInterval UID
		 */
		keepAlive: -1,

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'connect': {},
			'close': {},
			'query': {},
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
		init: function ()
		{
			this.mysql = _r('mysql');
		},

		/**
		 * Connect to the database
		 */
		connect: function (cb)
		{

			var self = this,
				con = this.mysql.createConnection(this.getConfig());

			/*con.on('error', function (err) {
				if (!err.fatal) {
					console.log('NON FATAL: '+err.code)
				  return;
				}
				self.close(true);
				self.connect();
			});*/
				
			con.connect(function (err) {
				if (err)
				{
					cb(null);
				} else
				{
					cb(con);
				}
			});
		},

		/**
		 * Method that query the database and when the response comes,
		 * send the data to the callback function.
		 * @param $query string SQL to be query
		 * @param $callback function callback function
		 */
		query: function (query,cb,id)
		{
			var self=this;
			/*	queryClass = this.getParent().c.wnDbQuery,
				queryObj = new queryClass({ autoInit: false },this.getParent().c,query);
			queryObj.init();
			queryObj.once('result', function (e,err,rows,fields) {
					cb&&cb(err,rows,fields);
			});*/
			
			this.connect(function (con) {
				if (con == null)
					return false;
				//self.e.query(query,cb);
				con.query(query,function (err,rows,fields) {
					cb&&cb(err,rows,fields);
					/*self.e.result(err,rows,fields);
					queryObj.e.result(err,rows,fields,query);
					queryObj=null;*/
					con.destroy();
				});
			});
		}

		/**
		 * Terminate the connection
		 *
		close: function ()
		{
			if (this.connection!=undefined && this.connect._connectCalled)
			{
				this.connection.destroy();
				this.connecting = false;
				this.connected = false;
				this.failed = false;
				this.e.close();
			}
		}*/
	
	}

};
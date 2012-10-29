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
			this.connect();
		},

		/**
		 * Connect to the database
		 */
		connect: function ()
		{
			if (!(this.connected==true))
			{
				this.failed = false;
				this.connecting = true;
				this.mysql = _r('mysql');
				this.connection = this.mysql.createConnection(this.getConfig());

				this.connection.once('error', function () {
					this.close(true);
				}.bind(this));
					
				this.connection.connect(function (err) {
					if (err)
					{
						this.connected = false;
						this.failed = true;
						this.connecting = false;
					} else
					{
						this.connected = true;
						this.failed = false;
						this.connecting = false;
					}
					this.e.connect(err);
				}.bind(this));

			} else
				this.e.connect();
		},

		/**
		 * Method that query the database and when the response comes,
		 * send the data to the callback function.
		 * @param $query string SQL to be query
		 * @param $callback function callback function
		 */
		query: function (query,cb)
		{
			var self=this;
			this.once('result', function (e,err,rows,fields) {
				cb&&cb(err,rows,fields);
			});
			if (!this.connecting && this.connected)
			{
				this.e.query(query,cb);
				this.connection.query(query,function (err,rows,fields) {
					this.e.result(err,rows,fields);
				}.bind(this));
			} else
			{
				this.once('connect',function (e,err) {
					this.e.query(query,cb);
					this.connection.query(query,function (err,rows,fields) {
						this.e.result(err,rows,fields);
					}.bind(this));
				}.bind(this));
				this.connect();
			}
		},

		/**
		 * Terminate the connection
		 */
		close: function ()
		{
			if (this.connection)
			{
				this.connection.destroy();
				this.connecting = false;
				this.connected = false;
				this.failed = false;
				this.e.close();
			}
		}
	
	}

};
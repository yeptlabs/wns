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
	},

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
		keepAlive: -1
	
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
		 * @param $query string SQL to be query
		 * @param $callback function callback function
		 */
		connect: function ()
		{
			if (!this.connected==true)
			{
				this.failed = false;
				this.connecting = true;
				this.mysql = _r('mysql');
				this.connection = this.mysql.createConnection(this.getConfig());

				this.connection.connect(function (err) {
					if (err)
					{
						this.connected=false;
						this.failed=true;
						this.connecting = false;
					} else
					{
						this.connected=true;
						this.failed=false;
						this.connecting=false;
					}
				}.bind(this));

				(function () {
					if (this.connecting!=true)
						if (this.failed == false)
							this._query();
					else {
						setTimeout(arguments.callee.bind(this),500);
					}
				}.bind(this))();

				this.connection.on('error', function () {
					this.close(true);
				}.bind(this));
			}
		},

		/**
		 * Method that query the database and when the response comes, send the data to the callback function.
		 * @param $query string SQL to be query
		 * @param $callback function callback function
		 */
		query: function ()
		{
			while (this.connecting==true);

			var args=arguments;
			this._query = function () {
				this.connection.query.apply(this.connection,args);
			};

			this.connect.apply(this,arguments);

			this._query();
		},

		/**
		 * Method that terminate the DB connection
		 */
		close: function ()
		{
			var _terminate = function ()
			{
				this.connecting = false;
				this.connected = false;
				this.failed = false;
			}.bind(this);

			if (!ended == true)
				this.connection.end(_terminate);
			else
				_terminate();
		}
	
	}

};
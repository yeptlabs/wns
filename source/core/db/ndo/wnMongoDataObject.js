/**
 * Source of the wnMongoDataObject class.
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
		_serverConfig: {
			database: 'test'
		},
		_dbConfig: {
			native_parser: false,
			w: 1
		}
	},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var string module's name of the database driver
		 */
		driverModule: 'mongodb'

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
			var self=this,
				config = this.getConfig();
			var client = new this.driver.Db(config.database, new this.driver.Server(config.address, config.port, config), _dbConfig);
			Object.extend(true,this,client);
			this.on('close',function () {
				self.e.close();
			});
			this.open(function (err) {
				self.e.connect(err,client);
			});
			this.e.ready();
		},


		/**
		 * Execute a data request
		 * @param $params object parameters
		 * @param $cb function callback
		 */
		_execute: function (params,cb)
		{
			cb&&cb();
		}
	
	}

};
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
 * @package system.core.db.mongo
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
		driverModule: 'mongoose'

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
			this.driver.set('debug',true);
			var self=this,
				config = this.getConfig(),
				con = this.driver.createConnection(config.address, config.database, config.port, config);

			Object.extend(true,this,con);

			this.db.logger = function () {
				console.log(arguments);
			};
			this.on('close',function (err) {
				self.e.close(err);
			});
			this.on('error',function (err) {
				self.e.error(err);
			});
			this.onClose(function (err) {
				throw err;
			})
			this.onOpen(function () {
				self.e.connect(con);
				self.e.ready();
			});
		},

		/**
		 * DELETE all collection's datas from the database
		 * that matches with the criteria.
		 * @param object $params all parameters of the action.
		 * @param function $cb callback
		 */
		_delete: function (params,cb)
		{
			if (!!(params) && !!(params.criteria) && !!(params.collection))
			{
				var collection = this.model(params.collection,this.getDbConnection().getSchema().getMongoSchema(params.collection));
				collection.find(params.criteria).remove(cb);
			}
			else 
				cb&&cb(false);

			return false;
		},

		/**
		 * FIND all collection's datas from the database
		 * that matches with the criteria.
		 * @param object $params all parameters of the action.
		 * @param function $cb callback
		 */
		_find: function (params,cb)
		{
			if (!!(params) && !!(params.criteria) && !!(params.collection))
			{
				var collection = this.model(params.collection,this.getDbConnection().getSchema().getMongoSchema(params.collection));
				collection.find(params.criteria).exec(cb);
			}
			else 
				cb&&cb(false);

			return false;
		},

		/**
		 * UPDATE all collection's datas from the database
		 * that matches with the criteria with the new given information.
		 * @param object $params all parameters of the action.
		 * @param function $cb callback
		 */
		_update: function (params,cb)
		{
			if (!!(params) && !!(params.criteria) && !!(params.collection) && !!(params.collection))
			{
				var collection = this.model(params.collection,this.getDbConnection().getSchema().getMongoSchema(params.collection));
				collection.update(params.criteria,params.data,cb);
			}
			else 
				cb&&cb(false);

			return false;
		},


		/**
		 * INSERT a collection's data on the database.
		 * @param object $params all parameters of the action.
		 * @param function $cb callback
		 */
		_insert: function (params,cb)
		{
			if (!!(params) && !!(params.data) && !!(params.collection))
			{
				var collection = this.model(params.collection,this.getDbConnection().getSchema().getMongoSchema(params.collection)),
					_new = new collection(params.data);
					_new.save(cb);
			}
			else 
				cb&&cb(false);

			return false;
		},

		/**
		 * Execute a data request
		 * @param $params object parameters
		 * @param $cb function callback
		 */
		_exec: function (params,cb)
		{
			if (typeof params == 'object' && !!(params.collection) && !!(params.action) && this['_'+params.action] != undefined)
			{
				this['_'+params.action].apply(this,[params,cb]);
			}
			else 
				cb&&cb(false);

			return false;
		}
	
	}

};
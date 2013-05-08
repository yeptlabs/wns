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
 * @package package.mongo
 * @since 1.0.0
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
	dependencies: ['mongoose'],

	/**
	 * PRIVATE
	 */
	private: {
		_config: {
			database: 'test'
		},
		_dbConfig: {
			native_parser: false,
			w: 1
		},
		_db: null
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
		init: function (conn) {
			_db=conn;
			this.driver = mongoose;
		},

		/**
		 * Create mongodb connection then extend this class
		 * with all the Server object.
		 */
		_open: function ()
		{
			var config = this.getConfig(),
				con = this.driver.createConnection(config.address, config.database, config.port, config);

			Object.extend(true,this,con);
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
				var collection = this.getCollection(params.collection);
				collection.find(params.criteria).remove(cb);
			}
			else 
				cb&&cb(false);

			return false;
		},

		/**
		 * COUNT all objects from the database
		 * that matches with the criteria.
		 * @param object $params all parameters of the action.
		 * @param function $cb callback
		 */
		_count: function (params,cb)
		{
			if (!!(params) && !!(params.criteria) && !!(params.collection))
			{
				var collection = this.getCollection(params.collection);
				collection.count(params.criteria).exec(cb);
			}
			else 
				cb&&cb(false);

			return false;
		},

		/**
		 * FIND all objects from the database
		 * that matches with the criteria.
		 * @param object $params all parameters of the action.
		 * @param function $cb callback
		 */
		_find: function (params,cb)
		{
			if (!!(params) && !!(params.criteria) && !!(params.collection))
			{
				var collection = this.getCollection(params.collection);
				collection.find(params.criteria).exec(cb);
			}
			else 
				cb&&cb(false);

			return false;
		},

		/**
		 * UPDATE all objects from the database
		 * that matches with the criteria with the new given information.
		 * @param object $params all parameters of the action.
		 * @param function $cb callback
		 */
		_update: function (params,cb)
		{
			if (!!(params) && !!(params.criteria) && !!(params.collection) && !!(params.collection))
			{
				var collection = this.getCollection(params.collection);
				collection.update(params.criteria,params.data,cb);
			}
			else 
				cb&&cb(false);

			return false;
		},

		/**
		 * INSERT a object to the database.
		 * @param object $params all parameters of the action.
		 * @param function $cb callback
		 */
		_insert: function (params,cb)
		{
			if (!!(params) && !!(params.data) && !!(params.collection))
			{
				var collection = this.getCollection(params.collection),
					_new = new collection(params.data);
					_new.save(cb);
			}
			else 
				cb&&cb(false);

			return false;
		},

		/**
		 * Create a database QUERY
		 * @param object $params all parameters of the action.
		 */
		_query: function (params)
		{
			if (!!(params) && !!(params.collection))
			{
				var collection = this.getCollection(params.collection);
				delete params.collection;
				var query = collection.find({}),
					args;
				for (p in params)
					if (query[p])
					{
						if (typeof params[p] != 'object' || !params[p].length)
							params[p] = [params[p]];
						query[p].apply(query,params[p]);
					}
				return query;
			}
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
		},

		/**
		 * Return the collection Model.
		 * @param $collectionName string collection name
		 */
		getCollection: function (collectionName)
		{
			return this.model(collectionName,this.getDbConnection().getSchema().getMongoSchema(collectionName),collectionName);
		}
	
	}

};
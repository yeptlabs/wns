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

		_schema: null

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
		 * @var CONNECTION_OBJECT database connection
		 */
		connection: undefined,

		/**
		 * @var boolean connect again every query?
		 */
		alwaysConnect: false,

		/**
		 * @var wnDataObject instance of the selected data object
		 */
		dataObject: undefined,

		/**
		 * @var query caching duration
		 */
		queryCacheDuration: undefined,

		/**
		 * @var query caching dependency
		 */
		queryCacheDependency: undefined,

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'result': {},
			'ready': {},
			'connect': {},
			'close': {}
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
			var self = this;
			this.createDataObject();
			if (this.dataObject && this.dataObject.driver)
			{
				this.dataObject.addListener('ready',function () {
					self.e.ready.apply(self,arguments);
				});
				this.dataObject.addListener('connect', function (e,con) {
					self.connection = con;
					self.connected = true;
					self.e.connect.apply(self,arguments);
				});
				this.dataObject.addListener('close', function () {
					self.connected = false;
					self.e.close.apply(self,arguments);
				});
				this.dataObject.addListener('result', function () {
					self.e.result.apply(self,arguments);
				});
				this.dataObject._open();
			}
		},

		createDataObject: function ()
		{
			var config = this.getConfig(),
				engine = config.engine,
				dsnClass = 'wn'+engine.substr(0,1).toUpperCase()+engine.substr(1)+'DataObject';
			if (config.engine && this.c[dsnClass])
			{
				this.dataObject = new this.c[dsnClass]({ autoInit: false }, this.c);
				this.dataObject.setConfig(this.getConfig());
				this.dataObject.init(this);
			} else {
				this.getParent().e.log&&
					this.getParent().e.log('wnDbConnection.createDataObject: Invalid database engine configuration.');
			}
		},

		/**
		 * Sets the parameters for query caching.
		 * @param integer $duration duration of the cache lifetime
		 * @param wnCacheDependency $dependency the dependency to save the cache
		 * @return wnDbConnection instance of itself
		 */
		cache: function (duration, dependency)
		{
			this.queryCacheDuration=duration;
			this.queryCacheDependency=dependency;
			return this;  
		},

		/**
		 * Connect to the database
		 * @param $cb function connection callback
		 */
		connect: function (cb)
		{
			if (this.dataObject)
			{
				this.dataObject.once('connect',function () {
					cb&&cb();
				});
				this.dataObject._open.apply(this.dataObject,arguments);
			}
		},

		/**
		 * Terminate the database connection
		 * @param $cb function termination callback
		 */
		close: function (cb)
		{
			if (this.dataObject)
			{
				this.dataObject.once('close',function () {
					cb&&cb();
				});
				this.dataObject._close.apply(this.dataObject,arguments);
			}
		},

		/**
		 * Execute a data request
		 * @param $params object parameters
		 * @param $cb function callback
		 */
		exec: function (params,cb)
		{
			if (this.dataObject)
			{
				this.dataObject._exec.apply(this.dataObject,arguments);
			}
		},

		/**
		 * Execute a query
		 * @param $query string query
		 * @param $cb function callback
		 */
		query: function (query,cb)
		{
			if (this.dataObject)
			{
				this.dataObject._query.apply(this.dataObject,arguments);
			}
		},

		/**
		 * Returns the database schema for the current connection
		 * @return wnDbSchema the database schema for the current connection
		 */
		getSchema: function ()
		{
			if(_schema!==null)
				return _schema;
			else
			{
				var engine=this.getConfig('engine'),
					schemaClass = this.getParent().c['wnDb'+engine.substr(0,1).toUpperCase()+engine.substr(1)+'Schema'];
				if(schemaClass!=undefined)
					return _schema=new schemaClass({}, this.getParent().c, this);
				else
					return (1==this.getParent().e.log
							&&this.getParent().e.log('wnDbConnection does not support reading schema for that database.'));
			}
		},

		/**
		 * Returns the SQL query builder for the current DB connection.
		 * @return CDbQueryBuilder the query builder
		 */
		getQueryBuilder: function ()
		{
			return this.getSchema().getQueryBuilder();
		},

		/**
		 * Creates a query for execution.
		 * @param mixed $query can be a string or an object, required to 
		 * the current engine's querybuilder to work.
		 * @return CDbCommand the DB command
		 */
		createQuery: function (query)
		{
			var queryClass = this.getParent().c.wnDbQuery;
			return new queryClass({}, this.c, this, query);
		}
	
	}

};
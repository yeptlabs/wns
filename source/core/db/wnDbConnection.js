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
			if (this.dataObject)
			{
				this.dataObject.addListener('ready',function (e,err) {					
					self.e.ready.apply(self,arguments);
				});
				this.dataObject.addListener('connect', function () {
					self.e.connect.apply(self,arguments);
				});
				this.dataObject.addListener('close', function () {
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
			var config = this.getConfig();
			if (config.engine)
			{
				var engine = config.engine,
					dsnClass = 'wn'+engine.substr(0,1).toUpperCase()+engine.substr(1)+'DataObject';
				this.dataObject = new this.c[dsnClass]({ autoInit: false }, this.c);
				this.dataObject.setConfig(this.getConfig());
				this.dataObject.init();
			} else {
				this.getParent().e.exception&&
					this.getParent().e.exception('wnDbConnection.createDataObject: Engine configuration cannot be empty.');
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
				this.dataObject.open.apply(this.dataObject,arguments);
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
				this.dataObject.close.apply(this.dataObject,arguments);
			}
		},

		/**
		 * Execute a data request
		 * @param $params object parameters
		 * @param $cb function callback
		 */
		execute: function (params,cb)
		{
			if (this.dataObject)
			{
				this.dataObject.execute.apply(this.dataObject,arguments);
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
				this.dataObject.query.apply(this.dataObject,arguments);
			}
		}
	
	}

};
/**
 * Source of the wnDataObject class.
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
		 * @var DRIVER_OBJECT database driver
		 */
		driver: undefined,

		/**
		 * @var string module's name of the database driver
		 */
		driverModule: '',

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'ready': {},
			'connect': {},
			'close': {},
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
			try {
				this.driver = _r(this.driverModule);
			} catch (e)
			{
				this.getParent().e.exception&&
					this.getParent().e.exception('Could not load the database driver. ['+this.driverName+']');
			}
		},

		/**
		 * Data Object open connection.
		 */
		open: function ()
		{
		},

		/**
		 * Execute a data request
		 * @param $params object parameters
		 * @param $cb function callback
		 */
		execute: function (params,cb)
		{
			cb&&cb();
		},

		/**
		 * Execute a query
		 * @param $query string query
		 * @param $cb function callback
		 */
		query: function (query,cb)
		{
			cb&&cb();
		}
	
	}

};
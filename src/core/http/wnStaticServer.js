/**
 * @WNS - The NodeJS Middleware and Framework
 * 
 * @copyright: Copyright &copy; 2012- YEPT &reg;
 * @page: http://wns.yept.net/
 * @docs: http://wns.yept.net/docs/
 * @license: http://wns.yept.net/license/
 */

/**
 * No description yet.
 *
 * @author Pedro Nasser
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnComponent'],

	/**
	 * NPM Dependencies
	 */
	dependencies: ['node-static'],

	/**
	 * Private
	 */
	private: {
		_server: null,
		_config: {
			serve: ['public/'],
			options: {
				cache: 3600,
				headers: {},
				serverInfo: "WNS Static Server",
				gzip: false
			}
		}
	},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'open': {},
			'error': {},
			'send': {}
		}

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 */	
		init: function ()
		{
			this.app = this.getParent();
			this.server = new node_static.Server(this.app.modulePath+this.getConfig('serve')[0],this.getConfig('options'));
			this.attachEvents(this.app);
		},
		
		/**
		 * Attach events to the application
		 */
		attachEvents: function (app)
		{
			self.debug('Attaching events to the parent application',0);
			if (!_(app).isObject())
				return false;
			app.prependListener('runRequest',function (e,req) {
				if (req.template == '<file>')
				{
					self.processRequest(req);
					e.stopPropagation=true;
				}
			});
		},

		/**
		 * Process the request
		 */
		processRequest: function (req)
		{
			self.debug('Processing static file REQUEST',1);
			self.server.serve(req.info,req.response,function (e, res) {
				if (e && e.status === 404)
				{
					req.e.error(404,'File not found',true);
				}
			});
		}
	}
};	
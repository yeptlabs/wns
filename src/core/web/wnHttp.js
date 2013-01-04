/**
 * Source of the wnHttp class.
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
 * @package system.core.web
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
		 * @var HTTPObject connection instance
		 */
		connection: {},

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'open': {
				handler: 'handler'
			}
		}

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 * Create a new HTTP server listener.
		 */	
		init: function ()
		{
			var self = this;
			this.connection=http.createServer(function (req,resp) {
				self.e.open(req,resp);
			});
		},

		/**
		 * Start listening the HTTP server.
		 */
		listen: function ()
		{
			var config = this.getConfig();
			this.connection.listen(config.listen[0] || 80,config.listen[1]);
		},

		/**
		 * HTTP Handler
		 * @param $request Request request of the http connection
		 * @param $response Reponse response of the http connection
		 */
		handler: function (e,request,response)
		{
			var servername = request.headers.host.split(':')[0],
				app = this.getConfig('app'),
				config = this.getConfig();

			for (a in app)
			{
				var appConfig = app[a].getConfig();
				if (servername == a || this.getParent().getConfig('app')[a].domain == servername || (appConfig.components.http.serveralias+'').indexOf(new String(servername)) != -1)
				{
					app[a].createRequest.apply(app[a],arguments);
					return false;
				} 
			}

			response.end('Invalid hostname access.');

		}

	}

};
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
			'open': {},
			'redirect': {}
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
			this.connection=http.createServer(self.e.open);
			this.addListener('open',function (e,req,resp) {
				self.handler(req,resp);
			});
			this.addListener('redirect', function (e,app,req,resp) {
				if (!app)
					resp.end('Invalid hostname access.');
				else
					app.createRequest.apply(app,[req,resp]);
			});
		},

		/**
		 * Start listening the HTTP server.
		 */
		listen: function ()
		{
			var config = this.getConfig();
			try {
				this.connection.listen(config.listen[0] || 80,config.listen[1]);
			} catch (e) {
				this.getParent().e.log
					&&this.getParent().e.log('wnHttp: could not listen the http server.');
			}
		},

		/**
		 * HTTP Handler
		 * @param $request Request request of the http connection
		 * @param $response Reponse response of the http connection
		 */
		handler: function (request,response)
		{
			var servername = request.headers.host.split(':')[0],
				serverConfig = this.getParent().getConfig('app'),
				app = this.getConfig('app');

			for (a in app)
			{
				var appConfig = app[a].getConfig();
				if (servername == a || serverConfig[a].domain == servername || (appConfig.components.http.serveralias+'').indexOf(new String(servername)) != -1)
				{
					this.e.redirect(app[a],request,response);
					return false;
				} 
			}

			this.e.redirect(null,request,response);
		}

	}

};
/**
 * Source of the wnHttp class.
 * 
 * @author: Pedro Nasser
 * @link: http://pedroncs.com/projects/webnode/
 * @license: http://pedroncs.com/projects/webnode/#license
 * @copyright: Copyright &copy; 2012 WebNode Server
 */

/**
 * {full_description}
 *
 * @author Pedro Nasser
 * @version $Id$
 * @pagackge system.base
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
		connection: {}

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
			this.connection=http.createServer(this.handler.bind(this));
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
		handler: function (request,response)
		{
			
			var servername = request.headers.host,
				app = this.getConfig('app'),
				config = this.getConfig();

			for (a in app)
			{
				var appConfig = app[a].getConfig();
				if (servername == a || (appConfig.components.http.serveralias+'').indexOf(new String(servername)) != -1)
				{
					app[a].createRequest.apply(app[a],arguments);
					return false;
				} 
			}

			response.end('Invalid hostname access.');

		}

	}

};
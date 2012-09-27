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
	extend: [],

	/**
	 * Constructor
	 * {description}
	 * @param VARTYPE $example description
	 */	
	constructor: function () {

		// Create a new HTTP server listener.
		this.connection=http.createServer(this.handler.bind(this));

	},

	/**
	 * PRIVATE
	 *
	 * Only get and set by their respectives get and set private functions.
	 *
	 * Example:
	 * If has a property named $id.
	 * It's getter function will be `this.getId`, and it's setter `this.setId`.
	 * To define a PRIVILEGED function you put a underscore before the name.
	 */
	private: {},

	/**
	 * Public Variables
	 * Can be accessed and defined directly.
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
		 * Method start listening the http server..
		 */
		listen: function () {
			this.connection.listen(this.super_.config.http.listen[0] || 80,this.super_.config.http.listen[1]);
			if (this.super_.c.wnLog.handler) new this.super_.c.wnLog('Listening HTTP server at '+this.super_.config.http.listen[1]+':'+this.super_.config.http.listen[0]);
		},

		/**
		 * HTTP Handler
		 * @param $request Request request of the http connection
		 * @param $response Reponse response of the http connection
		 */
		handler: function (request,response) {
			
			// Getting host of the request.
			var servername = request.headers.host;

			// Looking for the right application
			for (a in this.super_.app) {
				if (servername == a || (this.super_.app[a].config.http.serveralias+'').indexOf(new String(servername)) != -1) {

						var _instance = {};
						_instance.info = request;
						_instance.response = response;
						_instance.app = this.super_.app[a];
						_instance.super_ = this;

						// Creates a new connection..
						var _httpRequest = new this.super_.app[a].c.wnHttpRequest(_instance);

					return false;
				} 
			}

			response.end('Invalid hostname access.');
			new this.super_.c.wnLog('Invalid hostname ('+servername+') access.','access');

		}

	}

};
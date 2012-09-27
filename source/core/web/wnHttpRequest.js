/**
 * Source of the wnHttpRequest class.
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
	constructor: function (extend) {

		// Extend the httpRequest with the request, response and app information
		Object.extend(true, this, extend);

		try {
			// Run the request.*/
			this.run();
		}
		catch (e) {
			new this.app.c.wnException(e);
		}

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
		 * @var object Parsed URL object
		 */
		parsedUrl: {},

		/**
		 * @var object Application object
		 */
		app: {},

		/**
		 * @var object Request info object
		 */
		info: {},

		/**
		 * @var object Response object
		 */
		response: {},

		/**
		 * @var object Route object
		 */
		route: {},

		/**
		 * @var string data of the response
		 */
		data: '',

		/**
		 * @var integer status code of the response
		 */
		code: 200,

		/**
		 * @var object header configuration of the response
		 */
		header: {}

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Method that compress, prepare and sends the response.
		 */
		send: function () {

			// Objeto http
			var http=this;

			// Busca saber se é possivel encodar o conteúdo
			var acceptEncoding = http.info.headers['accept-encoding'];
			if (!acceptEncoding) { acceptEncoding = ''; }

			// Verifica se é possivel utilizar gzip e se possui mais de 150bytes.
			if (acceptEncoding.match(/\bgzip\b/) || (typeof http.data == 'string' && Buffer.byteLength(http.data, 'utf8')>150)) {
				// gzipa.
				http.header['Content-Encoding']='gzip';
				zlib.gzip(new Buffer(http.data), function (e,buf) {
					// Envia a resposta..
					http.header['Content-Length']=buf.length;
					http.response.writeHead(http.code,http.header);
					http.response.end(buf);
				});
			} else {
				// Envia a resposta..
				http.header['Content-Length']=http.data.length;
				http.response.writeHead(http.code,http.header);
				http.response.end(http.data);		
			}

		},

		/**
		 * Runs the request execution..
		 */	
		run: function () {

			// Get the default header configuration..
			this.header = this.app.config.http.header;

			// Check if its an access to the '/'
			// If yes: change to default controller url
			if (this.info.url == '/') this.info.url = '/'+this.app.config.http.defaultController+'/';

			// Parse the URL
			this.parsedUrl=url.parse(this.info.url);

			// Get the pattern of the request.
			this.route = this.app.urlManager.parseRequest(this) || { translation: this.info.url, params: {}, template: '' };
			var _template = this.route ? this.route.template : false;

			// Is a file request?
			if (_template == '<file>') return this.publicHandler();
			// Else is a controller/action request.
			else return this.controllerHandler();

		},

		/**
		 * Controller Access Handler
		 */
		controllerHandler: function () {
			
			// Changeing content-type to text/html
			this.header['Content-Type']=mime.lookup('.html');

			// Parse the url to get the correct controller and action name.
			var _p=(this.route.translation).split('/'),
				_plen = _p.length,
				_controller=_plen>0&&_p[1]!=''?_p[1]:this.app.config.http.defaultController,
				_action=_plen>1&&_p[2]!=''?_p[2]:undefined;

			// Check if this controller not have been loaded before.
			// TODO: Smart Cache System.
			if (!this.app.controllers[_controller] || 1==1) {

				// Check the existence of the controller on the directory.
				if (!fs.existsSync(this.app.appPath+this.app.config.path.controllers+_controller+'.js')) {;
					
					new this.app.c.wnLog('Controller not found: '+_controller,'access');

					// Show error.
					this.errorHandler();

					return false;

				}

				// Creates a new controller based on the default.
				this.app.controllers[_controller]=new this.app.c.wnController(this);

				// Delete the require cache if exists.
				delete require.cache[this.app.appPath+this.app.config.path.controllers+_controller+'.js'];

				// Extends it with the application controller.
				var _cntr=_r(this.app.appPath+this.app.config.path.controllers+_controller+'.js');
				Object.extend(true,this.app.controllers[_controller],_cntr);
				this.controller=_controller;

			}

			// If theres no action name try to reach the default action...
			_action=this.action=(!_action?this.app.controllers[_controller].defaultAction:_action);

			// Resolve action name
			var _resolveAction = _action;
			for (a in this.app.controllers[_controller]) {
				if (a.toLowerCase() == 'action'+_action.toLowerCase()) { _resolveAction=a; break; }
			}

			// If action really exits..
			if (_action != _resolveAction) {

				_action = this.action = _resolveAction;

				// Executes the action.
				this.app.controllers[_controller][_action]&&this.app.controllers[_controller][_action]();

			// If not, redirect to error page.
			} else {

				new this.app.c.wnLog('View not found: '+_action,'access');
				// Show error.
				this.errorHandler();

			}
			
		},

		/**
		 * Public File Access Handler
		 */
		publicHandler: function () {

				_filename = this.route.translation;

				// Try to read the file on the public directory
				fs.readFile(this.app.appPath+this.app.config.path.public+_filename, function (err, data) {

					// If notfound:
					if (err) { this.code = 404; this.header['Status']='404 Not Found'; new this.app.c.wnLog('File not found: '+this.parsedUrl.pathname,'access'); }
					// If found it, send it to the http.data
					else { this.data = data; }

					// Define headers
					this.header['Content-Length']=this.data.length;
					this.header['Content-Type']=mime.lookup(this.parsedUrl.pathname);

					// Send the response
					this.send();

				}.bind(this));

		},

		/**
		 * Error Access Handler
		 */
		errorHandler: function () {

			// If it does not exists
			this.code = 404;
			this.header['Status']='404 Not Found';

			// Exist errorPage? If yes, redirect.
			if (this.app.config.http.errorPage!=undefined) {
				this.code = 302;
				this.header['Location']='/'+this.app.config.http.errorPage;
			}

			// Send response.
			this.send();

		}

	}

};
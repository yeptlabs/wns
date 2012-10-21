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
		 * @var object Parsed URL object
		 */
		parsedUrl: {},

		/**
		 * @var string data of the response
		 */
		data: '',

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
			this.header = this.getConfig('header');
			this.info = this.getConfig('request');
			this.response = this.getConfig('response');
			this.app = this.getConfig('app');
		},

		/**
		 * Method that compress, prepare and sends the response.
		 */
		send: function ()
		{
			var http=this;

			var acceptEncoding = http.info.headers['accept-encoding'];
			if (!acceptEncoding) 
				acceptEncoding = '';

			if (acceptEncoding.match(/\bgzip\b/) || (typeof http.data == 'string' && Buffer.byteLength(http.data, 'utf8')>150))
			{
				http.header['Content-Encoding']='gzip';
				zlib.gzip(new Buffer(http.data), function (e,buf)
				{
					http.header['Content-Length']=buf.length;
					http.response.writeHead(http.code,http.header);
					http.response.end(buf);
				});
			} else
			{
				http.header['Content-Length']=http.data.length;
				http.response.writeHead(http.code,http.header);
				http.response.end(http.data);		
			}
		},

		/**
		 * Check the route and then send it to the right handler...
		 */	
		run: function ()
		{
			if (this.info.url == '/')
				this.info.url = '/'+this.getConfig('defaultController')+'/';

			this.parsedUrl=url.parse(this.info.url);

			this.route = this.app.getComponent('urlManager').parseRequest(this) || { translation: this.info.url, params: {}, template: '' };
			var _template = this.route ? this.route.template : false;

			if (_template == '<file>')
				return this.publicHandler();
			else
				return this.controllerHandler();
		},

		/**
		 * Controller Access Handler
		 * Check if the controller is valid, then creates.
		 * If not valid send it to the errorHandler.
		 */
		controllerHandler: function ()
		{
			this.header['Content-Type']=mime.lookup('.html');

			var _p=(this.route.translation).split('/'),
				_plen = _p.length,
				_controller=_plen>0&&_p[1]!=''?_p[1]:this.getConfig('defaultController'),
				_action=_plen>1&&_p[2]!=''?_p[2]:undefined,
				controllerPath = this.app.modulePath+this.app.getConfig('path').controllers+_controller+'.js';

			if (!this.app.hasController(_controller) || 1==1)
			{
				if (this.app.existsController(_controller))
				{
					this.app.e.log('Controller not found: '+_controller,'access');
					this.errorHandler();
					return false;
				}
				var newController = this.app.getController(_controller);
				this.controller=newController;
			}

			_action=this.action=(!_action?this.app.controllers[_controller].defaultAction:_action);

			var _resolveAction = _action;
			for (a in this.app.controllers[_controller])
			{
				if (a.toLowerCase() == 'action'+_action.toLowerCase())
					{
						_resolveAction=a;
						break;
					}
			}

			if (_action != _resolveAction)
			{
				_action = this.action = _resolveAction;
				this.app.controllers[_controller][_action]&&this.app.controllers[_controller][_action]();
			} else
			{
				new this.app.c.wnLog('View not found: '+_action,'access');
				this.errorHandler();
			}
		},

		/**
		 * Public File Access Handler
		 * Try to load the file if exists.
		 * If not, send it to the 
		 */
		publicHandler: function ()
		{
				var _filename = this.route.translation;

				this.app.getFile(this.app.modulePath+this.app.getConfig('path').public+_filename, function (err, data) {

					if (err)
					{
						this.code = 404;
						this.header['Status']='404 Not Found';
						this.app.e.log('File not found: '+this.parsedUrl.pathname,'access');
					}
					else
						this.data = data;

					this.header['Content-Length']=this.data.length;
					this.header['Content-Type']=mime.lookup(this.parsedUrl.pathname);

					this.send();

				}.bind(this));
		},

		/**
		 * Error Access Handler
		 */
		errorHandler: function ()
		{
			this.code = 404;
			this.header['Status']='404 Not Found';

			if (this.getConfig('errorPage')!=undefined)
			{
				this.code = 302;
				this.header['Location']='/'+this.getConfig('errorPage');
			}

			this.send();
		}

	}
};
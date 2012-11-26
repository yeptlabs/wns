/**
 * Source of the wnHttpRequest class.
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
		 * @var object parsed url object
		 */
		parsedUrl: {},

		/**
		 * @var string data of the response
		 */
		data: '',

		/**
		 * @var buffer compressed data
		 */
		compressedData: null,

		/**
		 * @var integer response's code.
		 */
		code: 200,

		/**
		 * @var object response's header
		 */
		header: {},

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'open': {},
			'end': {},
			'error': {}
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
			this.initialTime = +(new Date);
			this.getEvent('end').setConfig({'source': this});
			this.header = this.getConfig('header') || this.header;
			this.info = this.getConfig('request');
			this.response = this.getConfig('response');
			this.app = this.getParent();
			if (this.info == undefined)
				return false;
		},

		/**
		 * Method that compress, prepare and sends the response.
		 */
		send: function ()
		{
			var self = this,
				acceptEncoding = this.info.headers['accept-encoding'];
			if (!acceptEncoding) 
				acceptEncoding = '';
	
			if (this.compressedData==null && (acceptEncoding.match(/\bgzip\b/) || (typeof this.data == 'string' && Buffer.byteLength(this.data, 'utf8')>150)))
			{
				zlib.gzip(new Buffer(this.data), function (e,buf)
				{
					self.header['Content-Encoding']='gzip';
					self.header['Content-Length']=buf.length;
					self.response.writeHead(self.code,self.header);
					self.compressedData = buf;
					self.response.end(buf);
					self.e.end(self);
				});
				return false;
			}

			if (this.compressedData)
			{
				var data = this.compressedData;
				this.header['Content-Length'] = data.length;
				this.header['Content-Encoding'] = 'gzip';
			} else
			{
				var data = this.data;
				delete this.header['Content-Length'] = data.length;
				delete this.header['Content-Encoding'];
			}
			this.response.writeHead(this.code,this.header);
			this.response.end(data);
			this.e.end(this);
		},

		/**
		 * Check the route and then send it to the right handler...
		 */	
		run: function ()
		{
			this.info.originalUrl = this.info.url;

			if (this.info.url == '/')
				this.info.url = '/'+this.getConfig('defaultController')+'/';

			this.parsedUrl=url.parse(this.info.url,true);

			this.route = this.app.getComponent('urlManager').parseRequest(this) || { translation: this.info.url, params: {}, template: '' };
			var template = this.route ? this.route.template : false;

			if (template == '<file>')
				this.publicHandler();
			else
				this.controllerHandler();
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
				
			this.controller=this.app.getController(_controller,this);

			if (!this.controller)
			{
				this.app.e.log('Controller not found: '+_controller,'access');
				this.errorHandler();
				return false;
			}

			_action=this.action=(!_action?this.controller.defaultAction:_action);

			var _resolveAction;
			if (_resolveAction=this.controller.resolveAction(_action))
			{
				_action = this.action = _resolveAction;
				this.controller[_action]&&this.controller[_action]();
			} else
			{
				this.app.e.log('Action not found: '+_action,'access');
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
			var _filename = this.route.translation.replace(/^\//,''),
				file;

			if (file=this.app.getFile(this.app.getConfig('path').public+_filename,true))
			{
					this.data = file;

					this.header['Content-Length']=this.data.length;
					this.header['Content-Type']=mime.lookup(this.parsedUrl.pathname);

					this.send();

					return false;
			}

			this.code = 404;
			this.header['Status']='404 Not Found';
			this.app.e.log('File not found: '+this.parsedUrl.pathname,'access');
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
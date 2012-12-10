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
	private: {
	},

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
			this.lifeTime=30000;
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

			if (this.compressedData==null && this.data != '' && (acceptEncoding.match(/\bgzip\b/) || (typeof this.data == 'string' && Buffer.byteLength(this.data, 'utf8')>150)))
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
			} else if (this.data.length > 0)
			{
				var data = this.data;
				this.header['Content-Length']=null;
				this.header['Content-Encoding']=null;
			}

			if (this.header.Location)
			{
				this.code = 302;
				this.header['Content-Type']=null;
			}

			this.response.writeHead(this.code,this.header);
			this.response.end(data);
			this.e.end(self);
		},

		/**
		 * Prepare the request.
		 * Define the route rule.
		 */
		prepare: function ()
		{
			this.info.originalUrl = this.info.url;
			if (this.info.url == '/')
				this.info.url = '/'+this.getConfig('defaultController')+'/';
			this.parsedUrl=url.parse(this.info.url,true);
			this.route = this.app.getComponent('urlManager').parseRequest(this) || { translation: this.info.url, params: {}, template: '' };
			this.template = this.route ? this.route.template : false;
			var self=this;
			this.info.once('close',function () { self.e.end(self); });
			this.info.once('end',function () { self.e.end(self); });
			this.info.connection.setTimeout(this.lifeTime,function () {
				self.info.connection.end();
				self.e.end(self);
				self.info.connection.destroy();
			});
		},

		/**
		 * Check the route and then send it to the right handler...
		 */	
		run: function ()
		{
			if (this.template == '<file>')
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
				//this.app.e.log('Controller not found: '+_controller,'access');
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
				//this.app.e.log('Action not found: '+_action,'access');
				this.errorHandler();
			}

		},

		cacheControl: function (url,stat) {
			
			var lastMod = stat.mtime,
				cmtime = this.app.cache.get('file-mtime-'+url) || new Date,
				etag = stat.size + '-' + Date.parse(stat.mtime),
				self = this;

			var sendCache = function () {
				var expire = new Date(cmtime);
					expire.setTime(expire.getTime()+1000*60*60*24);
				self.header['Cache-Control'] = 'max-age=3600, must-revalidate';
				self.header['Expires'] = expire;
				self.header['ETag'] = etag;
			};

			if (!this.info.headers['if-none-match'])
			{
				if (cmtime.getTime() != lastMod.getTime())
				{
					if (cmtime.getTime() == (new Date).getTime())
						cmtime = lastMod;
					self.app.cache.set('file-mtime-'+url,lastMod);
				}
				sendCache();
			} else {
				if (this.info.headers['if-none-match'] !== etag)
				{
					sendCache();
				} else {
					this.code = 304;
				}
			}

			this.header['Last-Modified'] = cmtime;


		},

		/**
		 * Public File Access Handler
		 * Try to load the file if exists.
		 * If not, send it to the 
		 */
		publicHandler: function ()
		{
			var _filename = this.route.translation.replace(/^\//,''),
				file,
				self = this;

			if (self.app.cache.get('file-'+_filename))
			{
				self.compressedData = self.app.cache.get('file-'+_filename);
				self.header['Content-Type']=self.app.cache.get('filetype-'+_filename);
				self.cacheControl(_filename,fs.statSync(this.app.modulePath+this.app.getConfig('path').public+_filename));
				self.send();
				return false;
			}

			var mimetype = this.header['Content-Type']=mime.lookup(this.parsedUrl.pathname),
				file = this.app.getFile(this.app.getConfig('path').public+_filename,true);

			if (file)
			{
					this.data = file;
					this.header['Content-Length']=this.data.length;

					if (!self.app.cache.get('file-'+_filename))
					{
						self.once('end', function () {
							self.app.cache.set('file-'+_filename,self.compressedData);
							self.app.cache.set('filetype-'+_filename,mimetype);
						});
					}

					this.cacheControl(_filename,fs.statSync(this.app.modulePath+this.app.getConfig('path').public+_filename));
					this.send();

					return false;
			}

			this.code = 404;
			this.header['Status']='404 Not Found';
			//this.app.e.log('File not found: '+this.parsedUrl.pathname,'access');
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
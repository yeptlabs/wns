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
		_controllers: {},
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
		 * @var integer request lifetime
		 */
		lifeTime: 30000,

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'open': {},
			'end': {},
			'error': {},
			'send': {},
			'run': {},
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
		 * Prepare the request.
		 */
		prepare: function ()
		{
			var self=this;
			
			this.info.originalUrl = this.info.url;
			if (this.info.url == '/')
				this.info.url = '/'+this.getConfig('defaultController')+'/';
			
			this.parsedUrl=url.parse(this.info.url,true);
			this.route = this.app.getComponent('urlManager').parseRequest(this) || { translation: this.info.url, params: {}, template: '' };
			this.template = this.route ? this.route.template : false;

			this.info.once('close',function () { self.e.end(self); });
			this.info.once('end',function () { self.e.end(self); });
			this.info.connection.setTimeout(this.lifeTime,function () {
				self.info.connection.end();
				self.e.end(self);
				self.info.connection.destroy();
			});
			this.addListener('error',function (e,code,msg,fatal) {
				this.err=true;
				self.errorHandler(code,msg,fatal);
			})

			return this;
		},

		/**
		 * Sends the request to the right handler..
		 */	
		run: function ()
		{
			var self = this;
			this.once('run', function (e) {
				if (self.cacheFilter())
					e.stopPropagation=true;
			});
			this.once('run', function () {
				if (self.template == '<file>')
					self.publicHandler();
				else
					self.controllerHandler();
				return self;
			});
			this.e.run(this);
			return this;
		},

		/**
		 * Put a filter between the run() and handlers() that
		 * check if a cache of the requested page/file exists.
		 * If exists, sends it to the client.
		 */
		cacheFilter: function () {
			return false;
		},

		/*
			
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


					if (!self.app.cache.get('file-'+_filename))
					{
						self.once('end', function () {
							self.app.cache.set('file-'+_filename,self.compressedData);
							self.app.cache.set('filetype-'+_filename,mimetype);
						});
					}



if (self.app.cache.get('file-'+_filename))
			{
				self.compressedData = self.app.cache.get('file-'+_filename);
				self.header['Content-Type']=self.app.cache.get('filetype-'+_filename);
				self.cacheControl(_filename,fs.statSync(this.app.modulePath+this.app.getConfig('path').public+_filename));
				self.send();
				return;
			}


this.cacheControl(_filename,fs.statSync(this.app.modulePath+this.app.getConfig('path').public+_filename));

		},*/

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
				controllerPath = this.app.modulePath+this.getConfig('path').controllers+_controller+'.js';
				
			this.controller=this.getController(_controller,this);

			if (!this.controller)
			{
				this.e.error(404,'Controller not found');
				return;
			}

			_action=this.action=(!_action?this.controller.defaultAction:_action);

			var _resolveAction;
			if (_resolveAction=this.controller.resolveAction(_action))
			{
				_action = this.action = _resolveAction;
				this.controller[_action]&&this.controller[_action]();
			} else
			{
				this.e.error(404,'Action not found');
			}
		},

		/**
		 * Flush all loaded application's controllers cache
		 */
		flushControllers: function () {
			for (c in _controllers)
				this.c['wn'+(c.substr(0,1).toUpperCase()+c.substr(1))+'Controller']=undefined;
			this.app.e.log('All controllers has been flushed.','system');
		},

		/**
		 * Flush an application's controller cache
		 * @param string $c controller's name
		 */
		flushController: function (c) {
			this.c['wn'+(c.substr(0,1).toUpperCase()+c.substr(1))+'Controller']=undefined;
			this.app.e.log('Controller ´'+c+'´ has been flushed.','system');
		},

		/**
		 * Get a new or cached instance from a controller.
		 * @param $id string controller's id
		 * @return wnController
		 */
		getController: function (id)
		{
			id = id.toLowerCase();
			var controllerName = 'wn'+(id.substr(0,1).toUpperCase()+id.substr(1))+'Controller';
			if (!this.app.c[controllerName]) {
				var builder = this.app.getComponent('classBuilder');
					_classSource = this.app.getFile(this.getConfig('path').controllers+id+'.js'),
					module = {};
				if (!_classSource)
					return false;
				eval(_classSource);
				builder.classesSource[controllerName] = module.exports;
				builder.classes[controllerName]=builder.buildClass(controllerName);
				builder.makeDoc(controllerName,_classSource);
				if (!builder.classes[controllerName])
					this.app.e.exception(new Error('Could not build the controller class.'));
				this.app.c[controllerName]=builder.classes[controllerName];
				_controllers[id]=this.app.c[controllerName];
			}
			var config = { controllerName: id },
				controllerClass = this.app.c[controllerName],
				controller = new controllerClass(config,this.app.c,this.app,this);
			return controller;
		},

		/**
		 * Public File Access Handler
		 * Try to load the file if exists.
		 * If not, send it to the errorHandler
		 */
		publicHandler: function ()
		{
			var _filename = this.route.translation.replace(/^\//,''),
				file,
				self = this;

			var mimetype = this.header['Content-Type']=mime.lookup(this.parsedUrl.pathname);
			if (file = this.app.getFile(this.getConfig('path').public+_filename,true))
			{
					this.data = file;
					this.header['Content-Length']=this.data.length;
					this.send();
					return;
			}

			this.e.error(404,'File not found',true);
		},

		/**
		 * Error Access Handler
		 * @param integer $code http status code
		 * @param string $msg http status msg
		 * @param boolean $fatal fatal error? means no redirect
		 */
		errorHandler: function (code,msg,fatal)
		{
			this.code=code || 500;

			if (this.getConfig('errorPage')!=undefined && !fatal)
			{
				this.code = 302;
				this.header['Location']='/'+this.getConfig('errorPage');
			}

			this.send();
		},

		/**
		 * Method that prepare and sends the response.
		 */
		send: function ()
		{
			var self = this,
				res = this.response;

			this.once('send', function (e,cb) {
				cb&&cb();
			});

			this.e.send(function () {
				for (h in self.header)
					res.setHeader(h,self.header[h]);

				res.statusCode = self.code;
				res.end(self.data);
				self.e.end(self);
			});
		}

	}
};	
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
	 * PRIVATE
	 */
	private: {
		_modules: {},
		_requestCount: 0,
		_concurrency: 0,
		_connections: 0,
		_requests: {},
		_banned: {},
		_banTimes: {},
		_config: {
			listen:[80],
			envPort: true,
			keepAlive: false,
			floodProtection: false,
			fpBanTime: 2*60*60*1000,
			fpCheckInterval: 1000,
			fpMaxRequests: 3,
			fpJustSameUrl: true,
			whitelist: []
		}
	},

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
		},

		/**
		 * @var object a small cache to fast redirect the request to the right application
		 */
		urlShortcut: {},

		/**
		 * @var boolean Are all events attached?
		 */
		eventsAttached: false

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 * Create a new HTTP server listener.
		 */	
		init: function (config,c)
		{
			setInterval(function () {
				_requests={};
			},1000);

			if (self.getConfig().envPort && process.env.PORT)
			{
				self.e.log('Change HTTP listening port to '+process.env.PORT+'...');
				var httpConfig=self.getConfig();
				httpConfig.listen[0]=process.env.PORT;
				self.setConfig(httpConfig);
			};

			this.connection=http.createServer(self.e.open);
			this.autoListen=this.getConfig('autoListen') || true;
			this.addListener('open',function (e,req,resp) {
				req.socket.setKeepAlive(self.getConfig('keepAlive') || false);
				req.socket.setTimeout(self.getConfig('timeout') || 5000);				
				if (self.getConfig('floodProtection')==true && self.floodProtection(req,resp))
					return false;
				req.response=resp;
				self.handler(req,resp);
			});
			this.addListener('redirect', function (e,app,req,resp) {
				if (!app)
				{
					self.warn('Invalid hostname ('+req.headers['Host']+') access from '+req.connection.remoteAddress)
					resp.end('Invalid hostname access.');
				}
				else
					self.createRequest.apply(self,[app,req,resp]);
			});
			this.getParent().addListener('loadModule',function (e,moduleName,module) {
				self.attachModule(moduleName,module);
			});

			if (this.autoListen)
				this.listen();
		},

		/**
		 * Flood protection.
		 */
		floodProtection: function (req,resp)
		{
			var remoteAddress = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress;
			var url = req.url;
			var cacheName = remoteAddress;

			if (self.getConfig('fpJustSameUrl')==true)
				cacheName = remoteAddress+'-'+req.url;

			if (remoteAddress && self.getConfig('whitelist').indexOf(remoteAddress) == -1)
			{
				if (_banned[remoteAddress])
				{
					if (_banTimes[remoteAddress]>1 || +new Date - _banned[remoteAddress] <= self.getConfig('fpBanTime')+Math.floor(self.getConfig('fpBanTime')*0.1+Math.random()*0.5*self.getConfig('fpBanTime')))
					{
						req.socket.destroy();
						return true;
					} else
						delete _banned[remoteAddress];
				}

				if (!_requests[cacheName])
					_requests[cacheName]=1;

				if (!_banTimes[remoteAddress])
					_banTimes[remoteAddress]=0;

				if (_requests[cacheName]>=self.getConfig('fpMaxRequests'))
				{
					req.socket.destroy();
					_banned[remoteAddress]=+new Date;
					_banTimes[remoteAddress]++;
					return true;
				}

				_requests[cacheName]++;
			}

			return false;
		},

		/**
		 * Attach the module to the HTTP server.
		 */
		attachModule: function (moduleName,module)
		{
			if (!module.getConfig('components').http)
				return false;

			module.setEvents({
				'newRequest': {},
				'readyRequest': {},
				'runRequest': {},
				'closedRequest': {}
			});
			module.getEvent('newRequest');
			module.getEvent('readyRequest');
			module.getEvent('runRequest');
			module.getEvent('closedRequest');
			
			module.html = module.createClass('wnHtml',{});
			module.html.setParent(module);
			module.html.encoder = module.createClass('wnHtmlEncoder',{});

			var engineName = this.getConfig('templateEngine') || 'Dust';
			module.template = module.createClass('wn'+engineName+'Template',{});
			module.template.parent = function () { return module; };

			_modules[moduleName]=module;
		},

		/**
		 * Start listening the HTTP server.
		 */
		listen: function (cb)
		{
			var config = this.getConfig();
			try {
				this.connection.listen(config.listen[0] || 80,config.listen[1],cb);
				this.getParent().e.log('Listening HTTP server (port '+config.listen[0]+')...');
			} catch (e) {
				this.getParent().e.exception
					&&this.getParent().e.exception(e);
			}
		},

		/**
		 * Define a unique id for the request.
		 * @param object $req
		 * @param function $cb
		 */
		getUUID: function (req,cb)
		{
			var buff = new Buffer(16);
			process.nextTick(function () {
				uuid.v4({},buff);
				req._id = buff.toString('hex');
				cb&&cb();
			});
		},

		/**
		 * Handles a new httpRequest and build a new wnRequest.
		 * @param $req HttpRequest's object
		 * @param $res HttpResponse's object
		 * @error throw an exception
		 */
		createRequest: function (app,req,resp)
		{
			var httpRequest, reqConf, _req=req, url = req.url+'', httpServer = this, self = app;
			try
			{
				self.once('newRequest',function (e,req,resp) {
					_requestCount++;

					if (!req || !resp || resp.closed || req.closed)
						return false;

					reqConf = Object.extend(true,{},self.getComponentConfig('http'),{ id: 'request-'+(+new Date)+'-'+_requestCount })
					httpRequest = new self.c.wnHttpRequest(reqConf, self.c);

					httpRequest.setParent(self);

					httpRequest.created = +new Date;
					httpRequest.html = app.html;
					httpRequest.html.encoder = app.html.encoder;
					httpRequest.template = app.template;
					httpRequest.http = self;

					httpRequest.init(req,resp);
					httpServer.getUUID(httpRequest,function () {
						httpRequest.e.open();
						httpRequest.prepare();

						httpRequest.once('destroy',function () {
							resp.end();
							httpRequest.debug('The socket has been DESTROYED.',3);
							_concurrency--;
							reqConf = null;
							httpRequest = null;
						});

						app.once('readyRequest',function (e,req) {
							app.once('runRequest',function (e,req) {
								req.run();
							});
							app.e.runRequest(req);
						});
						app.e.readyRequest(httpRequest);
					});

				});

				if (req.method != 'GET' && req.method != 'HEAD' && req.headers['content-type'] != 'multipart/form-data')
				{
					var form = new formidable;

					form.parse(req, function (err, fields, files) {
						req.body = {
							fields: fields,
							files: files
						};
						app.e.newRequest(req,resp);
					});
				}					
				else
				{
					process.nextTick(function () {
						app.e.newRequest(req,resp);
					});
				}
			} catch (e)
			{
				self.e.exception&&
					self.e.exception(e);
			}
		},

		/**
		 * HTTP Handler
		 * @param $request Request request of the http connection
		 * @param $response Reponse response of the http connection
		 */
		handler: function (request,response)
		{
			var serverName = request.headers.host.split(':')[0]+'';
			var serverConfig = this.getParent().getModulesConfig();
			var shortcut = self.urlShortcut[serverName];

			request.datetime = +new Date;
			_connections++;
			_concurrency++;

			if (shortcut!==undefined)
			{
				self.e.redirect(shortcut!==null?_modules[shortcut]:null,request,response);
				return;
			}

			for (a in serverConfig)
			{
				var app=_modules[a];
				var appConfig = app.getConfig();
				var domain = serverConfig[a].domain;
				var domainMatch = new RegExp((domain||'').replace(/\*/g,'(.*)'),'gi');
				var serverAlias = appConfig.serveralias+'';
				var aliasMatch = new RegExp(serverAlias.replace(/\,/g,'|').replace(/\*/g,'(.*)'),'gi');

				if (!app || !appConfig.components.http)
					continue;				

				if (serverName == a || serverName==domain || serverName.match(domainMatch)!==null || (serverAlias).indexOf(serverName) != -1 || serverName.match(aliasMatch)!==null)
				{
					self.urlShortcut[serverName]=a;
					this.e.redirect(app,request,response);
					return;
				} 
			}

			self.urlShortcut[serverName]=null;
			this.e.redirect(null,request,response);
		}

	}

};
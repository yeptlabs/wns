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
 * @package package.http
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
		_modules: {},
		_requestCount: 0,
		_concurrency: 0,
		_connections: 0,
		_requests: {},
		_banned: {},
		_banTimes: {},
		_config: {
			keepAlive: false,
			floodProtection: true,
			fpBanTime: 2*60*60*1000,
			fpCheckInterval: 1000,
			fpMaxRequests: 3,
			fpJustSameUrl: true,
			whitelist: []
		},
		count:0
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
				//console.log('['+req.connid+'] redirecting request');
				if (!app)
					resp.end('Invalid hostname access.');
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
						// resp.writeHead(400);
						// resp.on('end',function () {
						// 	req.socket.destroy();
						// 	resp.socket.destroy();
						// });
						//resp.end();
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
					// resp.writeHead(400 || self.getConfig(''));
					// resp.on('end',function () {
					// 	req.socket.destroy();
					// 	resp.socket.destroy();
					// });
					// resp.end();
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
			module.setEvents({
				'newRequest': {},
				'readyRequest': {},
				'closedRequest': {}
			});
			module.getEvent('newRequest');
			module.getEvent('readyRequest');
			module.getEvent('closedRequest');
			
			var htmlClass = module.c.wnHtml;
			module.html = new htmlClass;
			module.html.setParent(module);

			var htmlEncoderClass = module.c.wnHtmlEncoder;
			module.html.encoder = new htmlEncoderClass;

			var engineName = this.getConfig('templateEngine') || 'Dust',
				tplEngine = module.c['wn'+engineName+'Template'];
			module.template= new tplEngine({},module.c);
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
		 * Handles a new httpRequest and build a new wnRequest.
		 * @param $req HttpRequest's object
		 * @param $res HttpResponse's object
		 * @error throw an exception
		 */
		createRequest: function (app,req,resp)
		{
			var httpRequest, reqConf, _req=req, url = req.url+'', self = app;
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
					httpRequest.e.open();
					//console.log('['+req.connid+'] preparing request');
					httpRequest.prepare();
					app.once('readyRequest',function (e,req) {
						req.once('destroy',function () {
							//console.log('['+_req.connid+'] destroyed request');
							_concurrency--;
							reqConf = null;
							req = null;
						});
						req.run();
					});
					app.e.readyRequest(httpRequest);

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
			var servername = request.headers.host.split(':')[0],
				serverConfig = this.getParent().getModulesConfig();

			request.datetime = +new Date;
			request.connid = _connections++;
			_concurrency++;

			//console.log('['+request.connid+'] new request');

			for (a in serverConfig)
			{
				var app=_modules[a],
					appConfig = app.getConfig();
				if (!app || !appConfig.components.http)
					continue;
				if (servername == a || serverConfig[a].domain == servername || (appConfig.components.http.serveralias+'').indexOf(new String(servername)) != -1)
				{
					this.e.redirect(app,request,response);
					return false;
				} 
			}

			this.e.redirect(null,request,response);
		}

	}

};
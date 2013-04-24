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
	private: {
		_modules: {},
		_requestCount: 0,
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
			this.connection=http.createServer(self.e.open);
			this.autoListen=this.getConfig('autoListen') || true;
			this.addListener('open',function (e,req,resp) {
				self.handler(req,resp);
			});
			this.addListener('redirect', function (e,app,req,resp) {
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

			var httpRequest, reqConf, url = req.url+'', self = app;
			try
			{
				self.once('newRequest',function (e,req,resp) {

						_requestCount++;

						if (!resp || resp.closed)
							return false;

						reqConf = Object.extend(true,{},self.getComponentConfig('http'),{ id: 'request-'+(+new Date)+'-'+_requestCount })
						httpRequest = new self.c.wnHttpRequest(reqConf, self.c);

						httpRequest.setParent(self);
						httpRequest.created = +new Date;
						httpRequest.init(req,resp);
						httpRequest.e.open();
						httpRequest.prepare();
						app.once('readyRequest',function (e,req) {
							req.once('destroy',function () {
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
					app.e.newRequest(req,resp);
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
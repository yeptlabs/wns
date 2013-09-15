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
		_data: null,
		_piped: [],
		_config: {
			header: {
				"Connection": "close"
			},
			serveralias: "*"
		}
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
		 * @var object request cookies
		 */
		cookies: {},

		/**
		 * @var integer request lifetime
		 */
		lifeTime: 30000,

		/**
		 * @var query object
		 */
		query: {
			GET: {},
			POST: {},
			REQUEST: {}
		},

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'open': {},
			'end': {},
			'error': {},
			'send': {},
			'run': {},
			'destroy': {}
		}

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 */	
		init: function (req,resp)
		{
			if (!req||!resp)
				return false;
			
			_logName = req.url+'';
			self.debug(req.method+' from '+req.connection.remoteAddress,1);
			this.initialTime = +(new Date);

			this.header = this.getConfig('header') || this.header;
			this.conn = req;
			Object.defineProperty(this,'info',{
				value: req,
				enumerable: false
			})
			this.response = resp;

			this.app = this.getParent();

			if (req.headers && req.headers.cookie)
			{
				var cookieData = req.headers.cookie ? req.headers.cookie.split(';') : [],
					cookies = {};
				for (c in cookieData)
				{
					var parts = cookieData[c].split('=');
					cookies[parts[0].trim()]=(parts[1]||'').trim();
				}
				this.cookies=cookies;
			}

			if (this.info == undefined)
				return false;
		},
		
		/**
		 * Format the query as object.
		 */
		formatQuery: function (obj)
		{
			if (Object.isObject(obj))
			{
				for (o in obj)
				{
					var path=o.replace(/\[\w+\]/gi,function (match) { return match.replace('[','.').replace(']','') });
					var paths = path.split('.');
					var name = paths[0];

					if (paths.length>1)
					{
						if (obj[name]===undefined)
							obj[name]={};
						paths.shift();
						obj[name][paths.join('.')]=obj[o];
						delete obj[o];
						self.formatQuery(obj[name]);
					}
				}
			}

			return obj;
		},

		/**
		 * Prepare the request.
		 */
		prepare: function ()
		{
			self.debug('PREPARING request',3);
			this.info.originalUrl = this.info.url;
			
			self.debug('PARSING url',3);
			this.parsedUrl=url.parse(this.info.url,true);
			this.route = this.app.getComponent('urlManager').parseRequest(this) || { translation: this.info.url, params: {}, template: '' };
			this.template = this.route ? this.route.template : false;

			this.query.GET = {};
			this.query.POST = { fields: {}, files: {} };
			this.query.REQUEST = {};

			self.debug('Preparing QUERY data',3);
			Object.extend(true,this.query.POST, this.info.body);
			Object.extend(true,this.query.GET, this.parsedUrl.query);
			Object.extend(true,this.query.GET, this.route.params);
			for (g in this.query.GET)
			{
				this.query.GET[g]=this.query.GET[g].replace(/\+/gi,' ')
			}

			self.formatQuery(this.query.POST.fields);
			self.formatQuery(this.query.POST.files);
			self.formatQuery(this.query.GET);
			Object.extend(true,this.query.REQUEST, this.query.GET, this.query.POST);

			self.debug('Data RECEIVED:',4);
			self.debug(util.inspect(this.query.REQUEST),4);

			self.prepareEvents();

			return this;
		},

		/**
		 * Prepare all request's required events..
		 */
		prepareEvents: function ()
		{
			self.debug('Preparing ending EVENTS',5);

			var onFail = function () {
				self.prependOnce('destroy',function () 
				{
					if (!self.dataSent&&_piped.length>0)
						self.releasePiped();
				});
				self.e.end(self);
			}

			this.conn.once('error',function () {
				self.debug('The connection closed by ERROR.',3);
				onFail();
			});

			this.conn.once('close',function () {
				self.debug('The connection has been CLOSED.',3);
				onFail();
			});

			this.conn.once('end',function () {
				self.debug('The connection has been ENDED.',3);
				onFail();
			});

			this.conn.connection.setTimeout(this.lifeTime,function () { self.response.end(); });
			this.response.setTimeout(this.lifeTime,function () { self.response.end(); });

			this.addListener('error',function (e,code,msg,fatal) {
				this.err=true;
				self.errorHandler(code,msg,fatal);
			});

			this.addListener('end',function () {
				self.debug('END signal has been emitted',5);
				self.closed=true;
				self.conn.closed=true;
				self.response.closed=true;
				self.app.once('closedRequest', function () {
					self.debug('DESTROYING request',5);
					self.e.destroy(self);
				});
				self.app.e.closedRequest(self);
			});
		},

		/**
		 * Sends the request to the right handler..
		 */	
		run: function ()
		{
			this.once('run', function () {
				self.e.error(404,'No handler found',true);
			});
			this.e.run(this);
			return this;
		},

		/**
		 * Return the controller url
		 * @return string controller url
		 */
		getUrl: function () {
			return this.info.url;
		},

		/**
		 * Return the output data;
		 * @return Buffer output data;
		 */
		getOutput: function () {
			return _data;
		},

		/**
		 * Put a filter between the run() and handlers() that
		 * check if a cache of the requested page/file exists.
		 * If exists, sends it to the client.
		 */
		cacheFilter: function () {
			return false;
		},

		/**
		 * Error Access Handler
		 * @param integer $code http status code
		 * @param string $msg http status msg
		 * @param boolean $fatal fatal error? means no redirect
		 */
		errorHandler: function (code,msg,fatal)
		{
			self.warn('ERROR on request: '+code+' - '+msg);
			this.code=code || 500;
			this.error=code;
			delete this.header['Content-type'];

			this.send();
		},

		/**
		 * Redirect
		 */
		redirect: function () {
			if (self.sent||self.closed)
				return false;
			
			self.debug('REDIRECTING request to: '+_.toArray(arguments).join(', '),1);
			var url;
			var terminate;
			var statusCode;
			if (typeof arguments[0]=='number')
			{
				url = arguments[1]+'' || '/';
				statusCode=arguments[0];
				terminate = new Boolean(arguments[2]).valueOf() || false;
			} else {
				url=arguments[0]+'' || '/';
				statusCode = 303;
				terminate = new Boolean(arguments[1]).valueOf() || false;
			}
		
			this.code = statusCode;
			this.header['Location'] = url+'' || '/';

			if (terminate)
				this.send();
		},

		/**
		 * Pipe a request to this request.
		 */
		pipe: function (req)
		{
			if (self.sent||self.closed)
				return false;

			self.debug('PIPING other request',2);
			if (!req || typeof req !== 'object' || !req.getClassName()=='wnHttpRequest' || _piped.length>=10)
				return false;
			
			_piped.push(req);
			return true;
		},

		/**
		 * Send a chunk to the response.
		 * @param string/buffer $data response data (optional)
		 */
		write: function (data,sending)
		{
			if (self.sent||self.closed)
				return false;

			var res = this.response;
			if (data)
			{					
				if (!data.pipe)
				{
					if (Buffer.isBuffer(self.data) || typeof self.data == 'string')
					{
						self.debug('WRITING buffer to client: ',2);
						self.debug('BUFFER data: '+util.inspect(data),3);
						self.data = Buffer.concat([new Buffer(self.data,'utf8'),new Buffer(data||0)]);
					} else
						self.debug('WRITING string to client',2);
						self.debug('STRING data: '+util.inspect(data),3);
				}
				else
				{
					self.debug('PIPING stream to client',2);
					self.response.piped=true;
					self.data=data;
				}
			}

			if (sending)
			{
				this.prepareSend();
			}
		},

		/**
		 * Prepare the response to send data.
		 */
		prepareSend: function ()
		{
			self.debug('PREPARE to SEND response',3);
			var res = this.response;

			if (self.sent||self.closed)
				return false;
			self.sent=true;

			this.once('send', function (e,cb) {
				self.debug('SEND signal has been emitted',5);

				self.debug('HEADERS sent: '+util.inspect(self.header),2);
				for (h in self.header)
					res.setHeader(h,self.header[h]);
				res.statusCode = self.code;

				if (self.data.pipe)
					self.data.pipe(res);
				else
					res.write(self.data);

				self.dataSent = true;

				if (_piped.length>0)
				{
					process.nextTick(function () {
						self.debug('PIPE detected.',5);
						var data = this.data;
						for (p in this.piped)
						{
							process.nextTick(function () {
								this.req.send(data);
							}.bind({ req: this.piped[p] }));
						}
					}.bind({ piped: _piped, data: self.data }));
					_piped=[];
				}

				cb&&cb();
			});
		},

		/**
		 * Sends a final chunk and end the response.
		 * @param string/buffer $data response data (optional)
		 */
		send: function (data)
		{
			if (self.sent||self.closed)
				return false;

			self.debug('SENDING response.',3);
			this.write(data,true);
			this.e.send(function () {
				if (!self.response.piped)
					self.response.end();
			});
		}

	}
};	
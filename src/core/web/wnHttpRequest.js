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
		_data: null
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
		init: function ()
		{
			this.initialTime = +(new Date);
			this.getEvent('end').setConfig({'source': this});

			this.header = this.getConfig('header') || this.header;
			this.info = this.getConfig('request');
			this.response = this.getConfig('response');

			this.app = this.getParent();

			// _data = new Buffer(0);
			// if (this.response)
			// {
			// 	this.response.__write = this.response.write;
			// 	this.response.write = function (chunk, encoding)
			// 	{
			// 		if (chunk)
			// 			_data = Buffer.concat([_data,new Buffer(chunk,encoding)]);
			// 		self.response.__write.call(self.response,chunk,encoding);
			// 	};
			// 	this.response.__end = this.response.end;
			// 	this.response.end = function(chunk, encoding) {
			// 		if (chunk)
			// 			_data = Buffer.concat([_data,new Buffer(chunk,encoding)]);
			// 		self.response.__end.call(self.response,chunk,encoding);
			// 		self.e.end(self);
			//     };
			// }

			if (this.info == undefined)
				return false;
		},

		/**
		 * Prepare the request.
		 */
		prepare: function ()
		{
			this.info.originalUrl = this.info.url;
			if (this.info.url == '/')
				this.info.url = '/'+this.getConfig('defaultController')+'/';
			
			this.parsedUrl=url.parse(this.info.url,true);
			this.route = this.app.getComponent('urlManager').parseRequest(this) || { translation: this.info.url, params: {}, template: '' };
			this.template = this.route ? this.route.template : false;

			this.info.once('close',function () { self.e.end(self); });
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
			if (this.controller.resolveAction(_action)==false)
				this.e.error(404,'Action not found');
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
				file;

			var mimetype = this.header['Content-Type']=mime.lookup(this.parsedUrl.pathname);
			this.fileName = this.getConfig('path').public+_filename;
			self.app.getFile(self.fileName,true,function (file) {
				if (!file)
					self.e.error(404,'File not found',true);
				else
				self.app.getFileStat(self.fileName, function (stat) {
					self.data = file;
					self.header['Content-Length']=self.data.length;
					self.stat = stat;
					self.send();
				});
			});
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
			this.error=code;

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
			if (self.sent)
				return false;

			var res = this.response;

			this.once('send', function (e,cb) {
				cb&&cb();
			});

			this.e.send(function () {
				self.sent=true;
				for (h in self.header)
					res.setHeader(h,self.header[h]);
				res.statusCode = self.code;
				self.once('end',function () {
					self.e.destroy(self);
				})
				res.end(self.data);
			});
		}

	}
};	
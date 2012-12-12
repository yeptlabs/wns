/**
 * Source of the wnApp class.
 * 
 * @author: Pedro Nasser
 * @link: http://wns.yept.net/
 * @license: http://yept.net/projects/wns/#license
 * @copyright: Copyright &copy; 2012 WNS
 */

/**
 * wnApp is the base class for all applications. 
 *
 * @author Pedro Nasser
 * @package system.core
 * @since 1.0.0
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnModule'],

	/**
	 * PRIVATE
	 */
	private: {
		_controllers: {},
		_requests: [],
		_slaveRequests: {},
		_requestCount: 0,
		_localLogs: [],
		_logId: 0
	},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'newRequest': {}
		}

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializes the application
		 */	
		init: function ()
		{
			this.startComponents();
			this.e.log("Application `"+this.getConfig('id')+"` running...","system");
		},

		/**
		 * Handles a new httpRequest and build a new wnRequest.
		 * @param $req HttpRequest's object
		 * @param $res HttpResponse's object
		 * @error throw an exception
		 */
		createRequest: function (req,resp)
		{
			var httpRequest, reqConf, url = req.url+'';
			try
			{
				this.e.newRequest(req,resp);
				if (resp.closed)
					return false;

				reqConf = Object.extend(true,{},this.getComponentConfig('http'),{ id: 'request-'+_requestCount, request: req, response: resp }),
				httpRequest = this.createComponent('wnHttpRequest',reqConf);
				_requestCount++;
				httpRequest.created = +new Date;
				httpRequest.init();
				httpRequest.prepare();
				httpRequest.once('end',function () {					
					for (r in _slaveRequests[url])
					{
						var sreq=_slaveRequests[url];
						sreq.data = httpRequest.data;
						sreq.compressedData = httpRequest.compressedData;
						sreq.code = httpRequest.code;
						sreq.header = httpRequest.header;
						sreq.send();
					}
					_slaveRequests[url]=null;
					reqConf = null;
					_requestCount--;
					_requests[url]=false;
					httpRequest = null;
				});
				var self = this;
				if (_requests[url]!=true && httpRequest.template != '<file>')
				{
					_requests[url]=true;
					httpRequest.run();
					_slaveRequests[url]=[];
				} else if (httpRequest.template == '<file>')
				{
					httpRequest.run();
				} else
				{
					_slaveRequests[url].push(httpRequest);
				}
			}
			catch (e)
			{
				this.e.exception(e);
			}
		},

		/**
		 * Return all opened request on this application.
		 */
		getRequests: function () {
			return _requests;
		},

		/**
		 * Get a new or cached instance from a controller.
		 * @param $id string controller's id
		 * @param $request wnRequest instance
		 * @return wnController
		 */
		getController: function (id,request)
		{
			id = id.toLowerCase();
			var controllerName = 'wn'+(id.substr(0,1).toUpperCase()+id.substr(1))+'Controller';
			if (!this.c[controllerName]) {
				var builder = this.getComponent('classBuilder');
					_classSource = this.getFile(this.getConfig('path').controllers+id+'.js'),
					module = {};
				if (!_classSource)
					return false;
				eval(_classSource);
				builder.classesSource[controllerName] = module.exports;
				builder.classes[controllerName]=builder.buildClass(controllerName);
				if (!builder.classes[controllerName])
					this.e.exception(new Error('Could not build the controller class.'));
				this.c[controllerName]=builder.classes[controllerName];
				_controllers[id]=this.c[controllerName];
			}
			var config = { controllerName: id, request: request, autoInit: false },
				controller = this.createComponent(controllerName,config);
			controller.init();
			return controller;
		},

		/**
		 * Flush all loaded application's controllers cache
		 */
		flushControllers: function () {
			for (c in _controllers)
				this.c['wn'+(c.substr(0,1).toUpperCase()+c.substr(1))+'Controller']=undefined;
			this.e.log('All controllers has been flushed.','system');
		},

		/**
		 * Flush an application's controller cache
		 * @param string $c controller's name
		 */
		flushController: function (c) {
			this.c['wn'+(c.substr(0,1).toUpperCase()+c.substr(1))+'Controller']=undefined;
			this.e.log('Controller ´'+c+'´ has been flushed.','system');
		},

		/**
		 * Log filter
		 * @param $e eventObject object of this event emition
		 * @param $data mixed data
		 * @param $zone string zone
		 */
		logFilter: function (e,data,zone)
		{
			var event = this.getEvent('log'),
				config = event.getConfig();
			if (this.config.log[log.zone] === true) return true;
			return false;
		},

		/**
		 * Local Log Handler
		 * @param $e eventObject object of this event emition
		 * @param $data string log message
		 * @param $zone string log zone
		 */
		logHandler: function (e,data,zone)
		{
			_localLogs.push([_logId,+new Date,data,zone||'']);
			_logId++;
			if (_localLogs.length > 100)
			{
				_localLogs.shift();
			}
		},

		/**
		 * Return all stored logs messages
		 * @return object all stored log messages
		 */
		getLogs: function ()
		{
			return _localLogs;
		},		

		/**
		 * Exception handler
		 * @param $e eventObject object of this event emition
		 * @param $err mixed argument
		 */
		exceptionHandler: function (e,err)
		{
			e.owner.e.log('ERROR: '+err.message,'exception');

			var _stack = err.stack.split("\n");
			_stack.shift();
			for (s in _stack)
				e.owner.e.log(_stack[s],'stack');
		}

	}

};
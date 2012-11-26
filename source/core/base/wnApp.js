/**
 * Source of the wnApp class.
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
			this.e.log("Starting application's components...");
			this.startComponents();
			this.e.log('Application `'+this.getConfig('id')+'` running...');
		},

		/**
		 * Create a new httpRequest handler.
		 * @param $request object
		 * @param $response object
		 */
		createRequest: function (req,resp)
		{
			var httpRequest, reqConf, url = req.url+'';
			try
			{
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
		 * Deletes request
		 */
		deleteRequest: function (req)
		{
			if (req == null)
				return false;
			_requests[req.info.url]=null;
			req.deleted=true;
			req = null;
			_requestCount--;
		},

		/**
		 * Return all opened requests..
		 */
		getRequests: function ()
		{
			return _requests;
		},

		/**
		 * Return all opened requests..
		 */
		getRequestsCount: function ()
		{
			return _requestCount;
		},

		/**
		 * Deletes request
		 */
		setRequestsCount: function (n)
		{
			_requestCount=new Number(n);
		},

		/**
		 * Get new or cached instance from a controller.
		 * @param $id string controller's id
		 * @param $request wnRequest instance
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
		 * @param $arg1 mixed argument
		 * @param $arg2 mixed argument
		 * ...
 		 * @param $argN mixed argument
		 */
		logHandler: function (e,data,zone)
		{
			_localLogs.push([_logId,+new Date,data,zone||'']);
			_logId++;
			if (_localLogs.length > 100) {
				_localLogs.shift();
			}
		},

		/**
		 * Return all logs..
		 */
		getLogs: function (e,data,zone)
		{
			return _localLogs;
		},		

		/**
		 * Exception handler
		 * @param $e eventObject object of this event emition
		 * @param $arg1 mixed argument
		 * @param $arg2 mixed argument
		 * ...
 		 * @param $argN mixed argument
		 */
		exceptionHandler: function (e,err)
		{
			e.owner.e.log('ERROR: '+err.message,'exception');

			var _stack = err.stack.split("\n");
			_stack.shift();
			for (s in _stack)
				e.owner.e.log(_stack[s],'stack');
		},

		flushControllers: function () {
			for (c in _controllers)
				this.c['wn'+(c.substr(0,1).toUpperCase()+c.substr(1))+'Controller']=undefined;
			this.e.log('Limpou');
		},

		flushController: function (c) {
			this.c['wn'+(c.substr(0,1).toUpperCase()+c.substr(1))+'Controller']=undefined;
		},

		run: function (cmd) {
			try {
				with (this) {
					this.e.log(util.inspect(eval(cmd)));
				}
			} catch (e) {
				this.e.exception(e);
			}
		}

	}

};
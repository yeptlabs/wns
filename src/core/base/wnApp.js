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
			'newRequest': {},
			'readyRequest': {},
			'closedRequest': {},	
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
			var httpRequest, reqConf, url = req.url+'', self = this;
			try
			{
				this.e.newRequest(req,resp);
				if (!resp || resp.closed)
					return false;

				reqConf = Object.extend(true,{},this.getComponentConfig('http'),{ id: 'request-'+_requestCount, request: req, response: resp }),
				httpRequest = this.createComponent('wnHttpRequest',reqConf);
				_requestCount++;
				httpRequest.created = +new Date;
				httpRequest.init();
				httpRequest.e.open();
				this.e.readyRequest(httpRequest);
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
			if (typeof err == 'string' || typeof err != 'object' || err.stack == undefined)
				err = new Error(err);

			e.owner.e.log('ERROR: '+err.message,'exception');

			var _stack = err.stack.split("\n");
			_stack.shift();
			for (s in _stack)
				e.owner.e.log(_stack[s],'stack');
		}

	}

};
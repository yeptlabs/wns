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
		_requests: {},
		_requestCount: 0
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
			try
			{
				_requestCount++;
				var reqConf = Object.extend(true,{},this.getComponentConfig('http'),{ id: 'request-'+_requestCount, request: req, response: resp }),
					httpRequest = this.createComponent('wnHttpRequest',reqConf);
				httpRequest.init();
				if (!_requests[req.url+''])
				{
					this.e.log('Open request: '+req.url);
					_requests[req.url+'']=httpRequest;
					httpRequest.once('end',function (e,req) {
						httpRequest.app.e.log('Closed request: '+req.info.originalUrl+' (time: '+((+new Date)-httpRequest.initialTime)+')');
						delete _requests[req.info.originalUrl];
					});
					httpRequest.run();
				} else
				{
					var mainRequest = _requests[req.url];
					mainRequest.once('end', function (e,req) {
						httpRequest.data = req.data;
						httpRequest.compressedData = req.compressedData;
						httpRequest.code = req.code;
						httpRequest.header = req.header;
						httpRequest.send();
					});
				}
			}
			catch (e)
			{
				this.e.exception(e);
			}
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
		logHandler: function (e,data)
		{
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
		}

	}

};
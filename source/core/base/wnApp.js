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
		_requests: {}
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
			var reqConf = Object.extend(true,{},this.getComponentConfig('http'),{ request: req, response: resp, app: this }),
				httpRequest = this.createComponent('wnHttpRequest',reqConf);
			httpRequest.init();
			if (!_requests[req.url+''])
			{
				try
				{
					_requests[req.url]=httpRequest;
					httpRequest.run();
				}
				catch (e)
				{
					this.e.exception(e);
				}
			} else
			{
				var mainRequest = _requests[req.url];
					mainRequest.once('end', function () {
						delete _requests[httpRequest.info.url];
						httpRequest.data = mainRequest.data;
						httpRequest.code = mainRequest.code;
						httpRequest.header = mainRequest.header;
						httpRequest.send();
					});
			}
		},

		/**
		 * Check if a controller class exists and it's loaded.
		 * @param $id string controller's id
		 */
		existsController: function (id)
		{
			var controller = this.getController(id);
			return controller != false && controller != undefined;
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
			}
			var config = { controllerName: id, app: this, request: request, autoInit: true },
				controller = this.createComponent(controllerName,config);
			_controllers[id]=controller;
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
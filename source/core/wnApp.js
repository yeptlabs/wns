/**
 * Source of the wnApp class.
 * 
 * @author: Pedro Nasser
 * @link: http://pedroncs.com/projects/webnode/
 * @license: http://pedroncs.com/projects/webnode/#license
 * @copyright: Copyright &copy; 2012 WebNode Server
 */

/**
 * {full_description}
 *
 * @author Pedro Nasser
 * @version $Id$
 * @pagackge system.base
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

		_controllers: {}
	
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
			var reqConf = Object.extend(true,{},this.getComponentConfig('http'),{ request: req, response: resp, app: this });
				httpRequest = this.createClass('wnHttpRequest',reqConf);	
			try
			{
				httpRequest.run();
			}
			catch (e)
			{
				this.e.exception(e);
			}
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
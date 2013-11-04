 /**
 * WNS Middleware
 * @copyright &copy; 2012- Pedro Nasser &reg;
 * @license: MIT
 * @see http://github.com/yeptlabs/wns
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
		_enabled: false,
		_timeOut: -1
	},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var integer loop interval
		 */
		interval: 0,

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'release': {}
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
			this.start();
		 },

		/**
		 * Function called every script loop.
		 * This is where the script should be written.
		 */
		run: function ()
		{
		},

		/**
		 * Start the script loop.
		 */
		start: function ()
		{
			_enabled = true;
			(function () {
				var args = arguments.callee.bind(this);
				if (this.isEnabled() !== true)
					return false;
				this.once('release', function () {
					_timeOut=setTimeout(args,this.getInterval());
				}.bind(this));
				try {
				 self.run();
				} catch (e) {
				 self.getParent().e.exception&&self.getParent().e.exception(e);
				 self.e.release();
				}
			}.bind(this))();
		},

		/**
		 * Release the loop
		 */
		release: function ()
		{
			this.e.release(true);
		},

		/**
		 * Stop the script loop.
		 */
		stop: function ()
		{
			clearTimeout(_timeOut);
			_enabled = false;
		},

		/**
		 * Set interval between the loops.
		 */
		setInterval: function (n)
		{
			var num = new Number(n).valueOf();
			this.interval = !isNaN(num) ? num: 0; 
		},
	
		/**
		 * Get interval between the loops.
		 */
		getInterval: function ()
		{
			return this.interval;
		},

		/**
		 * Return true if script is enabled
		 */
		isEnabled: function ()
		{
			return _enabled == true;
		}

	}

};
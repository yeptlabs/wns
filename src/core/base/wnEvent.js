/**
 * Source of the wnEvent class.
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
 * @package system.core.events
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
		_filters: [],
		_listeners: []
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
		 * Initializer.
		 */	
		init: function ()
		{
		},
	
        /**
         * Raises the event.
         * Push event and arguments to all event's listeners.
         */
        push: function ()
		{
			if (this.checkFilters.apply(this,arguments))
			{
				var self = this,
					args = [],
					eventObject = function ()
					{
						this.event = self;
						this.owner = self.getParent();
						this.eventName = self.getEventName();
						this.stopPropagation = false;
					};
	
				var	getEventObject = arguments[0] != null && typeof arguments[0] == 'object'
								&& arguments[0].stopPropagation!=undefined ? true : false,
					evtObj = getEventObject ? arguments[0] : new eventObject;

				for (var a = (getEventObject ? 1 : 0); a<arguments.length; a++)
				{
					args.push(arguments[a]);
				}
				
				args.unshift(evtObj);

				var listeners = _listeners.slice();
				for (var i = 0, l = listeners.length; i < l; i++)
				{
					if (evtObj.stopPropagation != true)
						listeners[i].apply(this, args);
				}
			}
        },

		/**
		 * Add new filter to the event.
		 * @param function $filter filter
		 */
		addFilter: function (filter)
		{
			_filters.push(filter);
		},

		/**
		 * Clear all event filters.
		 */
		clearFilters: function ()
		{
			_filters = [];
		},

		/**
		 * Check if passed all filters
		 * @return boolean if passed.
		 */
		checkFilters: function ()
		{
			for (f in _filters)
			{
				if (!_filter[s].apply(undefined,arguments)) return false;
			}
			return true;
		},

        /**
         * Add a new handler to this event.'
         * @param $listener function listener of the event
         */
        addListener: function (listener)
		{
			if ('function' !== typeof listener) return false;
			_listeners.push(listener);
        },

		/**
		 * Alias to addListener.
		 */
		on: function () {
			this.addListener.apply(this,arguments);
		},

        /**
         * Prepend a new handler for the 'event.'
         * @param $listener function listener of the event
         */
        prependListener: function (listener)
		{
			if ('function' !== typeof listener)
				return false;
			_listeners.unshift(listener);
        },

        /**
         * Add a new one-time-listener to this event.
         * @param $listener function listener of the event
         */
		once: function (listener) {
			if ('function' !== typeof listener)
				return false;
			var self = this;
			var g = function ()
			{
				self.removeListener(g);
				listener.apply(this, arguments);
			};
			g.listener = listener;
			self.on(g);
		},

        /**
         * Remove a listener from this event.
         * @param $listener function listener of the event
         */
        removeListener: function (listener)
		{
			if ('function' !== typeof listener)
				return false;

			var list = _listeners;

			var position = -1;
			for (var i = 0, length = list.length; i < length; i++)
			{
				if (list[i] === listener ||
					(list[i].listener && list[i].listener === listener))
				{
					position = i;
					break;
				}
			}

			if (position > -1)
				list.splice(position, 1);

			return this;
        },

        /**
         * Remove all listeners from this event.
         */
        clearListeners: function ()
		{
			_listeners = [];
        },

		/**
		 * Return array of listeners functions
		 */
		getListeners: function ()
		{
			return _listeners;
		},

		/**
		 * Return the name of this event.
		 * @return STRING name of the event
		 */
		getEventName: function ()
		{
			return this.getConfig('eventName');
		}
	
	}

};
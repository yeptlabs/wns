/**
 * Source of the wnEvent class.
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
         * Push anything to the exception stack.
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
						this.owner = self.getConfig('source');
						this.eventName = self.getEventName();
						this.stopPropagation = false;
					};

				var	getEventObject = typeof arguments[0] == 'object'
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
         * Add a new handler for the 'event.'
         * @param $listener function listener of the event
         */
        addListener: function (listener)
		{
			if ('function' !== typeof listener) return false;
			_listeners.push(listener);
        },


        /**
         * Prepend a new handler for the 'event.'
         * @param $listener function listener of the event
         */
        prependListener: function (listener)
		{
			if ('function' !== typeof listener) return false;
			_listeners.unshift(listener);
        },

        /**
         * Remove and listener from the 'event.'
         * @param $listener function listener of the event
         */
        removeListener: function (listener)
		{

			var position = -1, list = _listeners;
			for (var i = 0, length = list.length; i < length; i++) {
			  if (list[i] === listener ||
				  (list[i].listener && list[i].listener === listener))
			  {
				position = i;
				break;
			  }
			}

			if (position < 0)
				return this;
			list.splice(position, 1);
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
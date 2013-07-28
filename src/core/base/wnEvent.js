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
 * @package system.core.base
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
		_listeners: undefined
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
         * Raises the event.
         * Push event and arguments to all event's listeners.
         * @return boolean the event has been emitted?
         */
        push: function ()
		{
			var type = typeof _listeners, listener, len, args=[], _arguments=arguments;

			if (type === 'undefined')
				return false;

			var eventObject = function ()
				{
					this.event = self;
					this.owner = self.getParent();
					this.eventName = self.getEventName();
					this.stopPropagation = false;
				},
				ieo = arguments[0] != null && typeof arguments[0] == 'object'
									&& arguments[0].stopPropagation!=undefined ? true : false,
				evtObj = ieo ? arguments[0] : new eventObject;

			if (type === 'function')
			{
				listener = _listeners;
				switch (_arguments.length)
				{
					case 0:
						listener.call(self,evtObj);
						break;
					case 1:
						listener.call(self,evtObj,ieo ? undefined : _arguments[0]);
						break;
					case 2:
						listener.call(self,evtObj,_arguments[ieo ? 1 : 0],ieo ? undefined : _arguments[1]);
						break;
					case 3:
						listener.call(self,evtObj,_arguments[ieo ? 1 : 0],_arguments[ieo ? 2 : 1],ieo ? undefined : _arguments[2]);
						break;
					default:
						var args = [];
						for (var a = (ieo ? 1 : 0); a<_arguments.length; a++)
							args.push(_arguments[a]);
						args.unshift(evtObj);
						listener.apply(self,args);
				}
			} else if (type === 'object')
			{
				if (_listeners.length==2)
				{
					listener = _listeners[0];
					switch (_arguments.length)
					{
						case 0:
							listener.call(self,evtObj);
							break;
						case 1:
							listener.call(self,evtObj,ieo ? undefined : _arguments[0]);
							break;
						case 2:
							listener.call(self,evtObj,_arguments[ieo ? 1 : 0],ieo ? undefined : _arguments[1]);
							break;
						case 3:
							listener.call(self,evtObj,_arguments[ieo ? 1 : 0],_arguments[ieo ? 2 : 1],ieo ? undefined : _arguments[2]);
							break;
						default:
							var args = [];
							for (var a = (ieo ? 1 : 0); a<_arguments.length; a++)
								args.push(_arguments[a]);
							args.unshift(evtObj);
							listener.apply(self,args);
					}
					if (evtObj.stopPropagation === true)
						return false;
					else 
					{
						listener = _listeners.length == 2 ? _listeners[1] : _listeners[0];
						switch (_arguments.length)
						{
							case 0:
								listener.call(self,evtObj);
								break;
							case 1:
								listener.call(self,evtObj,ieo ? undefined : _arguments[0]);
								break;
							case 2:
								listener.call(self,evtObj,_arguments[ieo ? 1 : 0],ieo ? undefined : _arguments[1]);
								break;
							case 3:
								listener.call(self,evtObj,_arguments[ieo ? 1 : 0],_arguments[ieo ? 2 : 1],ieo ? undefined : _arguments[2]);
								break;
							default:
								var args = [];
								for (var a = (ieo ? 1 : 0); a<_arguments.length; a++)
									args.push(_arguments[a]);
								args.unshift(evtObj);
								listener.apply(self,args);
						}
					}
				} else {
					var listeners = _listeners.slice();
					for (var i = 0, l = listeners.length; i < l; i++)
					{
						if (evtObj.stopPropagation == true)
							return true;
						listener = listeners[i];
						switch (_arguments.length)
						{
							case 0:
								listener.call(self,evtObj);
								break;
							case 1:
								listener.call(self,evtObj,ieo ? undefined : _arguments[0]);
								break;
							case 2:
								listener.call(self,evtObj,_arguments[ieo ? 1 : 0],ieo ? undefined : _arguments[1]);
								break;
							case 3:
								listener.call(self,evtObj,_arguments[ieo ? 1 : 0],_arguments[ieo ? 2 : 1],ieo ? undefined : _arguments[2]);
								break;
							default:
								var args = [];
								for (var a = (ieo ? 1 : 0); a<_arguments.length; a++)
									args.push(_arguments[a]);
								args.unshift(evtObj);
								listener.apply(self,args);
						}
					}
				}
			}
			return true;
        },

		/**
		 * Add new filter to the event.
		 * @param function $filter filter
		 */
		addFilter: function (filter)
		{
			_filters.push(filter);
			return this;
		},

		/**
		 * Clear all event filters.
		 */
		clearFilters: function ()
		{
			_filters = [];
			return this;
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
        addListener: function (listener,prepend)
		{
			if ('function' !== typeof listener)
				return false;

			if (!_listeners)
				_listeners=listener;
			else if (typeof _listeners == 'object')
			{
				if (!prepend)
					_listeners.push(listener);
				else
					_listeners.unshift(listener);
			} else
			{
				if (!prepend)
					_listeners = [_listeners,listener];
				else
					_listeners = [listener,_listeners];
			}
			return this;
        },

		/**
		 * Alias to addListener.
		 */
		on: function () {
			return this.addListener.apply(this,arguments);
		},

        /**
         * Prepend a new handler for the 'event.'
         * @param $listener function listener of the event
         */
        prependListener: function (listener)
		{
			this.addListener(listener,true);
			return this;
        },

        /**
         * Add a new one-time-listener to this event.
         * @param $listener function listener of the event
         */
		once: function (listener, prepend) {
			if ('function' === typeof listener)
			{
				var self = this,
					g = function ()
					{
						self.removeListener(g);
						listener.apply(this, arguments);
					};
				g.listener = listener;
				
				this.addListener(g,prepend)
			}
			return this;
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
		
			if (list === listener ||
      			(typeof list.listener === 'function' && list.listener === listener))
					_listeners = undefined;
			else if (typeof list === 'object')
			{
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
			}

			return this;
        },

        /**
         * Remove all listeners from this event.
         */
        clearListeners: function ()
		{
			_listeners = [];
			return this;
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
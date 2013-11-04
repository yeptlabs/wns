 /**
 * WNS Middleware
 * @copyright &copy; 2012- Pedro Nasser &reg;
 * @license: MIT
 * @see http://github.com/yeptlabs/wns
 * @author Pedro Nasser
 */

module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnComponent'],

	/**
	 * PRIVATE
	 */
	private: {
		_config: {
			eventName: undefined,
			async: false
		},
		_listeners: null
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
		 * Call the listener
		 * @param {function} listener
		 * @param {object} event object
		 */
		callListener: function (listener,evtObj)
		{
			if (!_.isFunction(listener) || !_.isObject(evtObj))
				return false;

			var args = evtObj.arguments;			
			switch (args.length)
			{
				case 1:
					listener(args[0]);
					break;
				case 2:
					listener(args[0],args[1]);
					break;
				case 3:
					listener(args[0],args[1],args[2]);
					break;
				case 4:
					listener(args[0],args[1],args[2],args[3]);
					break;
				case 5:
					listener(args[0],args[1],args[2],args[3],args[4]);
					break;
				default:
					listener.apply(undefined,args);
			}
		},

        /**
         * Emit this event.
         */
        emit: function ()
		{
			if (_.isNull(_listeners))
				return false;

			var isArray = _.isArray(_listeners), listener, len, args=[], _arguments=arguments;			

			var eventObject = function ()
				{
					var args = _.toArray(_arguments);
					var evtObj = this;
					args.unshift(this);
					this.index=0;
					Object.defineProperty(this,'event',{value:self,enumerable:false,writable:false});
					Object.defineProperty(this,'owner',{value:self.getParent(),enumerable:false,writable:false});
					Object.defineProperty(this,'evetName',{value:self.getEventName(),enumerable:true,writable:false});
					Object.defineProperty(this,'stopPropagation',{value:false,enumerable:false});
					Object.defineProperty(this,'lastListeners',{value:(isArray ? _listeners.length : 1),enumerable:false});
					Object.defineProperty(this,'listeners',{value:_listeners,enumerable:false,writable:false});
					Object.defineProperty(this,'arguments',{value:args,enumerable:false,writable:false});
					if (_config.async)
						this.next = function () {
							if (_.isArray(this.listeners))
							{							
								if (this.listeners.length == this.lastListeners)
									this.index++;

								var listener = this.listeners[this.index];
								var evtObj = this;
								self.callListener(listener,evtObj);
							}
						};
				},
				ieo = arguments[0] != null && typeof arguments[0] == 'object'
									&& arguments[0].stopPropagation!=undefined ? true : false,
				evtObj = ieo ? arguments[0] : new eventObject;

			if (!isArray)
			{
				self.callListener(_listeners,evtObj);
			} else
			{
				if (_listeners.length==2)
				{

					self.callListener(_listeners[0],evtObj);

					if (evtObj.stopPropagation === true || _config.async === true)
						return false;
				
					listener = _listeners.length == 2 ? _listeners[1] : _listeners[0];
					self.callListener(listener,evtObj);

				} else {
					var listeners = _listeners.slice();

					if (_config.async === true)
						self.callListener(listeners[0],evtObj);
					else 
						for (var i = 0, l = listeners.length; i < l; i++)
						{

							if (evtObj.stopPropagation == true)
								return true;

							self.callListener(listeners[i],evtObj);
						}
				}
			}
			return true;
        },

        /**
         * Add a new handler to this event.'
         * @param function $listener listener of the event
         * @param boolean $prepend
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
					g = function (e)
					{
						e.lastListeners--;
						self.removeListener(g);
						listener.apply(listener, arguments);
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

				if (list.length == 1)
					_listeners = list[0];
			}

			return this;
        },

        /**
         * Remove all listeners from this event.
         */
        clearListeners: function ()
		{
			_listeners = null;
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
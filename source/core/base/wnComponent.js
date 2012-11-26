/**
 * Source of the wnComponent class.
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
	extend: [],

	/**
	 * Constructor
	 * DO NOT OVERWRITE this.
	 */	
	constructor: function (config,classes)
	{
		Object.defineProperty(this,'c',{ value: (classes || {}), enumerable:false, writable: false });
		this.setConfig(config);
		this.preloadEvents();
		this.getConfig('autoInit')!=false&&this.init.apply(this,arguments); 
		_initialized=true;
	},

	/**
	 * PRIVATE
	 */
	private:
	{
		_parent: {},
		_initialized: false,
		_config: {},
		_events: {},
		_eventsConfig: {},
		_classBuilder: {},
		_className: '',
		_extend: []
	
	},

	/**
	 * Public Variables
	 */
	public:
	{

		/**
		 * @var object loaded events.
		 */
		e: {
			log: function () {}
		},

		/**
		 * @var object imported classes.
		 */
		c: {},

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {}

	},

	/**
	 * Methods
	 */
	methods:
	{

		/**
		 * Get this modules class name
		 * @return string class name
		 */
		getClassName: function ()
		{
			return _className;
		},

		/**
		 * Get list of extend of this component.
		 * @return array list of extend.
		 */
		getExtend: function ()
		{
			return _extend;
		},

		/**
		 * Check if this component is instance of an specific class.
		 * @return boolean if this component is instance of a class.
		 */
		instanceOf: function (name)
		{
			return _extend.indexOf(name+'') != -1;
		},

		/**
		 * Extend this module configuration with new properties.
		 * @param OBJECT $extend configuration extension
		 * @param BOOLEAN $overwrite overwrite it?
		 */
		setConfig: function (extend, overwrite)
		{
			if (typeof extend != 'object') return false;
			_config=Object.extend(true,_config,extend);
			return true;
		},

		/**
		 * Return the module's configuration
		 * @return OBJECT module's configuration
		 */
		getConfig: function (attr)
		{
			return attr ? _config[attr] : _config;
		},

		/**
		 * Get a file.
		 * The file's path is relative to the module's path.
		 * @param $filePath string file's path
		 */
		getFile: function (filePath,binary) {
			var realPath = this.instanceOf('wnModule')?this.modulePath+filePath:filePath;
			if (fs&&fs.existsSync(realPath)) {
				var file = fs.readFileSync(realPath);
				return (binary===true) ? file : file.toString();
			}
			return false;
		},

		/**
		 * Preload all required events
		 */
		preloadEvents: function ()
		{
			var preload = Object.extend(true,{},this.defaultEvents,this.getConfig().events);
			if (preload != undefined)
				this.setEvents(preload);
			for (e in preload)
			{
				this.getEvent(e);
			}
			this.attachEventsHandlers();
		},

		/**
		 * Create an class from the classSources.
		 * @var string $className name of the class
		 * @var object $config class configuration
		 */
		createClass: function (className,config)
		{
			var source = this.c || wns;
			return new source[className](config);
		},
		
		/**
		 * Search for handlers and eventlisteners
		 * of all events of this component.
		 */
		attachEventsHandlers: function () {
			var events = this.getEvents();
			for (e in events)
			{
				var eventName = e.split('-').pop(),
					event = this.getEvent(eventName),
					evtConfig = event.getConfig();

				if (evtConfig.handler != null && this[evtConfig.handler] && typeof this[evtConfig.handler] == 'function')
				{
					event.addListener(this[evtConfig.handler]);
					event.setConfig({ handler: null });
				}

				if (evtConfig.listenEvent != null && e.indexOf('event-module') == -1 && this.hasEvent(evtConfig.listenEvent))
				{
					var listenTo = this.getEvent(evtConfig.listenEvent),
						listenName = evtConfig.listenEvent+'';
					listenTo.addListener(function (e) {
						if (typeof e == 'object'
							&& e.stopPropagation == true)
									return false;
						this.event.push.apply(this.event,arguments);
					}.bind({ event: event }));
					event.setConfig({ listenEvent: null });
				}
			}
		},

		/**
		 * Set new properties to the respective events
		 * @param OBJECT $events events configurations
		 */
		setEvents: function (events)
		{
			var event = {};
			for (e in events)
			{
				var ref=events[e],
					e = 'event-'+e.replace('-','.');
				event[e]=ref;
				event[e].class=ref.class || 'wnEvent';
				if (this.hasEvent(e))
				{
					Object.extend(true,event[e],this.getEvent(e));
				}
				_eventsConfig[e]=Object.extend(true,_eventsConfig[e] || {}, event[e]);
			}
		},

		/**
		 * Get an event and create an alias to the push function.
		 * @param STRING $name eventName
		 * @return wnEvent instance
		 */
		getEvent: function (name,hidden)
		{
			var eventName = 'event-'+name;
			if (_events[eventName] != undefined) 
				return _events[eventName];
			else
			{
				var config = _eventsConfig[eventName] || {},
					className = config.class;
					config.id = eventName;
					config.autoInit = false;
					var evt = this.createClass(className,config);
					evt.setParent(this);
					evt.init();
					if (hidden != false)
					{
						_events[eventName] = evt;
						this.e[name]=function () { evt.push.apply(evt,arguments); };
					} else
					{
						Object.defineProperty(_events[eventName],{ value: evt, enumerable: false });
					}
					return evt;
			}
		},

		/**
		 * Get a list of all event loaded in this component
		 */
		getEvents: function ()
		{
			return _events;
		},

		/**
		 * Check if the event exists in this component.
		 */
		hasEvent: function (name)
		{
			return _events['event-'+name] != undefined;
		},

		/**
		 * Add a new one-time-listener to the event, if it exists
		 * @param string $eventName event name
		 * @param function $handler event handler
		 */
		once: function (eventName,handler) {
			var event;
			if (event = this.getEvent(eventName))
			{
				if (!event.once(handler))
					this.e.log('Invalid handler sent to event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
			} else
				this.e.log('Not existent event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
		},

		/**
		 * Add a new listener to the event, if it exists
		 * @param string $eventName event name
		 * @param function $handler event handler
		 */
		addListener: function (eventName,handler) {
			var event;
			if (event = this.getEvent(eventName))
			{
				if (!event.addListener(handler))
					this.e.log('Invalid handler sent to event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
			} else
				this.e.log('Not existent event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
		},

		/**
		 * Returns the parent object.
		 * @returen object the parent object.
		 */
		getParent: function ()
		{
			return _parent;
		},

		/**
		 * Set an object as components's parent
		 * @param $newParent object new parent
		 */
		setParent: function (newParent)
		{
			if (typeof newParent == 'object')
			{
				_parent = newParent;
			}
		},

		/**
		 * Checks if this application component bas been initialized.
		 * @return boolean whether this application component has been initialized (ie, {@link init()} is invoked).
		 */
		getIsInitialized: function ()
		{
			return _initialized;
		},

		/**
		 * This methods is called after the real initialization of the component
		 */
		init: function ()
		{
		}

	}

};
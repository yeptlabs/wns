/**
 * Source of the wnComponent class.
 * 
 * @author: Pedro Nasser
 * @link: http://wns.yept.net/
 * @license: http://yept.net/projects/wns/#license
 * @copyright: Copyright &copy; 2012 WNS
 */

/**
 * wnComponent is the class that extend almost every component in WNS
 * It implements the creation of classes, events and some default methods.
 * 
 * The event can be set by configuring the config file or editing the defaultEvents
 * properties. Doing the event be preloaded.
 *
 * An event is builded by the {@link wnEvent} class.
 *
 * With the event loaded, you can attach handlers to listen when the event raise.
 * An event handler can be attached with the methods {@link once} and {@link addListener}.
 * 
 * To raise the event inside the component context, you can just use the method with the
 * event name inside the {@link e} property.
 * Or just get the event object than use the {@link push} method.
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
	 * Private
	 */
	private:
	{
		/**
		 * @var private object parent's reference
		 */
		_parent: {
			e: {}
		},

		/**
		 * @var private boolean its the component loaded?
		 */
		_initialized: false,

		/**
		 * @var private object component's configuration object
		 */
		_config: {},

		/**
		 * @var private object component's events object
		 */
		_events: {},

		/**
		 * @var private object component's events config
		 */
		_eventsConfig: {},

		/**
		 * @var private object component's class builder reference.
		 */
		_classBuilder: {},

		/**
		 * @var private string component's classname
		 */
		_className: '',

		/**
		 * @var private array component's extension list
		 */
		_extend: []
	
	},

	/**
	 * Public Variables
	 */
	public:
	{
		/**
		 * @var object component's events aliases object
		 */
		e: {
			log: function () {}
		},

		/**
		 * @var object component's classes's builder object
		 */
		c: {},

		/**
		 * @var object component's models's builder object
		 */
		m: {},

		/**
		 * @var object events to be preloaded. 
		 */
		defaultEvents: {
		}
	},

	/**
	 * Methods
	 */
	methods:
	{

		/**
		 * Get the class name of this component
		 * @return string class name
		 */
		getClassName: function ()
		{
			return _className;
		},

		/**
		 * Get list of extend of this component.
		 * @return array list of extend
		 */
		getExtend: function ()
		{
			return _extend;
		},

		/**
		 * Check if this component is an instance of a specific class.
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
		getFile: function (filePath,binary,cb)
		{
			var realPath = this.instanceOf('wnModule')?this.modulePath+filePath:filePath,
				cmd = !cb ? 'readFileSync' : 'readFile';
				if (!fs.existsSync(realPath))
					return (cb&&cb(false) == true);
				var _cb = cb ? function (err,file) {
					cb&&cb(!err ? ((binary===true) ? file : file.toString()) : false);
				} : null,
				file = fs[cmd](realPath,_cb);
			return (file ? ((binary===true) ? file : file.toString()) : false);
		},

		/**
		 * Get a file statistic.
		 * The file's path is relative to the module's path.
		 * @param $filePath string file's path
		 */
		getFileStat: function (filePath,cb)
		{
			var realPath = this.instanceOf('wnModule')?this.modulePath+filePath:filePath,
				cmd = !cb ? 'statSync' : 'stat';
			if (!fs.existsSync(realPath))
				return (cb&&cb(false) == true);
			var _cb = cb ? function (err,stat) {
					cb&&cb(!err ? stat : false);
				} : null,
				stat = fs[cmd](realPath,_cb);
			return stat;
		},

		/**
		 * Preload all required events
		 */
		preloadEvents: function ()
		{
			this.e.log&&this.e.log('Preloading events...','system');
			var preload = Object.extend(true,{},this.defaultEvents,this.getConfig().events);
			if (preload != undefined)
				this.setEvents(preload);
			for (e in preload)
			{
				this.getEvent(e);
			}
			this.attachEventsHandlers();
			return this;
		},

		/**
		 * Create an class from the classSources.
		 * @var string $className name of the class
		 * @var object $config class configuration
		 */
		createClass: function (className,config)
		{
			var source = this.c || wns;
			return new source[className](config,source);
		},
		
		/**
		 * Search for handlers and eventlisteners
		 * of all events of this component.
		 */
		attachEventsHandlers: function () {
			this.e.log&&this.e.log("Attaching default event's handlers...",'system');
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
				if (!_eventsConfig[eventName] || !this.c)
					return false;
				var config = _eventsConfig[eventName] || {},
					_class = config.class;
				config.id = eventName;
				config.autoInit = false;
				var evt = this.createClass(_class,config);
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
		 * Get all defined configuration of events.
		 */
		getEventsConfig: function ()
		{
			return _eventsConfig;
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
			return this;
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
			return this;
		},

		/**
		 * Prepend a new listener to the event, if it exists
		 * @param string $eventName event name
		 * @param function $handler event handler
		 */
		prependListener: function (eventName,handler) {
			var event;
			if (event = this.getEvent(eventName))
			{
				if (!event.prependListener(handler))
					this.e.log('Invalid handler sent to event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
			} else
				this.e.log('Not existent event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
			return this;
		},

		/**
		 * Prepend a new one-time-listener to the event, if it exists
		 * @param string $eventName event name
		 * @param function $handler event handler
		 */
		prependOnce: function (eventName,handler) {
			var event;
			if (event = this.getEvent(eventName))
			{
				if (!event.once(handler,true))
					this.e.log('Invalid handler sent to event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
			} else
				this.e.log('Not existent event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
			return this;
		},

		/**
		 * Return an object with all attributes and configuration of this component
		 */
		export: function ()
		{
			var _export = {},
				merge = {};
			Object.extend(merge,this.getConfig(),this);
			for (p in merge)
			{
				if (!((typeof merge[p] == 'object' || typeof merge[p] == 'function') && merge[p] != null && merge[p].instanceOf!=undefined))
				{
					_export[p] = merge[p];
				}
			}
			return _export;
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
			return this;
		},

		/**
		 * Checks if this component bas been initialized.
		 * @return boolean whether this component has been initialized (ie, {@link init()} is invoked).
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
			return this;
		},

		/**
		 * Execute an expression in this component's context.
		 * @param string $cmd expression
		 * @param object $context forced context
		 * @return mixed result of the eval
		 */
		exec: function (cmd,context)
		{
			var ctx = (context!=undefined?context:this);
			try
			{
				(function () {
					self.e.log&&self.e.log(util.inspect(eval(cmd)),'result');
				}.bind(ctx))();
			} catch (e)
			{
				this.e.exception&&this.e.exception(e);
			}
			return this;
		}

	}

};
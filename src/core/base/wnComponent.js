/**
 * @WNS - The NodeJS Middleware and Framework
 * 
 * @copyright: Copyright &copy; 2012- YEPT &reg;
 * @page: http://wns.yept.net/
 * @docs: http://wns.yept.net/docs/
 * @license: http://wns.yept.net/license/
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
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: [],

	/**
	 * Node/NPM modules dependencies
	 */
	dependencies: ['fs','path','util'],

	/**
	 * Constructor
	 */	
	constructor: function (config,classes)
	{
		Object.defineProperty(this,'c',{ value: (classes || {}), enumerable:false, writable: false });
		this.setConfig(config);
		_debug = this.getConfig('debug')===true;
		_verbosity = this.getConfig('verbosity') || 0;
		_logName = this.getConfig('logName') || className || '';
		this.e.log = function () {
			if (self.getParent() && self.getParent().e.log)
			{
				if (arguments[0])
					arguments[0]=_logName+' * '+arguments[0];
				self.getParent().e.log.apply(self.getParent(),arguments);
			}
		};
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
		 * @var run in debug mode?
		 */
		_debug: false,

		/**
		 * @var verbosity level
		 */
		_verbosity: 0,

		/**
		 * @var name to be shown on logs.
		 */
		_logName: '',		

		/**
		 * @var private boolean its the component loaded?
		 */
		_initialized: false,

		/**
		 * @var private object component's configuration object
		 */
		_config: {
			debug: false
		},

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
		defaultEvents: {}
	},

	/**
	 * Methods
	 */
	methods:
	{

		/**
		 * Get the class name of this component
		 * @return string
		 */
		getClassName: function ()
		{
			return className;
		},

		/**
		 * Get list of extend of this component.
		 * @return array
		 */
		getExtend: function ()
		{
			return __extend;
		},

		/**
		 * Check if this component is an instance of a specific class.
		 * @return boolean
		 */
		instanceOf: function (name)
		{
			return __extend.indexOf(name+'') != -1;
		},

		/**
		 * Extend this module configuration with new properties.
		 * @param object $extend configuration extension
		 * @param true $overwrite overwrite it?
		 * @return boolean
		 */
		setConfig: function (extend, overwrite)
		{
			if (typeof extend != 'object') return false;
			_config=_.merge(_config,extend);
			return true;
		},

		/**
		 * Return the module's configuration
		 * @param string $attr configure attribute
		 * @return object module's configuration
		 */
		getConfig: function (attr)
		{
			return attr ? _config[attr] : _config;
		},

		/**
		 * Export to JSON the components's config.
		 * @param object $obj
		 * @return object
		 */
		exportConfig: function (obj)
		{
			if (typeof obj === 'undefined')
			{
				obj = this.getConfig();
				delete obj.class;
			}

			if (typeof obj == 'object')
			{

				delete obj.autoInit;
				delete obj.id;
				delete obj.serverID;
				delete obj.modulePath;

				for (o in obj)
				{
					this.exportConfig(obj[o]);
				}
			}

			return JSON.stringify(obj, null, '\t');
		},
		
		/**
		 * Get a file.
		 * The file's path is relative to the module's path.
		 * @param string $filePath file's path
		 * @param boolean $binary is it binary?
		 * @param function $cb async callback function
		 * @return boolean|string
		 */
		getFile: function (filePath)
		{
			if (typeof arguments[1]=='function')
				var cb = arguments[1];

			if (typeof arguments[2]=='function')
				var cb = arguments[2];

			var binary = typeof arguments[1]=='boolean' ? arguments[1] : false,
				realPath = this.instanceOf('wnModule')?this.modulePath+filePath:filePath,
				cmd = !cb ? 'readFileSync' : 'readFile';

			try {
				var _cb = cb ? function (err,file) {
					cb&&cb(!err ? ((binary===true) ? file : file.toString()) : false);
				} : null,
				file = fs[cmd](realPath,_cb);
			} catch (e)
			{
				if (_cb)
					cb&&cb(false);
				else
					return false;
			}
			return (file ? (binary===true) ? file : file.toString() : false);
		},

		/**
		 * Promise: Get a file.
		 * The file's path is relative to the module's path.
		 * @param string $filePath file's path
		 * @param boolean $buffer return as buffer?
		 * @return promise
		 */
		$getFile: function (filePath,buffer)
		{
			if (!_.isString(filePath))
				done.reject(false);
			else {
				var realPath = done.promise.filePath = this.instanceOf('wnModule')?this.modulePath+filePath:filePath;
				done.promise.returnAsBuffer=buffer=buffer || true;

				fs.readFile(realPath,function (err,text) {
					if (err)
						done.reject(err);
					else
					{
						if (!buffer)
							text=text.toString('utf8');
						done.resolve(text);
					}
				});
			}

			return done.promise;
		},

		/**
		 * Get a file statistic.
		 * The file's path is relative to the module's path.
		 * @param string $filePath file's path
		 * @param function $cb callback
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
		 * @return this
		 */
		preloadEvents: function ()
		{
			this.e.log&&this.e.log('Preloading events...','system');
			var preload = {};
			preload=_.merge(preload,this.defaultEvents);
			preload=_.merge(preload,this.getConfig().events);
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
		 * @param string $className name of the class
		 * @param object $config class configuration
		 * @param component $boolean is it component format?
		 * @return boolean|object
		 */
		createClass: function (className,config,path,npmPath)
		{
			var source = this.c || process.wns;
			var instance;
			var builder = this.getComponent&&this.getComponent('classBuilder');

			if (!source || !source[className])
			 { return false; }

			if (config.id)
				source[className].build.id = config.id;

			if (source[className].build.extend.indexOf('wnModule')!==-1)
			{
				instance = new source[className](self,config,path,npmPath,builder.classesPath);
			}
			else
				instance = new source[className](config,source);

			if (WNS_TEST && builder)
			{
				console.log('- Testing '+className)
				var tests = builder.classes[className].test;
				for (t in tests)
				{
					//console.log('Testing: '+t);
					tests[t](instance);
				}
			}
			return instance;
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
		 * @param object $events events configurations
		 * @return this
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
				event[e].eventName = e.split('-').pop();
				if (this.hasEvent(e))
				{
					event[e]=_.merge(event[e],this.getEvent(e));
				}
				_eventsConfig[e]=_eventsConfig[e] || {};
				_eventsConfig[e]=_.merge(_eventsConfig[e], event[e]);
			}
			return this;
		},

		/**
		 * Get an event and create an alias to the push function.
		 * @param string $name eventName
		 * @param boolean $hidden ?
		 * @return wnEvent
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
				if (evt)
				{
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
				return false;
			}
		},

		/**
		 * Get a list of all event loaded in this component
		 * @return object
		 */
		getEvents: function ()
		{
			return _events;
		},

		/**
		 * Get all defined configuration of events.
		 * @return object
		 */
		getEventsConfig: function ()
		{
			return _eventsConfig;
		},

		/**
		 * Check if the event exists in this component.
		 * @return object
		 */
		hasEvent: function (name)
		{
			return _events['event-'+name] != undefined;
		},

		/**
		 * Add a new one-time-listener to the event, if it exists
		 * @param string $eventName event name
		 * @param function $handler event handler
		 * @return this
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
		 * @return this
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
		 * @return this
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
		 * @return this
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
		 * @return object
		 */
		export: function ()
		{
			var _export = {},
				merge = {};
			merge=_.merge(merge,this.getConfig());
			merge=_.merge(merge,this);
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
		 * @return object
		 */
		getParent: function ()
		{
			return _parent;
		},

		/**
		 * Component's debug log function
		 * @return self
		 */
		debug: function (msg,verbosity)
		{
			if (!_debug || verbosity>_verbosity)
				return false;
			this.e.log.apply(this,[msg||'','debug',verbosity||0]);
			return self;
		},

		/**
		 * Component's info log function
		 * @return self
		 */
		info: function ()
		{
			arguments[arguments.length+'']='info';
			arguments.length++;
			this.e.log.apply(this,arguments);
			return self;
		},

		/**
		 * Component's warn log function
		 * @return self
		 */
		warn: function ()
		{
			arguments[arguments.length+'']='warn';
			arguments.length++;
			this.e.log.apply(this,arguments);
			return self;
		},

		/**
		 * Component's sys log function
		 * @return self
		 */
		syslog: function ()
		{
			arguments[arguments.length+'']='system';
			arguments.length++;
			this.e.log.apply(this,arguments);
			return this;
		},

		/**
		 * Set an object as components's parent
		 * @param $newParent object new parent
		 * @return this
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
		 * @return boolean
		 */
		getIsInitialized: function ()
		{
			return _initialized;
		},

		/**
		 * This methods is called after the real initialization of the component
		 * @return this
		 */
		init: function ()
		{
			return this;
		},

		/**
		 * Execute an expression in this component's context.
		 * @param string $cmd expression
		 * @param object $context forced context
		 * @return this
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
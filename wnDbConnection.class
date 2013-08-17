//@wnDbConnection


// Initialization
var self={}, className="wnDbConnection";
function wnDbConnection() { self = this; this.className = "wnDbConnection"; };
var klass = wnDbConnection;
var classProto = wnDbConnection.prototype;
var __extend = [ 'wnComponent' ];
classProto.construct = function () {};

// Importing WNS extensions

// - Extend: wnComponent
(function () {

// Declaring private vars 
var _=self,_parent = { e: {} },_initialized = false,_config = {},_events = {},_eventsConfig = {},_classBuilder = {},_className = '';

// Declaring methods
classProto['getClassName'] = function ()
		{
			return className;
		};
classProto['getExtend'] = function ()
		{
			return __extend;
		};
classProto['instanceOf'] = function (name)
		{
			return __extend.indexOf(name+'') != -1;
		};
classProto['setConfig'] = function (extend, overwrite)
		{
			if (typeof extend != 'object') return false;
			_config=Object.extend(true,_config,extend);
			return true;
		};
classProto['getConfig'] = function (attr)
		{
			return attr ? _config[attr] : _config;
		};
classProto['exportConfig'] = function (obj)
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
		};
classProto['getFile'] = function (filePath)
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
		};
classProto['getFileStat'] = function (filePath,cb)
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
		};
classProto['preloadEvents'] = function ()
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
		};
classProto['createClass'] = function (className,config)
		{
			var source = this.c || process.wns;
			var builder = this.getComponent&&this.getComponent('classBuilder');
			source.name = '';
			if (config.id)
			{
				source[className].build.id = config.id;
			}

			var instance = new source[className](config,source);
			// if (className=='wnEvent')
			// 	console.log(instance.getEventName());
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
		};
classProto['attachEventsHandlers'] = function () {
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
		};
classProto['setEvents'] = function (events)
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
					Object.extend(true,event[e],this.getEvent(e));
				}
				_eventsConfig[e]=Object.extend(true,_eventsConfig[e] || {}, event[e]);
			}
			return this;
		};
classProto['getEvent'] = function (name,hidden)
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
		};
classProto['getEvents'] = function ()
		{
			return _events;
		};
classProto['getEventsConfig'] = function ()
		{
			return _eventsConfig;
		};
classProto['hasEvent'] = function (name)
		{
			return _events['event-'+name] != undefined;
		};
classProto['once'] = function (eventName,handler) {
			var event;
			if (event = this.getEvent(eventName))
			{
				if (!event.once(handler))
					this.e.log('Invalid handler sent to event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
			} else
				this.e.log('Not existent event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
			return this;
		};
classProto['addListener'] = function (eventName,handler) {
			var event;
			if (event = this.getEvent(eventName))
			{
				if (!event.addListener(handler))
					this.e.log('Invalid handler sent to event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
			} else
				this.e.log('Not existent event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
			return this;
		};
classProto['prependListener'] = function (eventName,handler) {
			var event;
			if (event = this.getEvent(eventName))
			{
				if (!event.prependListener(handler))
					this.e.log('Invalid handler sent to event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
			} else
				this.e.log('Not existent event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
			return this;
		};
classProto['prependOnce'] = function (eventName,handler) {
			var event;
			if (event = this.getEvent(eventName))
			{
				if (!event.once(handler,true))
					this.e.log('Invalid handler sent to event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
			} else
				this.e.log('Not existent event `'+eventName+'` on `'+this.getConfig('id')+'`','warning');
			return this;
		};
classProto['export'] = function ()
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
		};
classProto['getParent'] = function ()
		{
			return _parent;
		};
classProto['setParent'] = function (newParent)
		{
			if (typeof newParent == 'object')
			{
				_parent = newParent;
			}
			return this;
		};
classProto['getIsInitialized'] = function ()
		{
			return _initialized;
		};
classProto['init'] = function ()
		{
			return this;
		};
classProto['exec'] = function (cmd,context)
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
		};

// Declaring public vars
classProto['e'] = { log: function () {} };
classProto['c'] = {};
classProto['m'] = {};
classProto['defaultEvents'] = {};

// Constructor
classProto.construct=function (config,classes)
	{
		Object.defineProperty(this,'c',{ value: (classes || {}), enumerable:false, writable: false });
		this.setConfig(config);
		this.preloadEvents();
		this.getConfig('autoInit')!=false&&this.init.apply(this,arguments); 
		_initialized=true;
	};

})();


// Class: wnDbConnection 
(function () {

// Declaring private vars 
var _=self,_schema = null;

// Declaring methods
classProto['init'] = function ()
		{
			this.createDataObject();
			if (this.dataObject && this.dataObject.driver)
			{
				this.dataObject.addListener('ready',function () {
					self.e.ready.apply(self,arguments);
				});
				this.dataObject.addListener('connect', function (e,con) {
					self.connection = con;
					self.connected = true;
					self.e.connect.apply(self,arguments);
				});
				this.dataObject.addListener('close', function () {
					self.connected = false;
					self.e.close.apply(self,arguments);
				});
				this.dataObject.addListener('result', function () {
					self.e.result.apply(self,arguments);
				});
				this.dataObject[this.dataObject.openFunc]();
			}
		};
classProto['createDataObject'] = function ()
		{
			var config = this.getConfig(),
				engine = config.engine,
				dsnClass = 'wn'+engine.substr(0,1).toUpperCase()+engine.substr(1)+'DataObject';
			if (config.engine && this.c[dsnClass])
			{
				this.dataObject = new this.c[dsnClass]({ autoInit: false }, this.c);
				this.dataObject.setConfig(this.getConfig());
				this.dataObject.init(this);
			} else {
				this.getParent().e.log&&
					this.getParent().e.log('wnDbConnection.createDataObject: Invalid database engine configuration.');
			}
		};
classProto['cache'] = function (duration, dependency)
		{
			this.queryCacheDuration=duration;
			this.queryCacheDependency=dependency;
			return this;  
		};
classProto['connect'] = function (cb)
		{
			if (this.dataObject)
			{
				this.dataObject.once('connect',function () {
					cb&&cb();
				});
				this.dataObject[this.dataObject.openFunc].apply(this.dataObject,arguments);
			}
		};
classProto['close'] = function (cb)
		{
			if (this.dataObject)
			{
				this.dataObject.once('close',function () {
					cb&&cb();
				});
				this.dataObject._close.apply(this.dataObject,arguments);
			}
		};
classProto['exec'] = function (params,cb)
		{
			if (this.dataObject)
			{
				return this.dataObject._exec.apply(this.dataObject,arguments);
			}
		};
classProto['query'] = function (query,cb)
		{
			if (this.dataObject)
			{
				return this.dataObject._query.apply(this.dataObject,arguments);
			}
		};
classProto['getSchema'] = function ()
		{
			if(_schema!==null)
				return _schema;
			else
			{
				var engine=this.getConfig('engine'),
					schemaClass = this.getParent().c['wnDb'+engine.substr(0,1).toUpperCase()+engine.substr(1)+'Schema'];
				if(schemaClass!=undefined)
					return _schema=new schemaClass({}, this.getParent().c, this);
				else
					return (1==this.getParent().e.log
							&&this.getParent().e.log('wnDbConnection does not support reading schema for that database.'));
			}
		};
classProto['getQueryBuilder'] = function ()
		{
			return this.getSchema().getQueryBuilder();
		};
classProto['createQuery'] = function (query)
		{
			var queryClass = this.getParent().c.wnDbQuery;
			return new queryClass({}, this.c, this, query);
		};

// Declaring public vars
classProto['connecting'] = false;
classProto['failed'] = false;
classProto['connected'] = false;
classProto['connection'] = undefined;
classProto['alwaysConnect'] = false;
classProto['dataObject'] = undefined;
classProto['queryCacheDuration'] = undefined;
classProto['queryCacheDependency'] = undefined;
classProto['defaultEvents'] = { result: {}, ready: {}, connect: {}, close: {} };

// Constructor

})();

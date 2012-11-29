/**
 * Source of the wnModule class.
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
	 * Constructor
	 * @param object $parent parent object.
	 * @param object $config configuration object.
	 */	
	constructor: function (parent,modulePath,config,classes)
	{
		this.e.log&&this.e.log('Constructing new `'+this.className+'`...','system');

		this.setModulePath(modulePath || '');
		this.setParent(parent);

		this.preinit.apply(this,arguments); 

		this.importClasses();
		if (classes == undefined)
		{
			this.c = this.getComponent('classBuilder').classes;
		} else
		{
			Object.defineProperty(this,'c',{ value: classes, enumerable:false, writable: false });
		}
		
		var defaultConfig = sourcePath+'config/'+className+'Config.json';
		if (config)
			this.setConfig(config);
		if (fs.existsSync(defaultConfig))
			this.configureFromFile(defaultConfig);
		this.configureFromFile(this.modulePath + this.configFile);

		this.importCustomClasses();

		this.preloadComponents();
		this.preloadEvents();

		this.importScripts();

		this.getConfig('autoInit')!=false&&this.init.apply(this,arguments);
	},

	/**
	 * PRIVATE
	 */
	private:
	{
		_modules: {},
		_modulesConfig: {},
		_components: {},
		_componentsConfig: {},
		_customClasses: {},
		_modulesEvents: {},
	},

	/**
	 * Public Variables
	 */
	public:
	{

		/**
		 * @var string module configuration's file
		 */
		configFile: 'config.json',

		/**
		 * @var string module directory's path
		 */
		modulePath: '/',

		/**
		 * @var object preload components configuration
		 */	
		preload: {},

		/**
		 * @var array behaviors to attach
		 */
		behaviors: {}
	
	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Compile and store all classes to this module.
		 */
		importClasses: function ()
		{
			this.e.log&&this.e.log('Importing core classes...','system');
			var _c = {};
			for (c in global.coreClasses)
			{
				var module = {},
				 _class = global.coreClasses[c];
				eval(_class);
				_c[c] = module.exports;
			}
			var classBuilder = new wns.wnBuild(_c);
			this.setComponent('classBuilder',classBuilder);
			classBuilder.build();
		},
		
		/**
		 * Import custom classes (if exists) from the module's path.
		 */
		importCustomClasses: function ()
		{
			this.e.log&&this.e.log('Importing custom classes...','system');
			var classPath = this.getConfig('path') && this.getConfig('path').classes ? this.getConfig('path').classes : 'classes/',
				path = this.modulePath+classPath;
			if (fs.existsSync(path))
			{
				var classes = fs.readdirSync(path),
					_c = {};
				for (c in classes)
				{
					var module = {},
						className = classes[c].split('.')[0],
					 _class = fs.readFileSync(path+classes[c],'utf-8').toString();
					eval(_class);
					var cb = this.getComponent('classBuilder');
					cb.classes[className]=cb.recompile(className,module.exports);
					_customClasses[className]=cb.classes[className];
				}
			}
		},

		/**
		 * Reload all already imported custom classes.
		 */
		reloadCustomClasses: function ()
		{
			var classPath = this.getConfig('path') && this.getConfig('path').classes ? this.getConfig('path').classes : 'classes/',
				path = this.modulePath+classPath;

			for (c in _customClasses)
			{
				var module = {};
				 _class = fs.readFileSync(path+c+'.js','utf-8').toString();
				eval(_class);
				var cb = this.getComponent('classBuilder');
				cb.classes[className]=cb.recompile(c,module.exports);
			}
			this.e.log&&this.e.log('All custom components has been reloaded.','system');
		},

		/**
		 * Import scripts sources from the module`s directory
		 */
		importScripts: function ()
		{
			this.e.log&&this.e.log('Importing scripts...','system');
			var scriptPath = this.getConfig('path') && this.getConfig('path').scripts ? this.getConfig('path').scripts : 'scripts/',
				path = this.modulePath+scriptPath;
			if (fs.existsSync(path))
			{
				var scripts = fs.readdirSync(path);
				for (s in scripts)
				{
					var module = {},
						scriptName = scripts[s].split('.')[0],
						scriptClassName = 'wnScript'+scriptName.substr(0,1).toUpperCase()+scriptName.substr(1).toLowerCase(),
						scriptSet = {},
						 _script = fs.readFileSync(path+scripts[s],'utf-8').toString();
					eval(_script);
					var cb = this.getComponent('classBuilder');
					cb.classes[scriptClassName]=cb.recompile(scriptClassName,module.exports);
					scriptSet[scriptName] = {
						class: scriptClassName
					};
					this.setScripts(scriptSet);
				}
			}
		},

		/**
		 * Reload all already imported scripts
		 */
		reloadScripts: function ()
		{
			this.e.log&&this.e.log('Reloading all scripts...','system');
			var components = this.getComponents();
			this.importScripts();
			for (c in components)
			{
				if (c.indexOf('script-')!=-1)
				{
					this.stopScript(c.replace(/^script\-/gi,''));
					this.removeComponent(c);
					this.getComponent(c);
				}
			}
			this.e.log&&this.e.log('All scripts has been reloaded.','system');
		},

		/**
		 * Get a JSON configuration from file then send it to the `setConfig`
		 * @param string $file path to the file
		 * @return boolean success?
		 */
		configureFromFile: function (file)
		{
			var file = file+'';
			this.e.log&&this.e.log('Loading module configuration from file: '+file,'system');
			if (fs.statSync(file).isFile() && path.extname(file) == '.json')
			{
				var _data = (fs.readFileSync(file,'utf8').toString())
							.replace(/\\/g,function () { return "\\"+arguments[0]; })
							.replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g,'');
				if(_data = JSON.parse(_data))
				{
					this.setConfig(_data,true);
					return true;
				}
			}
			return false;
		
		},

		/**
		 * Set new properties to the component configuration.
		 *
		 * @param object $components application components(id=>component configuration or instances)
		 * Defaults to true, meaning the previously registered component configuration of the same ID
		 * will be merged with the new configuration. If false, the existing configuration will be replaced completely.
		 */
		setComponents: function (components)
		{
			for (c in components)
			{
				if (this.hasComponent(c))
				{
					Object.extend(true,components[c],this.getComponent(c));
				}
				_componentsConfig[c]=Object.extend(true,_componentsConfig[c] || {}, components[c]);
			}
		},

		/**
		 * Puts a component under the management of the module.
		 * The component will be initialized by calling the init() method.
		 * @param string $id component ID
		 * @param boolean if successful true, else false
		 */
		setComponent: function (id,component)
		{
			if (!component)
				delete _components[id];
			else
				_components[id]=component;
		},

		/**
		 * Retrieves the named component.
		 * The component has to be declared in the global components list. A new instance will be created
		 * when calling this method with the given ID for the first time.
		 * @param string $id component ID
		 * @return wnModule the module instance, false if the module is disabled or does not exist.
		 */
		getComponent: function (id)
		{
			if (_components[id] != undefined) 
				return _components[id];
			else if (this.hasComponent('classBuilder'))
			{
				var config = _componentsConfig[id] || {},
					className = config.class || id;
				if (this.getComponent('classBuilder').exists(className))
				{
					config.id = id;
					config.autoInit = (config.autoInit == true);
					var component = this.createComponent(className,config);
					(!config.autoInit)&&component.init(config);
					_components[id] = component;
					if (typeof config.alias == 'string')
						this[config.alias] = _components[id]
					return _components[id];
				} else
					return false;
			}
		},

		/**
		 * Retrieves the named component.
		 * The component has to be declared in the global components list. A new instance will be created
		 * when calling this method with the given ID for the first time.
		 * @param string $id component ID
		 * @return wnModule the module instance, false if the module is disabled or does not exist.
		 */
		removeComponent: function (id)
		{
			var id = id+'';
			if (_components[id]!=undefined)
			{
				if (_componentsConfig[id].alias)
					this[_componentsConfig[id].alias]=undefined;
				_components[id] = undefined;
			}
		},		

		/**
		 * Create a new instance of the component.
		 * @param string $className component class (case-sensitive)
		 * @param string $config application 
		 * @return wnModule the module instance, false if the module is disabled or does not exist.
		 */
		createComponent: function (className,config)
		{
			var component = new this.c[className](config,this.c);
			component.setParent(this);
			return component;
		},

		/**
		 * Returns a value indicating whether the specified component is installed.
		 * @param string $id the component ID
		 * @return boolean whether the specified component is installed.
		 */
		hasComponent: function (id)
		{
			return _components[id] != undefined;
		},

		/**
		 * Get all components from the list.
		 */
		getComponents: function ()
		{
			return _components;
		},

		/**
		 * Returns the list of components configuration
		 * @return object list of components configuration
		 */
		getComponentsConfig: function ()
		{
			return _componentsConfig;
		},

		/**
		 * Returns the component's configuration
		 * @return object component's configuration
		 */
		getComponentConfig: function (id)
		{
			return _componentsConfig[id];
		},

		/**
		 * Preload all required components
		 */
		preloadComponents: function ()
		{
			this.e.log&&this.e.log('Preloading components...','system');
			this.setConfig({components: this.preload});
			var preload = this.getConfig().components;
			if (preload != undefined)
			{
				this.setComponents(preload);
			}
		},

		/**
		 * Start all preloaded components
		 */
		startComponents: function ()
		{
			this.e.log&&this.e.log("Starting application's components...","system");
			var cps=this.getComponentsConfig();
			for (c in cps)
			{
				this.e.log&&this.e.log('- Starting component: '+c,'system');
				this.getComponent(c);
			}
		},

		/**
		 * Merge new configuration into the module configuration
		 *
		 * @param object $modules application modules(id=>module configuration or instances)
		 * Defaults to true, meaning the previously registered module configuration of the same ID
		 * will be merged with the new configuration. If false, the existing configuration will be replaced completely.
		 */
		setModules: function (modules)
		{
			for (m in modules)
			{
				if (this.hasModule(m))
				{
					Object.extend(true,modules[m],this.getModule(m));
				}
				_modulesConfig[m]=Object.extend(true,_modulesConfig[m] || {}, modules[m]);
			}
		},

		/**
		 * Retrieves the named application module.
		 * The module has to be declared in the global modules list. A new instance will be created
		 * when calling this method with the given ID for the first time.
		 * @param string $id application module ID (case-sensitive)
		 * @return wnModule the module instance, null if the module is disabled or does not exist.
		 */
		getModule: function (id)
		{
			if (_modules[id] != undefined) 
				return _modules[id];
			else if (this.hasComponent('classBuilder'))
			{
				var config = _modulesConfig[id] || {},
					modulePath = config.modulePath || id,
					className = config.class;
				if (fs.existsSync(modulePath) && className != undefined)
				{
					config.id = id;
					config.autoInit = !(config.autoInit == false);
					var module = this.createModule(className,modulePath,config)
					_modules[id] = module;
					this.attachModuleEvents(id);
					!(config.autoInit)&&module.init(modulePath,config);
					return _modules[id];
				} else
					return false;
			}
		},

		/**
		 * Returns a value indicating whether the specified module is installed.
		 * @param string $id the module ID
		 * @return boolean whether the specified module is installed.
		 */
		hasModule: function (id)
		{
				return _modules[id] != undefined;	
		},

		/**
		 * Create a new instance of module
		 * @param string $className component class (case-sensitive)
		 * @param string $config application 
		 * @return wnModule the module instance, false if the module is disabled or does not exist.
		 */
		createModule: function (className,modulePath,config)
		{
			return new this.c[className](this,modulePath,config);
		},

		/**
		 * Returns the list of instaled modules.
		 * @return object list of instaled modules.
		 */
		getModules: function ()
		{
			return _modules;
		},

		/**
		 * Returns the list of modules configuration
		 * @return object list of modules configuration
		 */
		getModulesConfig: function ()
		{
			return _modulesConfig;
		},

		/**
		 * Attach to this module all bubble-events from loaded modules
		 * This create a Bubble-Event to answer to each event that bubles from the module's modules.
		 * Also attach to all modules' events and handler to dispatch the event.
		 * @param string $id source module id
		 */
		attachModuleEvents: function (id) {
			var module = this.getModule(id),
				events;
			this.e.log&&this.e.log("Attaching module's events...",'system');
			if (module != undefined && (events=module.getEvents()) && !Object.isEmpty(events)) {
				for (e in events)
				{
					var evtConfig = {},
						eventName = 'module.'+e.split('-').pop(),
						evtCnf = events[e].getConfig(),
						event = events[e],
						eventClass;

					if (!this.hasEvent(eventName) && evtCnf.bubble && e.indexOf('event-module') == -1)
					{
						evtConfig[eventName]=Object.extend(true,evtConfig[eventName],evtCnf);
						evtConfig[eventName].listenEvent=null;
						evtConfig[eventName].handler=null;
						this.setEvents(evtConfig);
						this.getEvent(eventName);
					}

					if (this.hasEvent(eventName) && e.indexOf('event-module') == -1)
					{
						eventClass = this.getEvent(eventName);
						event.prependListener(function (e) {
							if (typeof e == 'object'
								&& e.stopPropagation == true)
										return false;
							eventClass.push.apply(eventClass,arguments);
						});
					}

				}
				this.attachEventsHandlers();
			}
		},

		/**
		 * Get the respective bubble event that answer to the respective module's event (if exists).
		 * @param string $id module's id
		 * @param string $eventName event's name
		 * @return wnEvent the bubble event of the module's event
		 */
		getModuleEvent: function (eventName) {
			this.getEvent('module.'+eventName);
		},

		/**
		 * Set new properties to the respective scripts
		 * @param OBJECT $scripts scripts configurations
		 */
		setScripts: function (scripts)
		{
			var script = {};
			for (s in scripts)
			{
				var ref=scripts[s],
					scriptName = s.substr(0,1).toUpperCase()+s.substr(1).toLowerCase(),
					s = 'script-'+s.replace('-','.');
				script[s]=ref;
				script[s].class='wnScript'+scriptName || 'wnScript';
				_componentsConfig[s]=Object.extend(true,_componentsConfig[s] || {}, script[s]);
			}
		},

		/**
		 * Get a script class.
		 * @param STRING $name scriptName
		 * @return wnScript instance
		 */
		getScript: function (name)
		{
			return this.getComponent('script-'+name);
		},

		/**
		 * Check if the script exists.
		 */
		hasScript: function (name)
		{
			return _components['script-'+name] != undefined;
		},

		/**
		 * Check if the script exists.
		 * @param $script string scriptname
		 */
		startScript: function (name)
		{
			var script;
			if (script = this.getScript(name))
			{
				script.start();
				return script;
			}
			return false;
		},

		/**
		 * Stop a script, if it exists.
		 * @param $name string script name
		 */
		stopScript: function (name)
		{
			var script;
			if (script = this.getScript(name))
			{
				script.stop();
				return script;
			}
			return false;
		},

		/**
		 * Returns the directory that contains the application modules.
		 * @return string the directory that contains the application modules.
		 */
		getModulePath: function ()
		{
			return this.modulePath;
		},

		/**
		 * Sets the directory that contains the application modules.
		 * @param string $value the directory that contains the application modules.
		 */
		setModulePath: function (value)
		{
			value=cwd+value;
			if (value != undefined && fs.statSync(value).isDirectory())
				this.modulePath = value;
		},
		
		/**
		 * This methods is called before the real initialization of the module
		 */
		preinit: function ()
		{

		}

	}

};
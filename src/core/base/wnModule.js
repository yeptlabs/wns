/**
 * @WNS - The NodeJS Middleware and Framework
 * 
 * @copyright: Copyright &copy; 2012- YEPT &reg;
 * @page: http://wns.yept.net/
 * @docs: http://wns.yept.net/docs/
 * @license: http://wns.yept.net/license/
 */

/**
 * No description yet.
 *
 * @author Pedro Nasser
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
	constructor: function (parent,config,modulePath,npmPath,classesSource)
	{
		this.e.log&&this.e.log('Constructing new `'+this.className+'`...','system');

		if (modulePath==undefined)
			modulePath = cwd;

		try {
			this.setParent(parent);
		} catch (e)
		{
			if (e)
				console.log(this);
		}

		this.setModulePath(path.resolve(path.resolve(parent.modulePath,modulePath))+'/');

		this.preinit.apply(this,arguments); 

		this.npmPath = npmPath || [];
		this.importClasses(classesSource);

		var defaultConfig = cwd+sourcePath+'config/'+className.split('_')[0]+'Config.json';
		if (fs.existsSync(defaultConfig))
			this.configureFromFile(defaultConfig);
		if (fs.existsSync(this.modulePath + this.configFile))
			this.configureFromFile(this.modulePath + this.configFile);
		if (config)
			this.setConfig(config);

		this.importFromConfig();

		Object.defineProperty(this,'c',{ value: this.getComponent('classBuilder').classes, enumerable:false, writable: false });
		this.c.module = self;

		this.preloadComponents();
		this.preloadEvents();


		this.setEvents({ 'ready': {} });
		var ready=this.getEvent('ready');
		ready.once(function (e) {
			e.stopPropagation=true;
			
			self.startComponents();
			self.prepareModels();
			self.prepareScripts();

			self.init.apply(self,arguments);
			self.run.apply(self,arguments);
			_initialized=true;
		});

		if (this.getConfig('autoInit')!=false)
			process.nextTick(function () {
				self.e.ready.apply(this,arguments);
			});
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
		_modulesEvents: {}
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
		behaviors: {},

		/**
		 * Default events.
		 */
		defaultEvents:
		{
			'loadModule': {},
			'loadComponent': {}
		},

		/**
		 * @var array node_modules directories
		 */
		npmPath: []
	
	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Compile module's classes.
		 * It gets classes source you give or from the core classes.
		 * @param $classesSource (optional)
		 * @return this
		 */
		importClasses: function (classesSource)
		{
			this.e.log&&this.e.log('Importing core classes...','system');

			var classesSource = classesSource||global.coreClasses;
			var classBuilder = new process.wns.wnBuild(classesSource,this);
			this.setComponent('classBuilder',classBuilder);
			classBuilder.build();

			// Make documentation
			for (c in classBuilder.classes)
				classBuilder.makeDoc(c);

			// Make test
			if (WNS_TEST)
				for (c in classBuilder.classes)
					classBuilder.makeTest(c);

			return this;
		},

		/**
		 * Import classes from the paths from configuration.
		 */
		importFromConfig: function ()
		{
			this.e.log&&this.e.log('Importing...','system');
			var importConfig = this.getConfig('import');
			for (i in importConfig)
			{
				var path = this.modulePath+importConfig[i];
				this.e.log&&this.e.log('Importing '+path+'...','system');
				
				if (fs.existsSync(path))
				{
					var classes = fs.readdirSync(path);
					for (c in classes)
					{
						if (classes[c].split('.').pop() != 'js')
							continue;
						var className = classes[c].split('.')[0];
						var classSource = fs.readFileSync(path+classes[c],'utf-8').toString();
						var cb = this.getComponent('classBuilder');
						cb.addSource(className,classSource);
						cb.classes[c]=cb.buildClass(className);
						cb.makeDoc(className);
					}
				}
			}
		},

		/**
		 * Prepare all models
		 */
		prepareModels: function ()
		{
			for (c in this.c)
			{
				if (this.c[c].build && this.c[c].build.extend && this.c[c].build.extend.indexOf('wnActiveRecord')!=-1)
				{
					this.prepareModel(c);
				}
			}
		},

		/**
		 * Prepare the model
		 * @param $model 
		 */
		prepareModel: function (model) {
			var c = this.c,
				s = this;
			this.m[model]=function () {
				var modelClass = c[model];
				return new modelClass({ autoInit: true }, s.c, s, s.db);
			};
		},

		/**
		 * Prepare all scripts
		 */
		prepareScripts: function ()
		{
			for (c in this.c)
			{
				if (this.c[c].build && this.c[c].build.extend && this.c[c].build.extend.indexOf('wnScript')!=-1)
				{
					this.prepareScript(c);
				}
			}
		},

		/**
		 * Prepare all scripts
		 */
		prepareScript: function (s)
		{
			var components = {};
			components['script-'+s]={
				class: s,
				autoInit: false,
				seeParent: true
			};
			this.setComponents(components);
			this.e.log&this.e.log('- Starting script: '+s,'system');
			this.getComponent('script-'+s);
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
		 * @param object $components components(id=>component configuration or instances)
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
			return this;
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
			return this;
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
					if (config.setParent)
						component.setParent(this);
					self.e.loadComponent(e,id,component);
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
			return this;
		},		

		/**
		 * Create a new instance of the component.
		 * @param string $className component class (case-sensitive)
		 * @param string $config component custom config 
		 * @return wnModule the module instance, false if the module is disabled or does not exist.
		 */
		createComponent: function (className,config)
		{
			var component = this.createClass(className,config);
			if (component)
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
			this.setConfig({components: this.preload});
			var preload = this.getConfig().components;
			if (preload != undefined)
			{
				this.e.log&&this.e.log('Preloading components...','system');
				this.setComponents(preload);
			}
			return this;
		},

		/**
		 * Start all preloaded components
		 */
		startComponents: function ()
		{
			var cps=this.getComponentsConfig();
			for (c in cps)
			{
				var cpnt=this.getComponent(c);
				if (cpnt)
					this.e.log&&this.e.log('- Started component: '+cps[c].class+(cpnt.getConfig('alias')?' (as '+cpnt.getConfig('alias')+')':''),'system');
			}
			return this;
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
			return this;
		},

		/**
		 * Retrieves the named application module.
		 * The module has to be declared in the global modules list. A new instance will be created
		 * when calling this method with the given ID for the first time.
		 * @param string $id application module ID (case-sensitive)
		 * @param function $onLoad function called when app loaded
		 * @return wnModule the module instance, null if the module is disabled or does not exist.
		 */
		getModule: function (id,onLoad)
		{
			if (_modules[id] != undefined) 
				return _modules[id];
			else if (this.hasComponent('classBuilder'))
			{
				try {
					var config = _modulesConfig[id] || {},
						modulePath = config.modulePath || id,
						className = config.class;
					if (fs.existsSync(this.modulePath+modulePath) && className != undefined)
					{
						config.id = id;
						config.autoInit = !(config.autoInit == false);
						var npmPath = [];
							for (n in self.npmPath)
								npmPath.push(self.npmPath[n]);
						npmPath.unshift(this.modulePath+modulePath+'/node_modules/');
						var module = this.createModule(className,config,modulePath,npmPath);
						if (module)
						{
							_modules[id] = module;
							this.attachModuleEvents(id);
							onLoad&&onLoad(module);
							self.e.loadModule(id,module);
							process.nextTick(function () {
								module.e.ready(modulePath,config);
							});
							return _modules[id];
						}
						return false;
					} else
						return false;
				} catch (e)
				{
					this.e.log&&
						this.e.log('wnModule.getModule: Error at loading `'+id+'`');
					this.e.exception&&
						this.e.exception(e);
				}
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
		 * Create a new instance of a module.
		 * @param string $className
		 * @param string $modulePath
		 * @param object $config
		 * @param string $npmPath
		 * @return object
		 */
		createModule: function (className,config,modulePath,npmPath)
		{
			var module = this.createClass(className,config,modulePath,npmPath);
			return module;
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
			return this;
		},

		/**
		 * Get the respective bubble event that answer to the respective module's event (if exists).
		 * @param string $id module's id
		 * @param string $eventName event's name
		 * @return wnEvent the bubble event of the module's event
		 */
		getModuleEvent: function (eventName) {
			return this.getEvent('module.'+eventName);
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
			return this;
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
			if (value != undefined && fs.statSync(value).isDirectory())
			{
				this.modulePath = value;
				this.setConfig('modulePath',value);
			}
			return this;
		},

		/**
		 * Start syncronization server
		 */
		syncServer: function ()
		{
			this.setComponents({
				'syncServer': {
					port: 22011,
					class: 'wnSync'
				}
			});
			var syncServer = this.getComponent('syncServer');
			syncServer.setParent(this);
			syncServer.init();
			return syncServer;
		},

		/**
		 * Check if the package exists and its required version
		 */
		checkPackage: function ()
		{
			return true;
			// http.get('http://wns.yept.net/packages/search/');
		},

		/**
		 * Download a new WNS package into the module's directory
		 * then reconfigure the module's config.json file.
		 */
		installPackage: function (packageName,cb)
		{
			if (!packageName || !this.checkPackage(packageName))
				cb&&cb(false);

			self.e.log('Downloading `%d` package...',packageName);
			var file = fs.createWriteStream(this.modulePath+'/.tmp/'+packageName+'.tar.gz');
			if (!fs.existsSync(this.modulePath+'/.tmp'))
				fs.mkdirSync(this.modulePath+'/.tmp');
			var req = http.request({
				'method': 'GET',
				'host': process.wns.info.wnspm.url,
				'path': '/package/download'
			}, function(response) {
				cb&&cb(true)
			  	response.pipe(file);
			});
			req.on('error',function () {
				cb&&cb(false)
			})
			req.end();			
		},

		/**
		 * Removes a installed package.
		 */
		removePackage: function ()
		{

		},
		
		/**
		 * This method is called before the real initialization of the module
		 */
		preinit: function ()
		{
			return this;
		},

		/**
		 * This method runs after the module's initialization.
		 */
		run: function ()
		{
			return this;
		}

	}

};

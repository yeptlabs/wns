/**
 * Source of the wnServer class.
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
	extend: ['wnModule'],

	/**
	 * PRIVATE
	 */
	private:
	{
		_app: {}
	},

	/**
	 * Public Variables
	 */
	public:
	{
		defaultEvents: {
			'loadModule': {},
			'loadComponent': {},
			'loadApplication': {}
		}
	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 */	
		init: function ()
		{
			if (this.getConfig('appDirectory')!=undefined && !fs.existsSync(this.modulePath+this.getConfig('appDirectory')))
			{
				this.e.log("Creating server's applications directory.");
				fs.mkdirSync(this.modulePath+this.getConfig('appDirectory'));
			}

			this.loadApplications();
		},

		/**
		 * Set the server ID
		 * @param NUMBER $id server id
		 */
		setServerId: function (id) {
			this.setConfig({ serverID: new Number(id) });
			return this;
		},

		/**
		 * Get server ID
		 * @return NUMBER server id
		 */
		getServerId: function () {
			return this.getConfig('serverID');
		},

		/**
		 * Set new properties to the respective applications
		 * @param OBJECT $applications applications configurations
		 */
		setApplications: function (applications)
		{
			var modules = {};
			for (a in applications)
			{
				var ref=applications[a],
					appName = a,
					a = 'app-'+a;
				modules[a]=ref;
				modules[a].modulePath=this.getConfig('appDirectory')+appName+'/';
				modules[a].appName=appName;
				modules[a].class='wnApp';
				this.buildApplication(appName,modules[a].modulePath);
				var realModulePath = this.modulePath+modules[a].modulePath;
				if (fs.existsSync(realModulePath+appName+'.js'))
				{
					modules[a].class='wnApp_'+appName;
					var module = {},
						className = modules[a].class,
					 _class = fs.readFileSync(realModulePath+appName+'.js','utf-8').toString();
					eval(_class);
					var cb = this.getComponent('classBuilder'),
						appClass = cb.classesSource['wnApp'];
					appClass = Object.extend(true,{},appClass,module.exports);
					cb.classesSource[className] = appClass;
					cb.classes[className]=cb.buildClass(className);
				}
				modules[a].autoInit=false;
			}
			this.setModules(modules);
			return this;
		},

		/**
		 * Build an application directory
		 */
		buildApplication: function (appName, appPath)
		{
			if (!fs.existsSync(this.modulePath+appPath))
			{
				this.e.log('- Creating new application: '+appName+' on `'+appPath+'`');
				wrench.copyDirSyncRecursive(cwd+sourcePath+'app/',this.modulePath+appPath);
				fs.renameSync(this.modulePath+appPath+'app.js', this.modulePath+appPath+appName+'.js');
	
				var defaultPackage = fs.readFileSync(cwd+sourcePath+'default-package.json').toString('utf8');
				defaultPackage = defaultPackage.replace(/\{moduleName\}/g,appName);
				fs.writeFileSync(this.modulePath+appPath+'package.json',defaultPackage);

				var config = this.getFile(appPath+'config.json');
				config = config;
				fs.writeFileSync(this.modulePath+appPath+'config.json',config,'utf8');
			}
			return this;
		},

		/**
		 * Puts a application under the management of this module.
		 * The application will be initialized by calling the init() method.
		 * @param STRING $id application ID
		 * @param OBJECT $application application object.
		 * @param BOOLEAN if successful true, else false
		 */
		setApplication: function (id,application)
		{
			if (this.hasModule('app-'+id) && application == null)
				delete this.getModule('app-'+id);
			else
				this.setModule('app-'+id,application);
			return this;
		},
		/**
		 * Retrieves the named application.
		 * The component has to be declared in the global components list. A new instance will be created
		 * when calling this method with the given ID for the first time.
		 * @param STRING $id component ID
		 * @return wnModule the module instance, false if the module is disabled or does not exist.
		 */
		getApplication: function (id)
		{
			var app = this.getModule('app-'+id, function (app) {
				self.e.loadApplication(app);
			});
			if (app)
			{
				_app[id]=app;
				return app;
			} else
				return false;
		},

		/**
		 * Create a new instance of application.
		 * @param STRING $config application 
		 * @return wnModule the module instance, false if the module is disabled or does not exist.
		 */
		createApplication: function (id)
		{
			return this.getModule('app-'+id);
		},

		/**
		 * Returns a value indicating whether the specified application is installed.
		 * @param STRING $id the application ID
		 * @return BOOLEAN whether the specified application is installed.
		 */
		hasApplication: function (id)
		{
			return this.hasModule('app-'+id);
		},

		/**
		 * Get all applications from the list.
		 */
		getApplications: function ()
		{
			return _app;
		},

		/**
		 * Preload all required applications
		 */
		loadApplications: function ()
		{
			var preload = this.getConfig().app,
				parent = this.getParent();
			if (preload != undefined)
			{
				this.setApplications(preload);
			}

			for (p in preload)
			{
				this.e.log('Loading application: ' + p);
				a=this.getApplication(p);
			}

			return this;
		},

		/**
		 * Log filter
		 * @param $e eventObject object of this event emition
		 * @param $data log data
		 * @param $zone log zone
		 */
		logFilter: function (e,data,zone)
		{
			var event = this.getEvent('log'),
				config = event.getConfig();
			if (this.config.log[log.zone] === true)
				return true;
			return false;
		},

		/**
		 * Local Log Handler
		 * @param $e eventObject object of this event emition
		 * @param $arg1 mixed argument
		 * @param $arg2 mixed argument
		 * ...
 		 * @param $argN mixed argument
		 */
		logHandler: function (e,data,zone)
		{
		},

		/**
		 * Exception handler
		 * @param $e eventObject object of this event emition
		 * @param $arg1 mixed argument
		 * @param $arg2 mixed argument
		 * ...
 		 * @param $argN mixed argument
		 */
		exceptionHandler: function (e,err)
		{
			if (typeof err == 'string' || typeof err != 'object' || err.stack == undefined)
				err = new Error(err);

			e.owner.e.log('ERROR: '+err.message,'exception');

			var _stack = err.stack.split("\n");
			_stack.shift();
			for (s in _stack)
				e.owner.e.log(_stack[s],'stack');
		}

	}

};
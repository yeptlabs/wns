 /**
 * WNS Middleware
 * @copyright &copy; 2012- Pedro Nasser &reg;
 * @license: MIT
 * @see http://github.com/yeptlabs/wns
 * @author Pedro Nasser
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
			var appDir = this.getConfig('appDirectory');

			if (!appDir)
				return false;

			for (a in applications)
			{
				var ref=applications[a];
				var appName = a;
				var a = 'app-'+a;

				modules[a]=ref;
				modules[a].modulePath=appDir+appName+'/';

				modules[a].appName=appName;
				modules[a].class='wnApp';
				var realModulePath = this.modulePath+modules[a].modulePath;
				if (fs.existsSync(realModulePath+appName+'.js'))
				{
					modules[a].class='wnApp_'+appName;
					var className = modules[a].class;
					var cb = this.getComponent('classBuilder');
					var appClass = cb.classesPath['wnApp'];
					if (typeof appClass == 'string')
						cb.addSource(className,appClass,true);
					else
						for (a in appClass)
							cb.addSource(className,appClass[a],true);
					cb.addSource(className,realModulePath+appName+'.js');
					cb.classes[className]=self.c[className]=cb.buildClass(className);
				}
				modules[a].autoInit=false;
			}
			this.setModules(modules);
			return this;
		},

		/**
		 * Create applications directory
		 */
		createAppDirectory: function ()
		{
			var appDir = this.getConfig('appDirectory');

			if (!appDir)
				return false;

			if (!fs.existsSync(this.modulePath+appDir))
			{
				this.e.log("Created a directory for applications: "+appDir);
				this.e.log("To create a new application, go inside `"+appDir+"`, then type:");
				this.e.log("$ wns --newapp [application name]");
				fs.mkdirSync(this.modulePath+appDir);
			}
		},

		/**
		 * Build an application directory
		 */
		buildApplication: function (appName)
		{
			var appDir = this.getConfig('appDirectory');

			if (!_.isString(appName))
				return false;

			if (!appDir)
			{
				console.log('  To create applications, you need do define an `appDirectory` on `config.json`');
				return false; 
			}

			this.createAppDirectory();

			try {
				var appPath = appDir+appName+'/';

				if (!fs.existsSync(this.modulePath+appPath))
				{
					console.log('  Creating new application `'+appName+'` in `'+appDir+'`');
					wrench.copyDirSyncRecursive(cwd+sourcePath+'app/',this.modulePath+appPath);
					fs.renameSync(this.modulePath+appPath+'app.js', this.modulePath+appPath+appName+'.js');
		
					var defaultPackage = fs.readFileSync(cwd+sourcePath+'app/package.json').toString('utf8');
					defaultPackage = defaultPackage.replace(/\{moduleName\}/g,appName);
					fs.writeFileSync(this.modulePath+appPath+'package.json',defaultPackage);

					var config = this.getFile(appPath+'config.json');
					config = config;
					fs.writeFileSync(this.modulePath+appPath+'config.json',config,'utf8');

					console.log('');
					console.log('  Application `'+appName+'` has been created');
					console.log('  Before run it, type `npm install` inside folder `'+appPath+'`');
					self.buildedApps++;
					return true;
				}
			} catch (e) {
				throw e;
				return false;				
			}

			return false;
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
			if (!_.isString(id) || !_.isObject(application))
				return false;

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
			var parent = this.getParent();
			var appDir = this.getConfig('appDirectory');

			if (!appDir)
				return false;

			this.createAppDirectory();

			if (!fs.existsSync(this.modulePath+appDir))
				return false;

			var appDirList = fs.readdirSync(this.modulePath+appDir);
			var apps = {};

			for (a in appDirList)
			{
				var appPath = appDirList[a]+'/';
				apps[appDirList[a]]={ appPath: appPath }
			}

			this.setApplications(apps);

			for (a in apps)
			{
				this.e.log('Loading application: ' + a);
				this.getApplication(a);
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
			if (_.isUndefined(data) || !_.isObject(e))
				return false;

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
			if (!_.isObject(e) || typeof err == 'string' || typeof err != 'object' || err.stack == undefined)
				return false;

			e.owner.e.log('ERROR: '+err.message,'exception');

			var _stack = err.stack.split("\n");
			_stack.shift();
			for (s in _stack)
				e.owner.e.log(_stack[s],'stack');
		}

	}

};
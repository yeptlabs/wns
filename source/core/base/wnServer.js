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
			
			this.e.log('Starting `wnHttp`...');
			this.http = this.getComponent('http');

			if (this.http!=false)
			{
				this.http.setConfig({ app: this.getApplications() })
				this.e.log('Listening HTTP server...');
				this.http.listen();
			} else
				this.e.log('An error has occurrend while loading http component.');

			if (!fs.existsSync(this.getConfig('appDirectory')))
			{
				this.e.log("Creating server's applications directory.");
				fs.mkdir(this.getConfig('appDirectory'),755);
			}
		},

		/**
		 * Set the server ID
		 * @param NUMBER $id server id
		 */
		setServerId: function (id) {
			this.setConfig({ serverID: new Number(id) });
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
				modules[a].modulePath=this.getConfig('appDirectory')+(modules[a].appPath || modules[a].modulePath);
				modules[a].appName=appName;
				modules[a].class='wnApp';
				modules[a].autoInit=false;
				this.buildApplication(appName,modules[a].modulePath);
			}
			this.setModules(modules);
		},

		/**
		 * Build an application directory
		 */
		buildApplication: function (appName, appPath)
		{
			if (fs.existsSync(appPath))
				return false;
			wrench.copyDirSyncRecursive(cwd+sourcePath+'app/',appPath);
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
			var app = this.getModule('app-'+id);
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
			this.e.log('Loading applications:');
			if (preload != undefined)
			{
				this.setApplications(preload);
			}

			for (p in preload)
			{
				this.e.log('- Building new application: ' + p);
				a=this.getApplication(p);
			}
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
			e.owner.e.log('ERROR: '+err.message,'exception');

			var _stack = err.stack.split("\n");
			_stack.shift();
			for (s in _stack)
				e.owner.e.log(_stack[s],'stack');
		}

	}

};
/**
 * Source of the wnConsole class.
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
		_server: {},
		_serverModules: []
	},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var object console's configuration file name
		 */
		configFile: 'console.json',

		/**
		 * @var object console's servers list
		 */
		activeServer: -1,

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'loadModule': {},
			'loadComponent': {},
			'loadServer': {},
			'error': {},
			'log': {
				handler: 'logHandler'
			}
		}

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 * @param MIXED $args
		 */	
		init: function ()
		{
			this.setConfig({ id: '*' });
			this.listenInput();
			process.on('uncaughtException', function (e) { self.e.exception(e); });
			this.e.log('wnConsole initialized.');
		},
		
		/**
		 * Listen to the console input
		 */
		listenInput: function () {
			process.stdin.resume();
			process.stdin.setEncoding('utf8');
			process.stdin.on('data', function (chunk) {
				var ctx = self.getServer(self.activeServer),
					cmd = chunk.substr(0,chunk.length-1);
				if (cmd.substr(0,2) == '..')
				{
					ctx = false; 
					cmd = 'this.selectServer(-1)';
				}
				self.exec(cmd,ctx?ctx:undefined);
				return false;
			});
		},

		/**
		 * Build a new server structure on the given directory
		 * @param string $serverPath directory of the new server
		 * @return boolean successfully builded?
		 */
		buildServer: function (serverPath)
		{
			var _sourcePath = cwd+sourcePath,
				relativeSourcePath = path.relative(serverPath,_sourcePath)+'/',
				relativeServerPath = path.relative(cwd,serverPath);

			console.log("[*] Building new wnServer on `"+serverPath+"`");

			if (!fs.existsSync(serverPath))
				fs.mkdirSync(serverPath);

			console.log("[*] - Creating new `package.js` file.");
			var defaultPackage = fs.readFileSync(_sourcePath+'/default-package.json').toString('utf8');
			defaultPackage = (defaultPackage+'').replace(/\{moduleName\}/g, 'server-'+serverPath.substr(0,serverPath.length-1).split('/').pop().replace(/\s/g,'-'));
			fs.writeFileSync(serverPath+'/package.json',defaultPackage);

			console.log("[*] - Creating new `config.json` file.");
			fs.writeFileSync(serverPath+'/config.json',
				fs.readFileSync(_sourcePath+'/default-config.json')
			);

			console.log("[*] - Creating new `index.js` file.");
			var defaultIndex = fs.readFileSync(_sourcePath+'/default-index.js').toString('utf8');
			defaultIndex = defaultIndex.replace(/\{sourcePath\}/g,'./'+relativeSourcePath.replace(/\\/g,'/'));
			defaultIndex = defaultIndex.replace(/\{serverPath\}/g,'./'+relativeServerPath.replace(/\\/g,'/'));
			fs.writeFileSync(serverPath+'/index.js',defaultIndex);

			console.log('[*] New wnServer created.');

			return true;
		},

		/**
		 * Set new properties to the respective servers
		 * @param OBJECT $servers servers configurations
		 */
		setServers: function (servers)
		{
			var modules = {};
			for (s in servers)
			{
				var ref=servers[s],
					s = 'server-'+s;
				modules[s]=ref;
				modules[s].modulePath=(modules[s].serverPath || modules[s].modulePath);
				modules[s].class='wnServer';
				modules[s].autoInit = false;
			}
			this.setModules(modules);
		},

		/**
		 * Puts a server under the management of this module.
		 * The server will be initialized by calling the init() method.
		 * @param STRING $id server ID
		 * @param OBJECT $server server object.
		 * @param BOOLEAN if successful true, else false
		 */
		setServer: function (id,server)
		{
			if (this.hasModule('server-'+id) && server == null)
				delete this.getModule('server-'+id);
			else
				this.setModule('server-'+id,server);
		},

		/**
		 * Retrieves the named server.
		 * The component has to be declared in the global components list. A new instance will be created
		 * when calling this method with the given ID for the first time.
		 * @param STRING $id component ID
		 * @return wnModule the module instance, false if the module is disabled or does not exist.
		 */
		getServer: function (id)
		{
			return this.getModule('server-'+id);
		},

		/**
		 * Create a new instance of server.
		 * @param STRING $id server ID
		 * @return wnModule the module instance, false if the module is disabled or does not exist.
		 */
		createServer: function (id)
		{
			var m = this.getModule('server-'+id, function (server) {
				self.e.loadServer(server);
			});
			_serverModules.push(m);
			return m;
		},

		/**
		 * Returns a value indicating whether the specified server is installed.
		 * @param STRING $id the server ID
		 * @return BOOLEAN whether the specified server is installed.
		 */
		hasServer: function (id)
		{
			return this.hasModule('server-'+id);
		},

		/**
		 * Get all servers from the list.
		 */
		getServers: function ()
		{
			return _server;
		},

		/**
		 * Get all loaded server modules.
		 */
		getServerModules: function ()
		{
			return _serverModules;
		},

		/**
		 * Create a new wnServer and puts under the management of this console
		 * @param $serverPath server module path
		 * @param $relativeMainPath boolean relative to mainPath
		 */ 
		addServer: function (serverPath,relativeMainPath)
		{
			if (relativeMainPath)
				serverPath = path.relative(cwd,path.resolve(mainPath,serverPath));

			var serverConfig = {},
				consoleID = this.getServerModules().length+1;
				serverConfig[consoleID] = { 'modulePath': serverPath, 'serverID': consoleID };

			this.e.log('Building wnServer from `'+serverPath+'`');

			if (!fs.existsSync(this.modulePath+serverPath))
			{
				this.e.log('Failed to load wnServer from path.');
				return false;
			}
		
			this.setServers(serverConfig);
			var server = this.createServer(consoleID);

			this.selectServer(consoleID);

			return server;
		},

		/**
		 * Define the server as the active on the console.
		 * @param $server wnServer instance
		 */
		selectServer: function (id)
		{
			if (this.hasServer(id))
			{		
				this.e.log('Console active in SERVER#' + id);
				this.activeServer = id;
			} else {
				this.e.log('Console active in NONE');
				this.activeServer = -1;
			}
		},

		/**
		 * Log.
		 * @param $e eventObject object of this event emition
		 * @param $arg1 mixed argument
		 * @param $arg2 mixed argument
		 * ...
 		 * @param $argN mixed argument
		 */
		logHandler: function (e,data) {
			var prefix = '', sourceName = e.owner.getConfig('id');
			if (sourceName) prefix = '['+sourceName+']'+' ';
			(!WNS_QUIET_MODE)&&console.log(prefix+''+data);
		},

		/**
		 * Log filter
		 * @param $data log data
		 * @param $zone log zone
		 */
		logFilter: function (e,data) {
			if (server.getConfig('consoleID') == this.activeServer)
				return true;
			return false;
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
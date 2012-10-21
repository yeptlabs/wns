/**
 * Source of the wnConsole class.
 * 
 * @author: Pedro Nasser
 * @link: http://pedroncs.com/projects/webnode/
 * @license: http://pedroncs.com/projects/webnode/#license
 * @copyright: Copyright &copy; 2012 WebNode Server
 */

/**
 * {full_description}
 *
 * @author Pedro Nasser
 * @version $Id$
 * @package system.base
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
		_serverCount: 0

	},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var object console's servers list
		 */
		activeServer: -1,

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
			this.e.log('Initializing wnConsole...');
			this.listenInput();
			process.on('uncaughtException', function (e) { console.log(e.stack); });
		},
		
		/**
		 * Listen to the console input
		 */
		listenInput: function () {
			process.stdin.resume();
			process.stdin.setEncoding('utf8');
			process.stdin.on('data', function (chunk) {
			  this.exec(chunk.substr(0,chunk.length-1).split(' '));
			}.bind(this));
		},
		
		/**
		 * Executes the console command.
		 */
		exec: function (args) {
			console.log(args);
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
			var server = this.getModule('server-'+id);
			_server[id]=server;
			return server;
		},

		/**
		 * Create a new instance of server.
		 * @param STRING $id server ID
		 * @return wnModule the module instance, false if the module is disabled or does not exist.
		 */
		createServer: function (id)
		{
			return this.getModule('server-'+id);
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
		 * Create a new wnServer and puts under the management of this console
		 * @param $serverPath server module path
		 */ 
		addServer: function (serverPath)
		{
			_serverCount++;
			var serverConfig = {},
				consoleID = _serverCount;
				serverConfig[consoleID] = { 'modulePath': serverPath, 'serverID': consoleID };
			this.e.log('Building new wnServer from `'+serverPath+'`');
		
			this.setServers(serverConfig);
			var server = this.createServer(consoleID);

			this.selectServer(consoleID);
		},

		/**
		 * Define the server as the active on the console.
		 * @param $server wnServer instance
		 */
		selectServer: function (id)
		{
			if (this.hasServer(id))
			{		
				this.e.log('Console active in wnServer: SERVER#' + id);
				this.activeServer = id;
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
			console.log(prefix+''+data);
			e.stopPropagation = true;
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
			e.owner.e.log('ERROR: '+err.message,'exception');

			var _stack = err.stack.split("\n");
			_stack.shift();
			for (s in _stack)
				e.owner.e.log(_stack[s],'stack');
		}

	}

};
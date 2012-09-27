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
	extend: ['wnService'],

	/**
	 * Constructor
	 * TODO {description}
	 * @param VARTYPE $args TODO
	 */	
	constructor: function (args) {

		// Listen to the stdin.
		process.stdin.resume();
		process.stdin.setEncoding('utf8');

		process.stdin.on('data', function (chunk) {

		  // Execute the console.
		  this.exec(chunk.substr(0,chunk.length-1).split(' '));

		}.bind(this));
 
 		process.on('uncaughtException', function (e) { console.log(e.stack); });

	},

	/**
	 * PRIVATE
	 *
	 * Only get and set by their respectives get and set private functions.
	 *
	 * Example:
	 * If has a property named $id.
	 * It's getter function will be `this.getId`, and it's setter `this.setId`.
	 * To define a PRIVILEGED function you put a underscore before the name.
	 */
	private: {
	},

	/**
	 * Public Variables
	 * Can be accessed and defined directly.
	 */
	public: {

		/**
		 * @var object the configuration of the server.
		 */
		config: {},

		/**
		 * @var object console's servers list
		 */
		servers: [],

		/**
		 * @var object console's servers list
		 */
		activeServer: -1

	},

	/**
	 * Methods
	 */
	methods: {
		
		/**
		 * Executes the console command.
		 */
		exec: function (args) {
			console.log(args);
		},

		/**
		 * Pushes a data to the console.
		 * @param $data mixed data to send to the console
		 * @param $server wnServer owner of the message
		 */
		push: function (data,server) {
			if (server != undefined && this.activeServer!=-1) {
				if (server.consoleID == this.activeServer)
					console.log(data);
			}
			else
				console.log(data);
		},

		/**
		 * Define the new wnLog event callback.
		 * Push the new server to the wnConsole servers list.
		 * @param $server wnServer instance
		 */ 
		addServer: function (server) {

			// If server has not been loaded then return false.
			if (!server.loaded) return false;

			var _console = this;
		
			// Create a wnLogEvent to the server.
			server.events.wnLogEvent = new server.c.wnLogEvent(server, function (e) {
				var _server = server.logHandler(e.data,e.zone);
				if (_server) {
					_console.push(e.data,server);
				}			
			});
			server.c.wnLog=server.classBuild.recompile('wnLog', { public: { handler: server.events.wnLogEvent } });

			// Get consoleID.
			var consoleID = this.servers.length;
			server.consoleID = consoleID;

			// Push the new server to the list.
			this.servers.push(server);

			// Selecting server as console active.
			this.selectServer(server);

		},

		/**
		 * Define the server as the active on the console.
		 * @param $server wnServer instance
		 */
		selectServer: function (server) {
		
			// Define new server as the console active.
			this.push('Console active in wnServer: SERVER-' + server.consoleID);

			// Define new active server..
			this.activeServer = server.consoleID;

		}

	}

};
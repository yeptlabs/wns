/**
 * Source of the wnServer class.
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
	 * @param STRING $configFile TODO
	 */	
	constructor: function (configFile) {

		// If dont have config information, then uses the default
		this.configFile = configFile || './config.json';

		 wns.log.push('[*] Building new `wnServer` from `'+this.configFile+'`');

		 // Importing core classes.
		 wns.log.push('[*] Copying core classes sources to the server.');
		 var _c = {};
		 for (c in coreClasses) {
			 var module = {},
				 _class = coreClasses[c];
			 eval(_class);
			 _c[c] = module.exports;
		 }
		wns.log.push('[*] Compiling core classes instance...');
		this.classBuild = new wns.wnBuild(_c);
		var compiled = this.classBuild.build();
		for (c in compiled) {
			this.c[c] = compiled[c].loaded == true ? compiled[c] : this.c[c];
		}

		// Load default wnServer configuration from the source.
		wns.log.push('[*] Loading default server config... [/'+sourcePath+'config/wnServerConfig.json]');
		this.config=new this.c.wnConfig(cwd+sourcePath+'config/wnServerConfig.json');

		// Load custom wnServer configuration on the root directory (if exists)
		if (fs.existsSync(cwd+this.configFile)) {
			wns.log.push('[*] Loading custom server config... [/'+this.configFile+']');
			this.config.loadFromFile(cwd+configFile);
		} else {
			wns.log.push('[*] Invalid custom server configuration.');
			// Define that the server has not been loaded.
			this.loaded = false;
			return false;
		}

		/* EVENTS */
		wns.log.push('[*] Setting up events...');

		// Setting up exception handler to this application.
		this.events.wnExceptionEvent = new this.c.wnExceptionEvent(this,this.exceptionHandler);
		this.c.wnException=this.classBuild.recompile('wnException', { public: { handler: this.events.wnExceptionEvent } });

		// Setting up log event.
		this.c.wnLog=this.classBuild.recompile('wnLog', { public: { handler: function () {} } });
		
		// Loading applications...
		this.app={};
		wns.log.push('[*] Loading applications from config:');
		var web=this;
		for (app in this.config.app) {

			// Creates a new application
			this.app[app] = new this.c.wnApp(app,cwd+'app/'+this.config.app[app]);

			// Create a wnLog to the application.
			this.app[app].events.wnLogEvent=new this.app[app].c.wnLogEvent(this.app[app],function (e) {
				var _app=web.app[app].logHandler(e.data,e.zone);
				if (_app) {
					new web.c.wnLog(_app.data,_app.zone);
				}
			});
			// Recompile the wnLog prototype to add the handler..
			this.app[app].c.wnLog=this.app[app].classBuild.recompile('wnLog', { public: { handler: this.app[app].events.wnLogEvent } });

		}
		
		/* HTTP Server */

		// Creates a new http server..
		wns.log.push('[*] Creating HTTP server...');
		this.http = new this.c.wnHttp(this);
		this.http.super_=this;

		try	{
			
			// Start listening the http server
			this.http.listen();
			wns.log.push('[*] Listening HTTP server at '+this.config.http.listen[1]+':'+this.config.http.listen[0]);

		}
		catch (e) {

			new this.c.wnException(e);

		}

		// Define that the server has been loaded.
		this.loaded = true;

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
	private: {},

	/**
	 * Public Variables
	 * Can be accessed and defined directly.
	 */
	public: {

		/**
		 * @var OBJECT the configuration of the server.
		 */
		config: {},

		/**
		 * @var OBJECT the object with all loaded apps
		 */
		app: {},

		/**
		 * @var OBJECT all events handlers.
		 */
		events: {},

		/**
		 * @var STRING configuration file
		 */
		configFile: '',

		/**
		 * @var OBJECT all loaded classes
		 */
		c: {}

	},

	/**
	 * Methods
	 */
	methods: {
	
		/**
		 * Log handler
		 * @param $data log data
		 * @param $zone log zone
		 */
		 logHandler: function (data,zone) {
				var _log = { data: '[*] ' + data, zone: (zone || 'trace') };
				if (this.config.log != undefined) {
					if (this.config.log[zone] === true) return _log;
				} else return _log;
				return false;
		 },

		/**
		 * Exception handler
		 * @param $e wnException instance
		 */
		exceptionHandler: function (e) {

			// Log the message.
			new this.c.wnLog('ERROR: '+e.message,'exception');

			// Split stack.
			var _stack = e.stack.split("\n");
			// Remove first line.
			_stack.shift();
			// Log the stack.
			for (s in _stack)
				new this.c.wnLog(_stack[s],'stack');

		}

	}

};
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
 * @pagackge system.base
 * @since 1.0.0
 */

// Exports.
module.exports = wnServer;
	
// wnServer Class
function wnServer(configFile) {

	/**
	 * Constructor
	 * {description}
	 */	
	this.construct = function (configFile) {

		 wns.log.push('[*] Building new `wnServer`');

		 // Importing core classes.
		 wns.log.push('[*] Cloning core classes instance to the server.');
		 for (c in coreClasses) {
			 var module = {},
				 _class = coreClasses[c];
			 eval(_class);
			 this.c[c] = module.exports;
		 }

		// If dont have config information, then uses the default
		this.configFile = configFile || './config.json';

		// Load default wnServer configuration from the source.
		wns.log.push('[*] Loading default server config... [/'+sourcePath+'config/wnServerConfig.json]');
		this.config=new this.c.wnConfig(cwd+sourcePath+'config/wnServerConfig.json');

		// Load custom wnServer configuration on the root directory (if exists)
		if (fs.existsSync(cwd+'config.json')) {
			wns.log.push('[*] Loading custom server config... [/'+this.configFile+']');
			this.config.loadFromFile(cwd+configFile);
		}
		
		// Loading applications...
		this.app={};
		wns.log.push('[*] Loading applications from config...');
		var web=this;
		for (app in this.config.app) {
			// Creates a new application
			this.app[app] = new this.c.wnApp(app,cwd+'app/'+this.config.app[app]);

			// Create a wnLog to the application.
			this.app[app].log=new wns.wnLog(function (data,zone) {;
				var _app=web.app[app].logHandler(data,zone);
				if (_app) {
					web.log.push(_app.data,_app.zone);
				}
			});
		}

		// Creates a new http server..
		wns.log.push('[*] Creating HTTP server...');
		this.http = new wnHttp(this);
		this.http.super_=this;

		// Start listening the http server
		this.http.listen();
		wns.log.push('Listening HTTP server at '+this.config.http.listen[1]+':'+this.config.http.listen[0]);

		// Create new console to the server.
		//this.console = new wnConsole();

	}


	/**
	 * Log handler
	 * @param $data log data
	 * @param $zone log zone
	 */
	 this.logHandler = function (data,zone) {
			var _log = { data: '[*] ' + data, zone: (zone || 'trace') };
			if (this.config.log != undefined) {
				if (this.config.log[zone] === true) return _log;
			} else return _log;
			return false;
	 }

	/**
	 * @var object the configuration of the server.
	 */
	this.config = {};

	/**
	 * @var object the object with all loaded apps
	 */
	this.app = {};

	/**
	 * @var object the configuration of the server.
	 */
	this.config = {};

	/**
	 * @var object all loaded classes
	 */
	this.c = {};

	// Construct function
	this.construct.apply(this,arguments);

}
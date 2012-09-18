/**
 * Source of the wnApp class.
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

// Exports
module.exports = wnApp;
	
// wnApp Class
function wnApp(appName,appPath) {

	/**
	 * Constructor
	 * {description}
	 * @param $appName string name of the application
	 * @param $appPath string path to the application
	 */	
	this.construct = function (appName,appPath) {

	 	//process.on('uncaughtException', function (e) { new wns.wnError(e); });

		// Save the appPath.
		this.appPath = appPath;

		// Save the appName.
		this.appName = appName;

		 wns.log.push('['+appName+'] Cloning core classes instance to the application.');
		 for (c in coreClasses) {
			 var module = {},
				 _class = coreClasses[c];
			 eval(_class);
			 this.c[c] = module.exports;
		 }

		wns.log.push('['+appName+'] Creating application...');

		// Loads the default and custom configuration of the application
		wns.log.push('['+appName+'] Loading default app config... [/'+sourcePath+'config/wnAppConfig.json]');
		this.config = new this.c.wnConfig(cwd+sourcePath+'config/wnAppConfig.json');
		wns.log.push('['+appName+'] Loading custom app config... [/<appPath>/config.json]');
		this.config.loadFromFile(appPath+'config.json');

		// Load custom classes into the core classes.
		var classes=fs.readdirSync(this.appPath+this.config.path.classes);
		for (c in classes) {
			var _class = fs.readFileSync(this.appPath+this.config.path.classes+classes[c]).toString(),
				module = {};
			eval(_class);
			this.c[classes[c].split('.')[0]].constructor = module.exports.constructor;
			wns.log.push('['+appName+'] - Loaded custom class: /'+this.config.path.classes+classes[c]);
		}

		// Load a library into the application.
		for (e in this.config.lib) {
			this.loadLibrary(e,this.config.lib[e]);
			wns.log.push('['+appName+'] - Loaded library: /lib/'+e+'.js');
		}
		delete this.config.lib;

		wns.log.push('['+appName+'] Creating `wnUrlManager` with rules from the config');
		// Create a new UrlManager to route the requests only for this application.
		this.urlManager = new this.c.wnUrlManager(this).addRules(this.config.http.urlManager.rules).process();

	}

	/**
	 * Log handler
	 * @param $data log data
	 * @param $zone log zone
	 */
	this.logHandler = function (data,zone) {
			var _log = { data: '['+this.appName+'] ' + data, zone: (zone || 'trace') };
			if (this.config.log != undefined) {
				if (this.config.log[zone] === true) return _log;
			} else return _log;
			return false;
	}

	/**
	 * @var object object with all loaded controllers
	 */
	this.controllers={};

	/**
	 * @var object object with all loaded custom classes
	 */
	this.classes={};

	/**
	 * @var object configuration of the application
	 */
	this.config = {};

	/**
	 * @var string path to the application files.
	 */
	this.appPath = '';

	/**
	 * @var string the name of the application
	 */
	this.appName = '';

	/**
	 * @var object all loaded classes
	 */
	this.c = {};

	/**
	 * @var wnUrlManager instance
	 */
	this.urlManager={};

	/**
	 * Load and library to the application
	 * The library file must be on the application directory, inside the library folder.
	 * @param $library string the name of the library to be loaded
	 * @param $config object the configuration of the library
	 */
	this.loadLibrary = function (library,config) {

		var config = config || {};
		this.c[library]=new this.c.wnLibrary(this.appPath+this.config.path.lib+library+'.js',config);
		if (config.alias && !this[config.alias]) this[config.alias] = this.c[library];

	};

	// Construct function
	this.construct.apply(this,arguments);

}
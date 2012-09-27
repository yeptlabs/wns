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
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: [],

	/**
	 * Constructor
	 * {description}
	 * @param $appName string name of the application
	 * @param $appPath string path to the application
	 */	
	constructor: function (appName,appPath) {

		// Save the appPath.
		this.appPath = appPath;

		// Save the appName.
		this.appName = appName;

		 wns.log.push('['+appName+'] Copying core classes sources to the application.');
		 var _c = {};
		 for (c in coreClasses) {
			 var module = {},
				 _class = coreClasses[c];
			 eval(_class);
			 _c[c] = module.exports;
		 }
		wns.log.push('['+appName+'] Compiling core classes instance...');
		this.classBuild = new wns.wnBuild(_c);
		var compiled = this.classBuild.build();
		for (c in compiled) {
			this.c[c] = compiled[c].loaded == true ? compiled[c] : this.c[c];
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
			if (this.c[classes[c].split('.')[0]]==undefined) continue;
			var _class = fs.readFileSync(this.appPath+this.config.path.classes+classes[c]).toString(),
				module = {};
			eval(_class);
			this.c[classes[c].split('.')[0]] = this.classBuild.recompile(classes[c].split('.')[0], module.exports), 
			wns.log.push('['+appName+'] - Loaded custom class: /'+this.config.path.classes+classes[c]);
		}

		// Load a library into the application.
		for (e in this.config.lib) {
			this.loadLibrary(e,this.config.lib[e]);
			wns.log.push('['+appName+'] - Loaded library: /lib/'+e+'.js');
		}

		wns.log.push('['+appName+'] Setting up urlManager...');
		// Setting up a urlmanager to this application.
		this.urlManager = new this.c.wnUrlManager(this).addRules(this.config.http.urlManager.rules).process();

		/* EVENTS */
		wns.log.push('['+appName+'] Setting up events...');

		// Setting up exception handler to this application.
		this.events.wnExceptionEvent = new this.c.wnExceptionEvent(this,function (e) {
			this.exceptionHandler(e);
		}.bind(this));
		// Recompile the wnExeception prototype to add the handler..
		this.c.wnException=this.classBuild.recompile('wnException', { public: { handler: this.events.wnExceptionEvent } });

		// Setting up log event.
		// Recompile the wnLog prototype to add the handler..
		this.c.wnLog=this.classBuild.recompile('wnLog', { public: { handler: function () {} } });

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
		 * @var object object with all loaded controllers
		 */
		controllers: {},

		/**
		 * @var object object with all loaded custom classes
		 */
		classes: {},

		/**
		 * @var object configuration of the application
		 */
		config: {},

		/**
		 * @var object all events handlers
		 */
		events: {},

		/**
		 * @var string path to the application files.
		 */
		appPath: '',

		/**
		 * @var string the name of the application
		 */
		appName: '',

		/**
		 * @var object all loaded classes
		 */
		c: {},

		/**
		 * @var wnUrlManager instance
		 */
		urlManager: {}

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
			var _log = { data: '['+this.appName+'] ' + data, zone: (zone || 'trace') };
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

		},

		/**
		 * Load and library to the application
		 * The library file must be on the application directory, inside the library folder.
		 * @param $library string the name of the library to be loaded
		 * @param $config object the configuration of the library
		 */
		loadLibrary: function (library,config) {

			var config = config || {};
			this.c[library]=new this.c.wnLibrary(this.appPath+this.config.path.lib+library+'.js',config);
			if (config.alias && !this[config.alias]) this[config.alias] = this.c[library];

		}

	}

};
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
	
/**
 * Constructor
 * {description}
 * @param $appPath string path to the application
 */	
function wnApp(appName,appPath) {

	/**
	 * @extends: wnObject
	 */
	util.inherits(this, wnObject);

	// Save the appPath.
	this.appPath = appPath;

	// Save the appName.
	this.appName = appName;

	// Loads the default and custom configuration of the application
	console.log('['+appName+'] Loading default app config... [/'+sourcePath+'config/wnAppConfig.json]');
	this.config = new wnConfig(cwd+sourcePath+'config/wnAppConfig.json');
	console.log('['+appName+'] Loading custom app config... [/appPath/config.json]');
	this.config.loadFromFile(appPath+'config.json');

	// Carrega as libraries padrões...
	var classes=fs.readdirSync(this.appPath+this.config.path.classes);
	for (c in global) {
		if (c.substr(0,2) == 'wn') this.classes[c] = global[c];
	}
	for (c in classes) {
		console.log('['+appName+'] - Loaded custom class: /'+this.config.path.classes+classes[c]);
		var className = classes[c].split('.')[0],
			_cclass = _r(this.appPath+this.config.path.classes+classes[c]);
		this.classes[className]=_cclass;
	}

	// Load a library into the application.
	for (e in this.config.lib) {
		this.loadLibrary(e,this.config.lib[e]);
	}
	delete this.config.lib;

}

/**
 * @var object object with all loaded controllers
 */
wnApp.prototype.controllers={};

/**
 * @var object object with all loaded custom classes
 */
wnApp.prototype.classes={};

/**
 * @var object configuration of the application
 */
wnApp.prototype.config = {};

/**
 * @var string path to the application files.
 */
wnApp.prototype.appPath = '';

/**
 * @var string the name of the application
 */
wnApp.prototype.appName = '';

/**
 * @var object where it will be stored all application libraries
 */
wnApp.prototype.lib = {};

/**
 * Load and library to the application
 * The library file must be on the application directory, inside the library folder.
 * @param $library string the name of the library to be loaded
 * @param $config object the configuration of the library
 */
wnApp.prototype.loadLibrary = function (library,config) {

	console.log('['+this.appName+'] - Loaded library: /lib/'+library+'.js');
	this.lib[library]=new this.classes.wnLibrary(this.appPath+this.config.path.lib+library+'.js',config);

};
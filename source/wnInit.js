/**
 * @WebNode - A NodeJS MVC Framework and HTTP Server
 * 
 * @author: Pedro Nasser
 * @link: http://pedroncs.com/projects/webnode/
 * @license: http://pedroncs.com/projects/webnode/#license
 * @copyright: Copyright &copy; 2012 WebNode Server
 */

/**
 * Load required sources and initializes the wnServer.
 *
 * @author Pedro Nasser
 * @version $Id$
 * @package system
 * @since 1.0.0
 */

console.log('Loading WEBNODE:');
global.sourcePath = 'source/'; // Path to the source
global.cwd = process.cwd()+'/'; // Current work directory
global._r = require; // Alias to require
global._walk = _r(cwd+sourcePath+'util/recursiveReadDir'); // Recursive read directory
Object.extend = _r(cwd+sourcePath+'util/extend'); // Object recursive extension

console.log(' - Loading required node modules..');
global.http = _r('http');
global.fs = _r('fs');
global.url = _r('url');
global.zlib = _r('zlib');
global.stream = _r('stream');
global.util = _r('util');
global.emitter = _r('events').EventEmitter;
global.Buffer = _r('buffer').Buffer;
global.mime = _r('mime');

// WEBNODE object.
// Will contain the classes to build and load.
global.wns = {};

// We need this class for building the rest of the required classes.
console.log(' - Loading and compiling wnBuild class..');
wns.wnBuild = _r(cwd+sourcePath+'wnBuild.js');

console.log(' - Loading core required classes souces...');
var _coreClasses={};
// Recursivelly getting list of all classes in the core/
_walk(cwd+sourcePath+'core', function (err, classes) {

	// Load core class sources to the memory.
	for (c in classes) {

		// Loading class source.
		var _class = fs.readFileSync(classes[c]).toString();

		// Compiling the class.
		var module = {};
		eval(_class);

		// Check structure.
		if (!wns.wnBuild.prototype.checkStructure(module.exports)) continue;

		// Store class.
		wns[classes[c].split('/').pop().split('.')[0]] = module.exports;

		// Store class source.
		_coreClasses[classes[c].split('/').pop().split('.')[0]] = _class; 

		console.log('  > Class found: '+classes[c].split('/').pop().split('.')[0]);

	}

	// We will compile the new classes to the WNS object.
	console.log(' - Compiling required classes...');
	var compiled = (new wns.wnBuild(wns).build());
	for (c in compiled) {
		// Store compiled classes as read-only.
		Object.defineProperty(wns, c, {
			value: compiled[c].loaded == true ? compiled[c] : wns[c],
			writable: false,
			configurable: false
		});
	}

});

// Sending coreClasses to global, read-only.
Object.defineProperty(global, 'coreClasses', { value: _coreClasses, writable: false, configurable: false });

// Create a new console
wns.console = new wns.wnConsole();

// Create an alias.
wns.log = wns.console;
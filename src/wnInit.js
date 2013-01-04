/**
 * @WNS - A NodeJS MVC Framework and HTTP Server
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
 * @package system
 * @since 1.0.0
 */

console.log('Welcome to WNS!');

// Loading requirements..
try
{

	global.sourcePath = 'src/';
	global.cwd = __dirname+'/../';
	global._r = require;

	console.log(' - Loading utilities..');
	global._walk = _r(cwd+sourcePath+'util/recursiveReadDir');
	Object.extend = _r(cwd+sourcePath+'util/extend');
	Object.extend(true,Object,_r(cwd+sourcePath+'util/object'));

	console.log(' - Loading required node modules..');
	global.http = _r('http');
	global.fs = _r('fs');
	global.path = _r('path');
	global.url = _r('url');
	global.zlib = _r('zlib');
	global.crypto = _r('crypto');
	global.stream = _r('stream');
	global.util = _r('util');
	global.mime = _r('mime');
	global.wrench = _r('wrench');
	global.events = _r('events');
	global.buffer = _r('buffer');
	global.emitter = events.EventEmitter;
	global.Buffer = buffer.Buffer;
} catch (e) {
	console.log('Failed to load some dependencies...');
	throw e;
	process.exit();
}

// WNS object.
// Will contain the classes to build and load.
global.wns = {};

// We need this class for building the rest of the required classes.
console.log(' - Loading and compiling wnBuild class..');
wns.wnBuild = _r(cwd+sourcePath+'wnBuild.js');

console.log(' - Loading core required classes souces...');
var _coreClasses={}, toBuild = {};
// Recursivelly getting list of all classes in the core/
_walk(cwd+sourcePath+'core', function (err, classes) {

	// Load core class sources to the memory.
	for (c in classes) {

		// Loading class source.
		var _class = fs.readFileSync(classes[c]).toString(),
			className = classes[c].split('/').pop().split('.')[0];

		// Compiling the class.
		var module = {};
		eval(_class);

		// Check structure.
		if (wns.wnBuild.prototype.checkStructure(module.exports)) {

			// Send it to the build list.
			toBuild[className] = module.exports;

		} else {
		
			// Send it to the WNS.
			wns[className] = module.exports;
		
		}

		// Store class source.
		_coreClasses[className] = _class; 

		console.log('  > Class found: '+className);

	}

	// We will compile the new classes to the WNS object.
	console.log(' - Compiling required classes...');
	var compiled = (new wns.wnBuild(toBuild).build());
	for (c in toBuild) {
		if (compiled[c].loaded) {
			// Store compiled classes as read-only.
			Object.defineProperty(wns, c, {
				value: compiled[c],
				writable: false,
				configurable: false,
				enumerable: true
			});
		}
	}

});

// Sending coreClasses to global, read-only.
Object.defineProperty(global, 'coreClasses', { value: _coreClasses, writable: false, configurable: false });

// Create a new console
wns.console = new wns.wnConsole();
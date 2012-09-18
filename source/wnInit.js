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
 * @since 1.0.0
 */

	console.log('Loading WEBNODE:');
	global.sourcePath = 'source/'; // Path to the source
	global.cwd = process.cwd()+'/'; // Current work directory
	global._r = require; // Alias to require
	global._walk = _r(cwd+sourcePath+'util/recursiveReadDir');

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

	console.log(' - Loading required WNS base modules..');
	global.wns = {};
	_walk(cwd+sourcePath+'base', function (err, classes) {
		for (c in classes) {
			wns[classes[c].split('/').pop().split('.')[0]] = _r(classes[c]);
			console.log('  > Base loaded: '+classes[c].split('/').pop().split('.')[0]);
		}
	})

	console.log(' - Loading core required classes...');
	global.coreClasses={};
	// Recursivelly getting list of all classes in the core/
	_walk(cwd+sourcePath+'core', function (err, classes) {
		// Load core class sources to the memory.
		for (c in classes) {
   			var _class = fs.readFileSync(classes[c]).toString();
			global.coreClasses[classes[c].split('/').pop().split('.')[0]] = _class;
			console.log('  > Class loaded: '+classes[c].split('/').pop().split('.')[0]);
		}
	});

	console.log(' - Loading core required libraries...');
	var classes=fs.readdirSync(cwd+sourcePath+'lib/');
	global.coreLibraries = classes;
	// Load core class sources to the memory.
	for (c in classes) {
		var _class = fs.readFileSync(classes[c]).toString();
		global.coreClasses[classes[c].split('/').pop().split('.')[0]] = _class;
		console.log('  > Library loaded: '+classes[c].split('/').pop().split('.')[0]);
	}

	// Create a new console
	var _console = new wns.wnConsole();

	// Create and alias.
	wns.log = _console;

(function (_console) {

	// Check have extra arguments
	if (process.argv.length>2) {

		/*console.log(' - Loading wnServer class.');
		global.wnServer = _r(cwd+sourcePath+'wnServer.js');

		var args = process.argv.slice(2);
		console.log(' [*] Executing console: "'+args.join(' ')+'"');

		// Execute the command in the arguments (if it is valid).
		var _console = new wnConsole();
		_console.exec(args);*/

	} else {

		// Create the server using the following configuration file.
		var web = new wns.wnServer('config.json');

		// Create a wnLog to the server.
		web.log = new wns.wnLog(function (data,zone) {
			var _server = web.logHandler(data,zone);
			if (_server) {
				_console.push(_server.data,_server.zone);
			}			
		});

	}

})(_console);

delete wns;
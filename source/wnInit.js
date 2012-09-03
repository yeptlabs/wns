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

console.log('Starting webNode..');
	sourcePath = 'source/'; // Path to the source
	cwd = process.cwd()+'/'; // Current work directory
	_r = require; // Alias to require

console.log('Loading required node modules..');
	http = _r('http');
	fs = _r('fs');
	url = _r('url');
	zlib = _r('zlib');
	stream = _r('stream');
	util = _r('util');
	emitter = require('events').EventEmitter;
	Buffer = _r('buffer').Buffer;

console.log('Loading required core classes...');
	// Recursivelly getting list of all classes in the core/
	var walk = function(dir, done) {
	  var results = [];
	  var list = fs.readdirSync(dir);
		var i = 0;
		(function next() {
			var file = list[i++];
			if (!file) return done(null, results);
			file = dir + '/' + file;
			var stat = fs.statSync(file);
			if (stat && stat.isDirectory()) {
			  walk(file, function(err, res) {
				results = results.concat(res);
				next();
			  });
			} else {
			  results.push(file);
			  next();
			}
		})();
	};
	walk(cwd+sourcePath+'core/', function (err, classes) {
		// Load that classes
		for (c in classes) {
			console.log(' - Loaded class: '+classes[c].split('/').pop());
			global[classes[c].split('/').pop().split('.')[0]] = _r(classes[c]);
		}
	});

console.log('Loading required libraries classes...');
	var classes=fs.readdirSync(cwd+sourcePath+'lib/');
	for (c in classes) {
		console.log(' - Loaded library: /'+sourcePath+'lib/'+classes[c]);
		global[classes[c].split('.')[0]] = _r(cwd+sourcePath+'lib/'+classes[c]);
	}

	process.on('uncaughtException', function (e) { new wnError(e); });

(function () {

	// Check have extra arguments
	if (process.argv.length>2) {

		var args = process.argv.slice(2);
		console.log('Executing console: "'+args.join(' ')+'"');

		// Execute the command in the arguments (if it is valid).
		var console = new wnConsole();
		console.exec(args);

	} else {
	
		// Create the server...
		var web = new wnServer;

	}

})();
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

console.log('Starting server..');
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
	var classes=fs.readdirSync(cwd+sourcePath+'core/');
	for (c in classes) {
		console.log(' - Loaded class: /'+sourcePath+'core/'+classes[c]);
		global[classes[c].split('.')[0]] = _r(cwd+sourcePath+'core/'+classes[c]);
	}

	console.log('Loading required libraries classes...');
	var classes=fs.readdirSync(cwd+sourcePath+'lib/');
	for (c in classes) {
		console.log(' - Loaded library: /'+sourcePath+'lib/'+classes[c]);
		global[classes[c].split('.')[0]] = _r(cwd+sourcePath+'lib/'+classes[c]);
	}

	process.on('uncaughtException', function (e) { new wnError(e); });

(function () {

	// Create the server...
	var web = new wnServer;

})();
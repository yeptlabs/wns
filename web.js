/*#
  * @WebNode v1.0 - A NodeJS-MVC HTTP Server.
  * http://pedroncs.com/projects/webnode/
  * 
  * All rights reserved.
  */

console.log('Starting server..');
var sourcePath = 'source/', // Caminho para a source.
	_r = require; // Alias para require

// Carregando modulos do NODEJS.
console.log('Loading required node modules..');
var http = _r('http'),
	fs = _r('fs'),
	url = _r('url'),
	zlib = _r('zlib'),
	stream = _r('stream'),
	util = _r('util'),
	events = _r('events'),
	Buffer = _r('buffer').Buffer;

	// Carrega as classes padrões...
	console.log('Loading required classes...');
	var classes=fs.readdirSync('./'+sourcePath+'classes/');
	for (c in classes) {
		console.log(' - Loaded class: /'+sourcePath+'classes/'+classes[c]);
		global[classes[c].split('.')[0]] = _r('./'+sourcePath+'classes/'+classes[c]);
	}

	/* Informações estáticas desta versão. */
	/* Não mudar */
	wnServer.prototype.version = '1.0.0';
	wnServer.prototype.servername = 'webNode';
	wnServer.prototype.author = 'Pedro Nasser';

(function () {

	// Cria um novo WebNode Server.
	var web = new wnServer;

})();
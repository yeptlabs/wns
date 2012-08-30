/*#
  * @WebNode - A NodeJS-MVC HTTP Server.
  * http://pedroncs.com/projects/webnode/
  * 
  * All rights reserved.
  */

console.log('Starting server..');
	sourcePath = 'source/'; // Caminho para a source.
	cwd = process.cwd()+'/'; // Caminho atual.
	_r = require; // Alias para require

// Carregando modulos do NODEJS.
console.log('Loading required node modules..');
	http = _r('http');
	fs = _r('fs');
	url = _r('url');
	zlib = _r('zlib');
	stream = _r('stream');
	util = _r('util');
	emitter = require('events').EventEmitter;
	Buffer = _r('buffer').Buffer;

	// Carrega as classes padrões...
	console.log('Loading required core classes...');
	var classes=fs.readdirSync(cwd+sourcePath+'core/');
	for (c in classes) {
		console.log(' - Loaded class: /'+sourcePath+'core/'+classes[c]);
		global[classes[c].split('.')[0]] = _r(cwd+sourcePath+'core/'+classes[c]);
	}

	// Carrega as libraries padrões...
	console.log('Loading required libraries classes...');
	var classes=fs.readdirSync(cwd+sourcePath+'lib/');
	for (c in classes) {
		console.log(' - Loaded library: /'+sourcePath+'lib/'+classes[c]);
		global[classes[c].split('.')[0]] = _r(cwd+sourcePath+'lib/'+classes[c]);
	}

	// Erros não acolhidos...
	process.on('uncaughtException', function (e) { new wnError(e); });

	/* Informações estáticas desta versão. */
	/* Não mudar */
	wnServer.prototype.version = '1.0.0';
	wnServer.prototype.servername = 'webNode';
	wnServer.prototype.author = 'Pedro Nasser';

(function () {

	// Cria um novo WebNode Server.
	var web = new wnServer;

})();
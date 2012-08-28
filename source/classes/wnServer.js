/*@
 * Classe: wnServer
 * Desc: Estrutura padrão de um webNode Server.
 */

// Exportar:
module.exports = wnServer;

// Construtor:
function wnServer() {

	console.log('Creating new WebNode Server..');

	// Carregando configurações padrões
	console.log('Loading default webserver config... [/'+sourcePath+'defaultConfig.json]');
	var data = fs.readFileSync('./'+sourcePath+'defaultConfig.json');
	web.config=JSON.parse(data);


/*
	// Carrega libs globais
	console.log('Loading global libraries...');
	for (e in web.config.lib) {
		console.log(' - Loaded lib: /lib/'+web.config.lib[e]+'.js');
		web.config[web.config.lib[e]] = web.config[web.config.lib[e]] || {};
		web[web.config.lib[e]] = _r('./lib/'+web.config.lib[e]+'.js');
	}

	// Error log.
	process.on('uncaughtException', function (err) {
	  web.log(err);
	});

	// Carregando configurações customizadas
	web.log('Loading custom webserver config... [/config.json]');
	var data = fs.readFileSync('./config.json');
		web.extend(true,web.config,JSON.parse(data));

	// Carregando aplicações...
	web.app={};
	for (app in web.config.app) {



	}

	// Cria o server http
	web.log('Creating HTTP server...');
	http.createServer(function (request,response) {

		// Identificando qual aplicação será acessada.
		var servername = request.headers.host;

		// Vasculha as aplicações..
		for (a in web.app) {
			if (servername == a || (web.app[a].config.serveralias+'').indexOf(new String(servername)) != -1) {
				// Nova instancia do handler HTTP
				var _http = web.extend(true,{},web.app[a].http);
				_http.appName=a;
				_http.app=web.app[a];
				_http.request = request;
				_http.response = response;;
				_http.handler();
				return false;
			} 
		}

		response.end('Invalid hostname access.');
		web.log('Invalid hostname ('+servername+') access.','access');
	
	}).listen(web.config.listen[0],web.config.listen[1])
	web.log('Listening HTTP server at '+web.config.listen[1]+':'+web.config.listen[0]);*/



}
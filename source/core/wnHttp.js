/**
 * Source of the wnHttp class.
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

// Exports.
module.exports = wnHttp;
	
/**
 * Constructor
 * {description}
 */
function wnHttp () {
	this.connection=http.createServer(this.handler.bind(this));
}

/**
 * @var string data of the response
 */
wnHttp.prototype.data='';

/**
 * @var integer status code of the response
 */
wnHttp.prototype.code=200;

/**
 * @var object header configuration of the response
 */
wnHttp.prototype.header={};

/**
 * @var HTTPObject stores the http object
 */
wnHttp.prototype.connection={};

/**
 * Method that compress, prepare and sends the response.
 */
wnHttp.prototype.send = function () {

	// Objeto http
	var http=this;

	// Busca saber se é possivel encodar o conteúdo
	var acceptEncoding = http.request.headers['accept-encoding'];
	if (!acceptEncoding) { acceptEncoding = ''; }

	// Verifica se é possivel utilizar gzip e se possui mais de 150bytes.
	if (acceptEncoding.match(/\bgzip\b/) || (typeof http.data == 'string' && Buffer.byteLength(http.data, 'utf8')>150)) {
		// gzipa.
		http.header['Content-Encoding']='gzip';
		zlib.gzip(new Buffer(http.data), function (e,buf) {
			// Envia a resposta..
			http.header['Content-Length']=buf.length;
			http.response.writeHead(http.code,http.header);
			http.response.end(buf);
		});
	} else {
		// Envia a resposta..
		http.header['Content-Length']=http.data.length;
		http.response.writeHead(http.code,http.header);
		http.response.end(http.data);		
	}

};

/**
 * Method start listening the http server..
 */
wnHttp.prototype.listen = function () {
	this.connection.listen(this.super_.config.listen[0],this.super_.config.listen[1]);
	console.log('Listening HTTP server at '+this.super_.config.listen[1]+':'+this.super_.config.listen[0]);
}

/**
 * HTTP Handler
 * @param $request Request request of the http connection
 * @param $response Reponse response of the http connection
 */
wnHttp.prototype.handler = function (request,response) {
	
	// Getting host of the request.
	var servername = request.headers.host;

	// Looking for the right application
	for (a in this.super_.app) {
		if (servername == a || (this.super_.app[a].config.http.serveralias+'').indexOf(new String(servername)) != -1) {

			var _instance = {};
			_instance.request = request;
			_instance.response = response;
			_instance.app = this.super_.app[a];
			wnObject.extend(true,_instance,new this.super_.app[a].classes.wnHttp);

			// Creates a new connection..
			var _connection = new this.super_.app[a].classes.wnConnection(_instance);

			return false;
		} 
	}

	response.end('Invalid hostname access.');
	console.log('Invalid hostname ('+servername+') access.');

};

/**
 * Controller Access Handler
 */
wnHttp.prototype.controllerHandler = function () {

	// Parse the url to get the correct controller and action name.
	var _p=this.parsedUrl.pathname.split('/'),
		_plen = _p.length,
		_controller=_plen>0&&_p[1]!=''?_p[1]:this.app.config.http.defaultController,
		_action=_plen>1&&_p[2]!=''?_p[2]:undefined;

	// Check if this controller not have been loaded before.
	// TODO: Smart Cache System.
	if (!this.app.controllers[_controller] || 1==1) {

		// Check the existence of the controller on the directory.
		if (!fs.existsSync(this.app.appPath+this.app.config.path.controllers+_controller+'.js')) {
			if (this.app.config.http.errorPage==undefined) {
				// If it does not exists
				this.code = 404;
				this.header['Status']='404 Not Found';
				console.log('Controller not found: '+_controller);
				return false;
			} else {
				_controller=this.app.config.http.errorPage.split('/')[0];
				_action=this.app.config.http.errorPage.split('/')[1];
				this.parsedUrl.pathname=this.app.config.http.errorPage;
			}
		}
			
		// Creates a new controller based on the default.
		this.app.controllers[_controller]=new this.app.classes.wnController(this);

		// Extends it with the application controller.
		var _cntr=_r(this.app.appPath+this.app.config.path.controllers+_controller+'.js');
		this.app.super_.extend(true,this.app.controllers[_controller],_cntr);
		this.controller=_controller;

	}

	// If theres no action name try to reach the default action...
	_action=this.action=(!_action?this.app.controllers[_controller].defaultAction:_action);

	// Search for the right action name.
	for (a in this.app.controllers[_controller]) {
		if (a.toLowerCase() == 'action'+_action.toLowerCase()) { _action=a; break; }
	}

	// Executes the action.
	this.app.controllers[_controller][_action]&&this.app.controllers[_controller][_action]();
	
};

/**
 * Public File Access Handler
 */
wnHttp.prototype.publicHandler = function () {

		// First we get the file extension.
		var ext=this.parsedUrl.pathname.split('.').slice(-1)[0];

		// Try to read the file on the public directory
		fs.readFile(this.app.appPath+this.app.config.path.public+this.parsedUrl.pathname.substr(1), function (err, data) {

			// If notfound:
			if (err) { this.code = 404; this.header['Status']='404 Not Found'; console.log('File not found: '+this.parsedUrl.pathname); }
			// If found it, send it to the http.data
			else { this.data = data; }

			// Define headers
			this.header['Content-Length']=this.data.length;
			this.header['Content-Type']=this.app.config.http.contentType[ext]?this.app.config.http.contentType[ext]:'application/octet-stream';

			// Send the response
			this.send();

		}.bind(this));

};
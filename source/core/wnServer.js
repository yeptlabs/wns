/**
 * Source of the wnServer class.
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
module.exports = wnServer;
	
/**
 * Constructor
 * {description}
 */	
function wnServer() {

	console.log('Creating new WebNode Server..');

	// Load default wnServer configuration from the source.
	console.log('Loading default webnode config... [/'+sourcePath+'config/wnServerConfig.json]');
	this.config=new wnConfig(cwd+sourcePath+'config/wnServerConfig.json');

	// Load custom wnServer configuration on the root directory (if exists)
	if (fs.existsSync(cwd+'config.json')) {
		console.log('Loading custom webnode config... [/config.json]');
		this.config.loadFromFile(cwd+'config.json');
	}
	
	// Loading applications...
	this.app={};
	console.log('Loading applications from config...');
	for (app in this.config.app) {
		// Creates a new application
		this.app[app] = new wnApp(app,cwd+'app/'+this.config.app[app]);
	}

	// Creates a new http server..
	console.log('Creating HTTP server...');
	this.http = new wnHttp(this);
	this.http.super_=this;
	// Start listening the http server
	this.http.listen();

 }

 /**
  * @var object the configuration of the server.
  */
 wnServer.config = {};

 /**
  * @var object the object with all loaded apps
  */
 wnServer.prototype.app = {};




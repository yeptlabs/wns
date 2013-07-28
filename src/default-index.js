/**
 * @WebNode - A NodeJS MVC Framework and HTTP Server
 * 
 * @author: Pedro Nasser
 * @link: http://pedroncs.com/projects/webnode/
 * @license: http://pedroncs.com/projects/webnode/#license
 * @copyright: Copyright &copy; 2012 WebNode Server
 */

/**
 * Calls the wnInit.
 *
 * @author Pedro Nasser
 * @version $Id$
 * @since 1.0.0
 */

/* THIS IS A DEFAULT WAY TO LOAD IT */

(function () {

	// Initialize the webNode.
	require('{sourcePath}wnInit.js');

	// Prepare the event 'loadServer' to change the listening port.
	wns.console.addListener('loadServer',function (e,server) {
		var httpConfig=server.getConfig().components.http;
		httpConfig.listen[0]=process.env.PORT || httpConfig.listen[0];
		server.setComponents({ http: httpConfig });
	});

	// Create the server using the following configuration file.
	// Push the new server to the wnConsole.
	wns.console.addServer('{serverPath}');

	// To add a second server, just remove the comment
	// And edit the new server path.
	//wns.console.addServer('[NEW SERVER PATH]');

	// You can add as many server as you want.

})();

// WNS is just a temporary object to the loading system.
delete wns;
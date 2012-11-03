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

(function () {

	// Initialize the webNode.
	require('./source/wnInit.js');

	// Create the server using the following configuration file.
	// Push the new server to the wnConsole.
	wns.console.addServer('./');

})();

// WNS is just a temporary object to the loading system.
delete wns;
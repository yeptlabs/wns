/**
 * Source of the wnConsole class.
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
module.exports = wnConsole;
	
/**
 * Constructor
 * {description}
 */	
function wnConsole(args) {}

/**
 * @var object the configuration of the server.
 */
wnConsole.prototype.config = {};

/**
 * Executes a wnConsoleCommand.
 */
wnConsole.prototype.exec = function (args) {
	console.log(args);
};
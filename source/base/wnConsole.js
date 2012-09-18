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

// wnConsole Class
function wnConsole(args) {

	/**
	 * Constructor
	 * {description}
	 */	
	this.construct = function (args) {

		/*// Listen to the stdin.
		process.stdin.resume();
		process.stdin.setEncoding('utf8');

		process.stdin.on('data', function (chunk) {
		  // Execute the console.
		  this.console.exec(chunk.substr(0,chunk.length-1).split(' '));
		  process.stdout.write("\n");
		}.bind(this));*/
 
	};

	/**
	 * @var object the configuration of the server.
	 */
	this.config = {};

	/**
	 * Executes the console command.
	 */
	this.exec = function (args) {
		console.log(args);
	};

	/**
     * Pushes a data to the console.
	 */
	this.push = function (data) {
		console.log(data);
	};
	
	// Construct function
	this.construct.apply(this,arguments);

}
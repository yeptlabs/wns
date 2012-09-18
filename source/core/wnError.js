/**
 * Source of the wnError class.
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
module.exports = wnError;
	
// wnError Class
function wnError(err) {

	/**
	 * Constructor
	 * {description}
	 */	
	this.construct = function (err) {

		// Imports the Error Object
		if (err instanceof Error) {
			this.message = err.message;
			this.stack = err.stack;
			this.code = err.code;
		} else if (typeof err == 'string'){
			this.message = err;
		}

		// Console log the error.
		console.log(this.stack != '' ? this.stack : this.message);
		// TODO: Event emitter of error.

	}

	/**
	 * @var string the message of the error
	 */
	this.message = '';

	/**
	 * @var string the stack of the error
	 */
	this.stack = '';

	/**
	 * @var integer the code number of the error
	 */
	this.code = -1;

	// Construct function
	this.construct.apply(this,arguments);

}
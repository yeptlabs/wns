/**
 * Source of the wnLog class.
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
module.exports = wnLog;

// wnLog Class
function wnLog(cb) {

	/**
	 * Constructor
	 * {description}
	 */	
	this.construct = function (cb) {

		// Create an EventEmitter.
		this.emitter=new emitter;

		// Store the handler function
		this.addListener(cb);

	}

	/**
	 * Push anything to the log stack.
	 * @param $data mixed anything to log
	 * @param $sub string name the subzone of the log
	 */
	this.push = function (data,sub) {

		var sub = sub || '*';

		// Push that array to the stack of logs
		this.stack.push([ data , sub ]);

		// Emit the 'log' event with the arguments.
		this.emitter.emit(this.eventName,data,sub);

	};

	/**
	 * Add a new handler for the 'log event.'
	 * @param $listener function listener of the event
	 */
	this.addListener = function (listener) {

			// Create an listener to call the handler.
			this.listener=this.emitter.on(this.eventName,listener);

	};

	/**
	 * Remove and listener from the 'log event.'
	 * @param $listener function listener of the event
	 */
	this.removeListener = function (listener) {

		// If possible, change the handler
		this.emitter.removeListener(this.eventName, listener);

	};

	/**
	 * @var function 'log' event handler function
	 */
	this.eventName = 'log';

	/**
	 * @var object the configuration of the log system
	 */
	this.config = {};

	/**
	 * @var string the name of this log zone
	 */
	this.zone = '*';

	/**
	 * @var array stack of logs
	 */
	this.stack = [];

	// Construct function.
	this.construct.apply(this,arguments);

}
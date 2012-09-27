/**
 * Source of the wnEvent class.
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

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: [],

	/**
	 * Constructor
	 * {description} TODO
	 */	
	constructor: function (parent,cb) {

		// Create an EventEmitter.
		this.emitter=new emitter;

		// Store the handler function
		cb&&this.addListener(cb);

	},

	/**
	 * PRIVATE
	 */
	private: {},

	/**
	 * Public Variables
	 */
	public: {
	
        /**
         * @var array stack of exceptions
         */
        stack: []

	},

	/**
	 * Methods
	 */
	methods: {
	
        /**
         * Push anything to the exception stack.
         * @param $e exception object
         */
        push: function (e) {

                // Push that array to the stack of exceptions
                this.stack.push(e);

                // Emit the 'exception' event with the arguments.
                this.emitter.emit(this.eventName,e);

        },

        /**
         * Add a new handler for the 'exception event.'
         * @param $listener function listener of the event
         */
        addListener: function (listener) {

                // Create an listener to call the handler.
                this.listener=this.emitter.on(this.eventName,listener);

        },

        /**
         * Remove and listener from the 'exception event.'
         * @param $listener function listener of the event
         */
        removeListener: function (listener) {

                // If possible, change the handler
                this.emitter.removeListener(this.eventName, listener);

        }
	
	}

};
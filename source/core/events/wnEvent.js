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
	extend: ['wnComponent'],

	/**
	 * Constructor
	 * {description} TODO
	 */	
	constructor: function (parent,cb) {

		// Get parent.
		 _super = parent;

		// Create an EventEmitter.
		this.emitter=new emitter;

		// Store the handler function
		cb&&this.addListener(cb);

		console.log(this.getEventName());

	},

	/**
	 * PRIVATE
	 */
	private: {
	
		_eventName: '',
		_super: undefined

	},

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
                this.emitter.emit(this.getEventName(),e);

        },

        /**
         * Add a new handler for the 'exception event.'
         * @param $listener function listener of the event
         */
        addListener: function (listener) {

                // Create an listener to call the handler.
                this.listener=this.emitter.on(this.getEventName(),listener);

        },

        /**
         * Remove and listener from the 'exception event.'
         * @param $listener function listener of the event
         */
        removeListener: function (listener) {

                // If possible, change the handler
                this.emitter.removeListener(this.getEventName(), listener);

        },

		/**
		 * Return the name of this event.
		 * @return STRING name of the event
		 */
		getEventName: function () {
			return _eventName;
		}
	
	}

};
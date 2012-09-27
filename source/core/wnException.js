/**
 * Source of the wnException class.
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
	 * {description}
	 */	
	constructor: function () {

		var err = arguments[0];
		if (!(err instanceof Error)) {
			var err = new Error(arguments[0] || '');
				err.code = arguments[1] || -1;
		}

		this.message = err.message;
		this.stack = err.stack;
		this.code = err.code;
		
		// Push the exception to the event handler.
		this.handler.push&&this.handler.push(this);

	},

	/**
	 * PRIVATE
	 *
	 * Only get and set by their respectives get and set private functions.
	 *
	 * Example:
	 * If has a property named $id.
	 * It's getter function will be `this.getId`, and it's setter `this.setId`.
	 * To define a PRIVILEGED function you put a underscore before the name.
	 */
	private: {},

	/**
	 * Public Variables
	 * Can be accessed and defined directly.
	 */
	public: {

		/**
		 * @var string the message of the error
		 */
		message: '',

		/**
		 * @var string the stack of the error
		 */
		stack: '',

		/**
		 * @var integer the code number of the error
		 */
		code: -1

	},

	/**
	 * Methods
	 */
	methods: {}

};
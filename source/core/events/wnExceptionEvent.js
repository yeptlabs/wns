/**
 * Source of the wnExceptionEvent class.
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
	extend: ['wnEvent'],

	/**
	 * Constructor
	 * {description} TODO
	 */	
	constructor: function (parent,cb) {

		this.super_ = parent;

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
	public: {},

	/**
	 * Methods
	 */
	methods: {}

};
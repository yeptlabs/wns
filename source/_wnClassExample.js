/**
 * Source of the wnClass class.
 * 
 * @author: Pedro Nasser
 * @link: http://pedroncs.com/projects/webnode/
 * @license: http://pedroncs.com/projects/webnode/#license
 * @copyright: Copyright &copy; 2012 WebNode Server
 */

/**
 * An example of a webNode Class.
 *
 * @author {autor}
 * @version $Id$
 * @package {path}
 * @since 1.0.0
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnClass','wnOtherClass'],

	/**
	 * Constructor
	 * {description}
	 * @param VARTYPE $example description
	 */	
	constructor: function (example) {
		console.log(this);
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
	private: {

		/**
		 * var INT id of something
		 */
		id: 0
	
	},

	/**
	 * Public Variables
	 * Can be accessed and defined directly.
	 */
	public: {

		/**
		 * var OBJECT configuration of this class
		 */
		config: {}

	},

	/**
	 * Methods
	 */
	methods: {
	
		/** 
		 * PRIVILEGED: Redefining getId function.
		 * @param STRING $config example of param
		 */
		_getId: function ($config) {
			return this.id;
		}

	}

};
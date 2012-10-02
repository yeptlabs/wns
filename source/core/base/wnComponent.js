/**
 * Source of the wnComponent class.
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
 * @package system.base
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
	 * DO NOT OVERWRITE this.
	 */	
	constructor: function () {
		this.init(); 
		_initialized=true;
	},

	/**
	 * PRIVATE
	 */
	private: {
	
		_initialized: false
	
	},

	/**
	 * Public Variables
	 */
	public: {
	
		/**
		 * @var OBJECT list of behaviors.
		 */
		befaviors: {},
	
	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * This methods is called after the real initialization of the component
		 */
		init: function () {
		
		},

		/**
		 * Checks if this application component bas been initialized.
		 * @return boolean whether this application component has been initialized (ie, {@link init()} is invoked).
		 */
		getIsInitialized: function () {
			return _initialized;
		}

	}

};
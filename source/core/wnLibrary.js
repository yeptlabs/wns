/**
 * Source of the wnLibrary class.
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
	 * @param VARTYPE $example description
	 */	
	constructor: function (libraryPath,config) {

		// Check if the file exists...
		if (!fs.existsSync(libraryPath)) return false;
		
		// Save the path to the library source.
		this.libraryFile = libraryPath;

		// Create a temporary instance of the library.
		var _libSource = require(libraryPath),
			_lib = new _libSource;

		// Extends this class with the library class.
		Object.extend(true,this,_lib);

		// Extends the configuration with the custom configuration..
		Object.extend(true,this.config,config);

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
		 * @var object configuration of the library
		 */
		config: {},

		/**
		 * @var string path to the library source file
		 */
		libraryFile: ''

	},

	/**
	 * Methods
	 */
	methods: {}

};
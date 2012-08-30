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

// Exports.
module.exports = wnLibrary;
	
/**
 * Constructor
 * {description}
 */	
function wnLibrary(libraryPath,config) {

	// Check if the file exists...
	if (!fs.existsSync(libraryPath)) return false;
	
	// Extends wnObject.
	util.inherits(this,wnObject);

	// Save the path to the library source.
	this.libraryFile = libraryPath;

	// Create a temporary instance of the library.
	var _libSource = require(libraryPath),
		_lib = new _libSource;

	// Extends this class with the library class.
	this.super_.extend(true,this,_lib);

	// Extends the configuration with the custom configuration..
	this.super_.extend(true,this.config,config);

}

/**
 * @var object configuration of the library
 */
wnLibrary.prototype.config = {};

/**
 * @var string path to the library source file
 */
wnLibrary.prototype.libraryFile = '';
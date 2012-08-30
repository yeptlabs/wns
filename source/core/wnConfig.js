/**
 * Source of the wnConfig class.
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
module.exports = wnConfig;
	
/**
 * Constructor
 * {description}
 * @param $file string path to the configuration file (file must be a json)
 */	
function wnConfig(file) {

	/**
	 * @extends: wnObject
	 */
	util.inherits(this,wnObject);

	// Se existir arquivo, carrega.
	file&&this.loadFromFile(file);

}

/**
 * Method for loading configuration from file.
 * @param $file string path to the configuration file (file must be a json)
 * @return boolean could load the file?
 */
wnConfig.prototype.loadFromFile = function (file) {

	try {

		// Carregar as configurações...
		var _data = fs.readFileSync(file);
			_data = JSON.parse(_data);

		// Extende as configurações...
		this.super_.extend(true,this,_data);

		return true;

	} catch (e) {

		return false;
		new wnError(e);

	}

}
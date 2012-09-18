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
	
// wnConfig Class
function wnConfig() {

	/**
	 * Constructor
	 * {description}
	 * @param $file string path to the configuration file (file must be a json)
	 */	
	this.construct = function (file) {

		// Se existir arquivo, carrega.
		file&&this.loadFromFile(file);

	};

	/**
	 * Method for loading configuration from file.
	 * @param $file string path to the configuration file (file must be a json)
	 * @return boolean could load the file?
	 */
	this.loadFromFile = function (file) {

		try {

			// Carregar as configurações...
			var _data = (fs.readFileSync(file,'utf8').toString())
						.replace(/\\/g,function () { return "\\"+arguments[0]; })
						.replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g,'');

				_data = JSON.parse(_data);
			
			// Extende as configurações...
			wnUtil.extend(true,this,_data);

			return true;

		} catch (e) {

			console.log(e);
			return false;

		}

	}

	// Construct function.
	this.construct.apply(this,arguments);

}
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
	constructor: function (file) {

		// Se existir arquivo, carrega.
		file&&this.loadFromFile(file);

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
	public: {},

	/**
	 * Methods
	 */
	methods: {
	
		/**
		 * Method for loading configuration from file.
		 * @param $file string path to the configuration file (file must be a json)
		 * @return boolean could load the file?
		 */
		loadFromFile: function (file) {

			try {

				// Carregar as configurações...
				var _data = (fs.readFileSync(file,'utf8').toString())
							.replace(/\\/g,function () { return "\\"+arguments[0]; })
							.replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g,'');

					_data = JSON.parse(_data);
				
				// Extende as configurações...
				Object.extend(true,this,_data);

				return true;

			} catch (e) {

				console.log(e);
				return false;

			}

		}

	}

};
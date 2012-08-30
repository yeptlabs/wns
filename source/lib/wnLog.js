/**
 * Source of the wnLog class.
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
module.exports = wnLog;
	
/**
 * Constructor
 * {description}
 * @param $scenario string the name of the message source scenario
 * @param $message string the message of the log
 */
function wnLog() {
	
	// Busca os argumentos cerrtos.
	var _msg=arguments[0] || '',
		_scenario = arguments[1]!=undefined && this.config.log[arguments[1]]!=undefined ? arguments[1] : 'global';

	// Imprime o log caso não tenha sido desativado o cenário
	if (this.config.log[_scenario]==true) console.log(_msg);

	// Verifica se será gravado log em arquivo:
	// TODO: Gravar log em arquivo.

}
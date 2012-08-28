// Função para impressão de log e debug.
module.exports = {
	
	// Busca os argumentos cerrtos.
	var _msg=arguments[0] || '',
		_scenario = arguments[1]!=undefined && this.config.log[arguments[1]]!=undefined ? arguments[1] : 'global';

	// Imprime o log caso não tenha sido desativado o cenário
	if (this.config.log[_scenario]==true) console.log(_msg);

	// Verifica se será gravado log em arquivo:
	// TODO: Gravar log em arquivo.

}
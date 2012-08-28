/*@
 * Classe: wnView
 * Desc: Estrutura padrão de uma view.
 */

// Exportar:
module.exports = wnView;

// Construtor:
function wnView() {

}

/*
module.exports = function () {

	// Alguma pré-definições.
	this.layout = ''; // Layout
	this.loadScript=[]; // Scripts a serem carregados.
	this.description = ''; // Descrição..
	this.keywords = ''; // Keywords

	// Função que redefine tudo...
	this.render = function () {	
		// Scripts.
		this.script = {};
		for (s in this.loadScript) {
			this.script[this.loadScript[s]] = "<script type='text/javascript'>\n"+((fs.readFileSync('./'+this.app.appPath+this.app.config.path.public+this.app.config.page.loadScriptPath+this.loadScript[s]+'.js')).toString())+"\n</script>";
		}
		// Menu
		_menu = '';
		for (m in this.app.config.page.menu) {
			_menu += new this.app.template(this.app.config.page.menuItemTemplate).match({'label':m,'url':this.app.config.page.menu[m][0]});
		}
		this.menu = new this.app.template(this.app.config.page.menuTemplate).match({'list':_menu});
		// Linguagem
		this.language = this.language || this.app.config.page.language;
		// Título da página.
		this.title = this.title || this.app.config.page.titleTemplate;

		return (new this.app.template(this.layout,false)).match({'page':this});
	}

};*/
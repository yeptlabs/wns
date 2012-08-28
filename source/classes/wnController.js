/*@
 * Classe: wnController
 * Desc: Estrutura padrão de um controller
 */

// Exportar:
module.exports = wnController;

// Construtor:
function wnController() {

	// Cria uma nova página..
	this.page=new wnPage();
	util.inherits(this.page, this);

}

/*


module.exports = {

	action: '',
	defaultAction: 'index',
	layout: 'main',
	actionIndex: function () {},
	response:'',

	// Função de construção...
	_construct: function () {
	

	
	},

	// Função que renderiza o controller.
	render: function (view,data) {

		var _controller=this.http.controller,
			_layout=this.layout;
			_view=view,
			_this=this;

		// Verifica se a view realmente existe...
		if (fs.existsSync('./'+this.app.appPath+this.app.config.path.views+this.http.controller+'/'+view+'.tpl')) {
			// Buscando templates...
			var _viewtpl=fs.readFileSync('./'+_this.app.appPath+_this.app.config.path.views+_controller+'/'+_view+'.tpl').toString(),
				_layouttpl=fs.readFileSync('./'+_this.app.appPath+_this.app.config.path.views+'layouts/'+_layout+'.tpl').toString();

			// Cria uma pagina temporária, com o layout padrão e joga a view.
			var _temppage = _this.page;
				// Importa o layout...
				_temppage.layout = (new _this.app.template(_layouttpl?_layouttpl:'{conteudo}',false)).match({'content':_viewtpl});

			// Renderiza a pagina temporaria.
			var	_contentAll=_temppage.render(),
				_contentAll=new _this.app.template(_contentAll,false).match(_this),
				_contentAll=new _this.app.template(_contentAll,false).match({self:_this});

			// Substitui data vinda do controller.
			_contentAll = (new _this.app.template(_contentAll,false)).match(data?data:{});

			// Salva o resultado..
			_this.response=_contentAll;

			// Envia resposta ao usuário.
			_this.send();
		} else {
			// Se não, retorna um erro e não modifica a resposta...
			this.app.log('View not found: '+_controller+'/'+view,'access');
			this.send();
		}
	}

};*/
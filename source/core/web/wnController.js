/**
 * Source of the wnController class.
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
module.exports = wnController;
	
/**
 * Constructor
 * {description}
 */	
function wnController(extend) {

	// Extends..
	this.super_=extend;

	// Creates a new View
	this.view=new this.super_.app.classes.wnView;
	this.view.super_=this;

}

/**
 * @var string the name of the default action to be loaded
 */
wnController.prototype.defaultAction = 'index';

/**
 * @var string the name of the default layout to be loaded
 */
wnController.prototype.layout = 'main';

/**
 * @var string string where it will be stored the response
 */
wnController.prototype.response = '';

/**
 * Default Index action.
 */
wnController.prototype.actionIndex=function () {};

/**
 * Renders the view.
 * @param $view string name of the view to be rendered
 * @param $data object data that will replaced in the template
 */
wnController.prototype.render=function (view,data) {

	var _controller=this.super_.controller,
		_layout=this.layout;
		_view=view;

	// Verifica se a view realmente existe...
	if (fs.existsSync(this.super_.app.appPath+this.super_.app.config.path.views+this.super_.controller+'/'+view+'.tpl')) {
		// Buscando templates...
		var _viewtpl=fs.readFileSync(this.super_.app.appPath+this.super_.app.config.path.views+_controller+'/'+_view+'.tpl').toString(),
			_layouttpl=fs.readFileSync(this.super_.app.appPath+this.super_.app.config.path.views+'layouts/'+_layout+'.tpl').toString();

			// Importa o layout...
			this.view.layout = (new this.view.template(_layouttpl?_layouttpl:'{conteudo}',false)).match({'content':_viewtpl});

			// Load the language from configuration
			this.view.language = this.super_.app.config.view.language;

			// Load the title template from configuration
			this.view.title = this.super_.app.config.view.titleTemplate;

		// Renderiza a pagina temporaria.
		var	_contentAll=this.view.render(),
			_contentAll=new this.view.template(_contentAll,false).match(this.super_),
			_contentAll=new this.view.template(_contentAll,false).match({self:this});


		// Substitui data vinda do controller.
		_contentAll = (new this.view.template(_contentAll,false)).match(data?data:{});

		// Salva o resultado..
		this.super_.data+=_contentAll;

		// Envia resposta ao usuário.
		this.super_.send();
	} else {
		// Se não, retorna um erro e não modifica a resposta...
		console.log('View not found: '+_controller+'/'+view,'access');
		this.super_.send();
	}
};
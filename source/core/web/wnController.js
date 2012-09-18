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

// wnController Class
function wnController(extend) {

	/**
	 * Constructor
	 * {description}
	 */
	this.construct = function (extend) {

		// Extends..
		this.request=extend;
		this.app=this.request.app;

		// Import all request queries.
		this.query=wnUtil.extend(true,this.query,{ POST: this.request.info.body });
		this.query=wnUtil.extend(true,this.query,{ GET: this.request.parsedUrl.query });
		this.query=wnUtil.extend(true,this.query.GET, this.request.route.params);

		// Creates a new View
		this.view=new this.app.c.wnView;
		this.view.super_=this;

	}

	/**
	 * @var object list of query
	 */
	this.query = {
		GET: {},
		POST: {}
	};

	/**
	 * @var wnApp instance
	 */
	this.app = undefined;

	/**
	 * @var wnHttpRequest instance
	 */
	this.request = undefined;

	/**
	 * @var string the name of the default action to be loaded
	 */
	this.defaultAction = 'index';

	/**
	 * @var string the name of the default layout to be loaded
	 */
	this.layout = 'main';

	/**
	 * @var string string where it will be stored the response
	 */
	this.response = '';

	/**
	 * Default Index action.
	 */
	this.actionIndex=function () {};

	/**
	 * Renders the view.
	 * @param $view string name of the view to be rendered
	 * @param $data object data that will replaced in the template
	 */
	this.render=function (view,data) {

		var _controller=this.request.controller,
			_layout=this.layout;
			_view=view;

		// Verifica se a view realmente existe...
		if (fs.existsSync(this.app.appPath+this.app.config.path.views+this.request.controller+'/'+view+'.tpl')) {
			// Buscando templates...
			var _viewtpl=fs.readFileSync(this.app.appPath+this.app.config.path.views+_controller+'/'+_view+'.tpl').toString(),
				_layouttpl=fs.readFileSync(this.app.appPath+this.app.config.path.views+'layouts/'+_layout+'.tpl').toString();

				// Importa o layout...
				this.view.layout = (new this.view.template(_layouttpl?_layouttpl:'{conteudo}',false)).match({'content':_viewtpl});

				// Load the language from configuration
				this.view.language = this.app.config.view.language;

				// Load the title template from configuration
				this.view.title = this.app.config.view.titleTemplate;

			// Renderiza a pagina temporaria.
			var	_contentAll=this.view.render(),
				_contentAll=new this.view.template(_contentAll,false).match(this),
				_contentAll=new this.view.template(_contentAll,false).match({self:this});

			// Substitui data vinda do controller.
			_contentAll = (new this.view.template(_contentAll,false)).match(data?data:{});

			// Salva o resultado..
			this.request.data+=_contentAll;

			// Envia resposta ao usuário.
			this.request.send();
		} else {
			// Se não, retorna um erro e não modifica a resposta...
			this.app.log.push('View not found: '+_controller+'/'+view,'access');
			this.request.send();
		}
	};

	// Construct function
	this.construct.apply(this,arguments);

}

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
	constructor: function (extend) {

		// Extends..
		this.request=extend;
		this.app=this.request.app;

		// Import all request queries.
		this.query=Object.extend(true,this.query,{ POST: this.request.info.body });
		this.query=Object.extend(true,this.query,{ GET: this.request.parsedUrl.query });
		this.query=Object.extend(true,this.query.GET, this.request.route.params);

		// Creates a new View
		this.view=new this.app.c.wnView;
		this.view.super_=this;

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
	public: {

		/**
		 * @var object list of query
		 */
		query: {
			GET: {},
			POST: {}
		},

		/**
		 * @var wnApp instance
		 */
		app: undefined,

		/**
		 * @var wnHttpRequest instance
		 */
		request: undefined,

		/**
		 * @var string the name of the default action to be loaded
		 */
		defaultAction: 'index',

		/**
		 * @var string the name of the default layout to be loaded
		 */
		layout: 'main',

		/**
		 * @var string string where it will be stored the response
		 */
		response: '',

		/**
		 * Default Index action.
		 */
		actionIndex: function () {}

	},

	/**
	 * Methods
	 */
	methods: {
	
		/**
		 * Renders the view.
		 * @param $view string name of the view to be rendered
		 * @param $data object data that will replaced in the template
		 */
		render: function (view,data) {

			var _controller=this.request.controller,
				_layout=this.layout;
				_view=view;

			// Verifica se a view realmente existe...
			if (fs.existsSync(this.app.appPath+this.app.config.path.views+this.request.controller+'/'+view+'.tpl')) {

				// Buscando templates...
				var _viewtpl=fs.readFileSync(this.app.appPath+this.app.config.path.views+_controller+'/'+_view+'.tpl').toString(),
					_layouttpl=fs.readFileSync(this.app.appPath+this.app.config.path.views+'layouts/'+_layout+'.tpl').toString();

					// Importa o layout...
					this.view.layout = (new this.app.c.wnTemplate(_layouttpl?_layouttpl:'{conteudo}',false)).match({'content':_viewtpl});

					// Load the language from configuration
					this.view.language = this.app.config.view.language;

					// Load the title template from configuration
					this.view.title = this.app.config.view.titleTemplate;

				// Renderiza a pagina temporaria.
				var	_contentAll=this.view.render(),
					_contentAll=new this.app.c.wnTemplate(_contentAll,false).match(this),
					_contentAll=new this.app.c.wnTemplate(_contentAll,false).match({self:this});

				// Substitui data vinda do controller.
				_contentAll = (new this.app.c.wnTemplate(_contentAll,false)).match(data?data:{});

				// Salva o resultado..
				this.request.data+=_contentAll;

				// Envia resposta ao usuário.
				this.request.send();
			} else {
				// Se não, retorna um erro e não modifica a resposta...
				new this.app.c.wnException('View template not found: '+_controller+'/'+view,404);
				this.request.send();
			}
		}


	}

};
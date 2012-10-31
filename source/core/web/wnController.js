/**
 * Source of the wnController class.
 * 
 * @author: Pedro Nasser
 * @link: http://wns.yept.net/
 * @license: http://yept.net/projects/wns/#license
 * @copyright: Copyright &copy; 2012 WNS
 */

/**
 * Description coming soon.
 *
 * @author Pedro Nasser
 * @package system.core.web
 * @since 1.0.0
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnComponent'],

	/**
	 * PRIVATE
	 */
	private: {},

	/**
	 * Public Variables
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
		 * @var string the name of the default layout to be loaded
		 */
		layout: 'main',

		/**
		 * @var string default action
		 */
		defaultAction: 'index',

		/**
		 * @var string string where it will be stored the response
		 */
		response: '',

		/**
		 * @var string controller title
		 */
		title: undefined

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 */	
		init: function ()
		{
			this.request=this.getConfig('request');
			this.app=this.getConfig('app');

			if (this.request)
			{
				this.query=Object.extend(true,this.query,{ POST: this.request.info.body });
				this.query=Object.extend(true,this.query,{ GET: this.request.parsedUrl.query });
				this.query=Object.extend(true,this.query.GET, this.request.route.params);
			}

			if (this.app)
				this.view=this.app.createClass('wnView',{ controller: this });
		},

		/**
		 * Default Index action.
		 */
		actionIndex: function () {},

		/**
		 * Resolve the action's method's name.
		 * @param $action string action's name
		 * @return mixed action's name or false.
		 */
		resolveAction: function (action)
		{	
			action = action+'';
			var actions = this.getActions();
			for (a in actions)
			{
				if (actions[a].toLowerCase() == 'action'+action.toLowerCase())
					{
						return actions[a];
					}
			}
			return false;
		},

		/**
		 * Get list of action of this controller
		 */
		getActions: function ()
		{		
			var actions = [];
			for (a in this)
			{
				if ((a+'').substr(0,6) == 'action')
					actions.push(a);
			}
			return actions;
		},
		
		/**
		 * Return the name of this controller.
		 * @return controller's name
		 */
		getControllerName: function ()
		{
			return this.getConfig('controllerName');
		},
	
		/**
		 * Renders the view.
		 * @param $view string name of the view to be rendered
		 * @param $data object data that will replaced in the template
		 */
		render: function (view,data) {

			var _controller=this.getControllerName(),
				_layout=this.layout;
				_view=view;

			// Verifica se a view realmente existe...
			if (_viewtpl=this.app.getFile(this.app.getConfig('path').views+_controller+'/'+view+'.tpl')) {

				// Buscando templates...
				var _layouttpl=this.app.getFile(this.app.getConfig('path').views+'layouts/'+_layout+'.tpl');

					// Importa o layout...
					this.view.layout = (new this.app.c.wnTemplate(_layouttpl?_layouttpl:'{conteudo}',false)).match({'content':_viewtpl});

					// Load the language from configuration
					this.view.language = this.app.getConfig('components').view.language;

					// Load the title template from configuration
					this.view.title = this.app.getConfig('components').view.titleTemplate;

				// Renderiza a pagina temporaria.
				var	_contentAll=this.view.render(),
					_contentAll=new this.app.c.wnTemplate(_contentAll,false).match({
						self: this,
						app: this.app.getConfig(),
						request: this.request.getConfig()
					});

				// Substitui data vinda do controller.
				_contentAll = (new this.app.c.wnTemplate(_contentAll,false)).match(data?data:{});

				// Salva o resultado..
				this.request.data+=_contentAll;

				// Envia resposta ao usuário.
				this.request.send();

			} else {
				// Se não, retorna um erro e não modifica a resposta...
				this.app.e.log('View template not found: '+_controller+'/'+view,404);
				this.request.send();
			}
		}


	}

};
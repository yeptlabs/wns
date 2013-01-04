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
		query: {},

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
			this.app=this.getParent();
			this.controllerName = this.getControllerName();

			if (this.request)
			{
				this.query.GET = {};
				this.query.POST = {};
				Object.extend(true,this.query.POST, this.request.info.body);
 				Object.extend(true,this.query.GET, this.request.parsedUrl.query);
				Object.extend(true,this.query.GET, this.request.route.params);
				for (g in this.query.GET)
				{
					this.query.GET[g]=this.query.GET[g].replace(/\+/gi,' ')
				}
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
		 * Get view file and return it.
		 * @param $view string name of the view to be rendered.
		 */
		getView: function (view,data)
		{
			var view = this.app.getFile(this.app.getConfig('path').views+this.getControllerName()+'/'+view+'.tpl');
				view = (new this.app.c.wnTemplate(view,false)).match(data?data:{});
			return view;
		},
	
		/**
		 * Renders the view.
		 * @param $view string name of the view to be rendered
		 * @param $data object data that will replaced in the template
		 */
		render: function (view,data)
		{
			var _controller=this.getControllerName(),
				_layout=this.layout;
				_view=view,
				_viewTpl=this.getView(view,data);

			if (_viewTpl!==false)
			{
				var _layoutTpl=this.app.getFile(this.app.getConfig('path').views+'layouts/'+_layout+'.tpl');

				this.view.name = view;
				this.view.layout = (new this.app.c.wnTemplate(_layoutTpl?_layoutTpl:'{conteudo}',false)).match({'content':_viewTpl});
				this.view.language = this.app.getConfig('components').view.language;
				this.view.title = this.app.getConfig('components').view.titleTemplate;

				var	_contentAll=this.view.render(),
					_contentAll=new this.app.c.wnTemplate(_contentAll,false).match({
						self: this.export(),
						app: this.app.export(),
						request: this.request.export()
					});

				_contentAll = (new this.app.c.wnTemplate(_contentAll,false)).match(data?data:{});

				this.request.data+=_contentAll;
				this.request.send();
			} else
			{
				this.app.e.log('View template not found: '+_controller+'/'+view,404);
				this.request.send();
			}
		}


	}

};
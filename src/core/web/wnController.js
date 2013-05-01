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
 * @package package.http
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
		title: undefined,

		/**
		 * @var string default events
		 */
		defaultEvents: {
			"beforeAction": {}
		},

		stateInputName: ''

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 */	
		init: function (config,c,app,request)
		{
			this.request=request;
			this.app=app;
			this.controllerName = this.getControllerName();
			this.setParent(app);
			this.prepareData();

			if (this.app)
			{
				this.view=this.app.createClass('wnView',{ controller: this });

				var engineName = this.getConfig('templateEngine') || 'Dust',
					tplEngine = this.app.c['wn'+engineName+'Template'];
				this.template= new tplEngine();
			}

			this.afterInit();
		},

		/**
		 * Prepare incoming data from GET or POST methods.
		 */
		prepareData: function ()
		{
			if (this.request)
			{
				this.query.GET = {};
				this.query.POST = { fields: {}, files: {} };
				this.query.REQUEST = {};
				Object.extend(true,this.query.POST, this.request.info.body);
 				Object.extend(true,this.query.GET, this.request.parsedUrl.query);
				Object.extend(true,this.query.GET, this.request.route.params);
				for (g in this.query.GET)
				{
					this.query.GET[g]=this.query.GET[g].replace(/\+/gi,' ')
				}
				for (p in this.query.POST.fields)
				{
					if (p.match(/\w+\[\w+\]/g))
					{
						var name = p.split("[")[0],
							subname = p.split("[")[1].split(']')[0];
						if (!this.query.POST.fields[name])
							this.query.POST.fields[name]={};
						this.query.POST.fields[name][subname]=this.query.POST.fields[p];
						delete this.query.POST.fields[p];
					}
				}
				for (p in this.query.GET)
				{
					if (p.match(/\w+\[\w+\]/g))
					{
						var name = p.split("[")[0],
							subname = p.split("[")[1].split(']')[0];
						if (!this.query.GET[name])
							this.query.GET[name]={};
						this.query.GET[name][subname]=this.query.GET[p];
						delete this.query.GET[p];
					}
				}
				Object.extend(true,this.query.REQUEST, this.query.GET, this.query.POST);
			}
		},

		/**
		 * After initialization
		 */	
		afterInit: function ()
		{
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
						this.resolvedAction = action;
						action=actions[a];
						this.once('beforeAction',function () {
							self[action]&&self[action]();
						});
						this.e.beforeAction();
						return true;
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
		getView: function (view,cb)
		{
			this.app.getFile(this.request.getConfig('path').views+this.getControllerName()+'/'+view+'.tpl',cb);
		},
	
		/**
		 * Renders the view.
		 * @param $view string name of the view to be rendered
		 * @param $data object data that will replaced in the template
		 */
		render: function (view,data)
		{
			var _controller=this.getControllerName(),
				_layout=this.layout,
				templateObj = {};

			Object.extend(true,templateObj,data?data:{});

			this.getView(view,function (viewTpl) {
				if (viewTpl!==false)
				{
					self.view.name = view;
					self.view.language = self.app.getConfig('components').view.language;
					self.view.title = self.app.getConfig('components').view.titleTemplate;
					
					self.view.render(function () {
						Object.extend(true,templateObj,{
							self: self.export(),
							app: self.app.export(),
							request: self.request.export(),
							view:self.view.export()
						});
						self.app.getFile(self.request.getConfig('path').views+'layouts/'+_layout+'.tpl',function (layoutTpl) {
							var layoutTpl = layoutTpl.replace(/{content}/i,viewTpl);
							self.template.render(layoutTpl, templateObj, function (err,result) {
								self.request.data+=result;
								self.request.send();
							});
						});
					});
				} else
				{
					self.app.e.log('View template not found: '+_controller+'/'+view,404);
					self.request.send();
				}
			});
		}

	}

};
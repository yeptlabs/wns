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
		title: 'Page',

		/**
		 * @var string default events
		 */
		defaultEvents: {
			"beforeAction": {}
		},

		/**
		 * @var client's scripts
		 */
		clientScript: [],

		/**
		 * @var embeded client's scripts
		 */
		embedScript: [],

		/**
		 * @var embed script tag. (regexp)
		 */
		embedScriptTag: /\<\[SCRIPT\]\>/gim

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
				this.template = app.template;
				this.view=this.app.createClass('wnView',{ controller: this });
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
				this.query.GET = this.request.query.GET;
				this.query.POST = this.request.query.POST;
				this.query.REQUEST = this.request.query.REQUEST;
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
						this.resolvedAction = this.action = action;
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
			var fileName = this.request.getConfig('path').views+this.getControllerName()+'/'+view+'.tpl',
				lastModif = this.app.cache.get('template-'+self.getControllerName()+'/'+view);
			if (lastModif)
			{
				fs.stat(this.app.modulePath+fileName,function (err,stats) {
					if (err!==null)
						cb&&cb(false);
					else if (stats.mtime.getTime() > lastModif)
					{
						self.app.cache.set('template-'+self.getControllerName()+'/'+view,false);
						self.app.getFile(fileName,cb);
					}
					else
						cb&&cb('')
				});
			} else
				this.app.getFile(fileName,cb);
		},

		/**
		 * Get layout file and return it.
		 * @param $view string name of the view to be rendered.
		 */
		getLayout: function (layout,cb)
		{
			if (layout==null)
				return cb&&cb('');

			var fileName = this.request.getConfig('path').views+'layouts/'+layout+'.tpl',
				lastModif = this.app.cache.get('template-layout-'+layout);
			if (lastModif)
			{
				fs.stat(this.app.modulePath+fileName,function (err,stats) {
					self.request.stat=stats;
					if (err!==null)
						cb&&cb(false);
					else if (stats.mtime.getTime() > lastModif)
					{
						self.app.cache.set('template-layout-'+view,false);
						self.app.getFile(fileName,cb);
					}
					else
						cb&&cb('')
				});
			} else
				this.app.getFile(fileName,cb);
		},
	
		/**
		 * Renders the view.
		 * @param $view string name of the view to be rendered
		 * @param $data object data that will replaced in the template
		 */
		render: function (view,data)
		{
			var _controller=this.getControllerName();
			var layout=this.layout;
			var templateObj = {};
			var renderLayout;
			var data = Object.extend(true,{},data||{});

			Object.extend(true,templateObj,data,{
				self: self.export(),
				app: self.app.export(),
				request: self.request.export(),
			});

			process.nextTick(function () {
				self.getView(view,function (viewTpl) {
					if (viewTpl!==false)
					{
						//console.log('got view')
						self.view.name = view;
						self.view.language = self.app.getConfig('components').view.language;
						self.view.title = (new self.app.c.wnTemplate(self.app.getConfig('components').view.titleTemplate)).match(templateObj);
						self.view.layout = viewTpl;
						self.view.data = templateObj;
						
						self.view.render(function (viewTpl) {
							//console.log('render view')
							self.getLayout(layout,function (layoutTpl) {
								//console.log('got layout')

								templateObj.view = self.view.export();
								templateObj.content = function (chunk) {
									return chunk.write(this.html);
								}.bind({ html: viewTpl });

								var stream=self.template.render({
									name: 'layout-'+layout,
									source: layoutTpl
								}, templateObj, function (err,renderLayout) {

									var data = stream.data.toString('utf8');
									if (data.match(self.embedScriptTag) && (self.clientScript.length>0 || self.embedScript.length>0))
									{

										var html = '';
										for (c in self.embedScript)
											html+='<script type="text/javascript" src="'+self.embedScript[c]+'"></script>';

										for (c in self.clientScript)
											html+='<script type="text/javascript">'+self.clientScript[c]+'</script>';

										data=data.replace(self.embedScriptTag,html);

									}

									self.request.send(data);
								});
								/*if (stream)
									stream.on('data',function (chunk) {
										self.request.write(chunk);
									});*/
							});
						});
					} else
					{
						self.app.e.log('View template not found: '+_controller+'/'+view,404);
						self.request.e.error(404);
					}
				});
			});
		}

	}

};
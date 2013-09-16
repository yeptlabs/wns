/**
 * @WNS - The NodeJS Middleware and Framework
 * 
 * @copyright: Copyright &copy; 2012- YEPT &reg;
 * @page: http://wns.yept.net/
 * @docs: http://wns.yept.net/docs/
 * @license: http://wns.yept.net/license/
 */

/**
 * No description yet.
 *
 * @author Pedro Nasser
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
			"beforeAction": {},
			"renderView": { handler: '_renderView' },
			"renderLayout": { handler: '_renderLayout' },
			"send": { handler: '_send' }
		},

		/**
		 * @var object with every key that will be matched in the template
		 */
		templateObj: {},

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
			if (!request)
				return false;

			this.request=request;
			this.app=app;
			this.controllerName = this.getControllerName();
			this.setParent(app);
			this.prepareData();

			_logName = 'ctrl::'+this.getControllerName().toLowerCase();

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
			self.debug('Storing QUERY to controller.',3);
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
						_logName = this.getControllerName().toLowerCase()+'/'+action;
						this.resolvedAction = this.action = action;
						action=actions[a];
						self.debug('Resolved ACTION method: '+action,1);
						this.once('beforeAction',function () {
							self[action]&&self[action]();
						});
						this.e.beforeAction(action);
						return true;
					}
			}
			self.warn('ACTION method NOT FOUND!');
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
			self.debug('Loading VIEW content:'+ view,3);
			var fileName = this.getConfig('path').views+this.getControllerName()+'/'+view+'.tpl',
				lastModif = this.app.cache.get('template-'+self.uid);
			if (lastModif)
			{
				if (WNS_DEV)
				{
					self.debug('DEV-MODE :: Ignoring VIEW CACHED edition',3);
					fs.stat(this.app.modulePath+fileName,function (err,stats) {
						if (err!==null)
							cb&&cb(false);
						else if (stats.mtime.getTime() > lastModif)
						{
							self.app.cache.set('template-'+self.uid,+new Date);
							self.app.getFile(fileName,cb);
						}
						else
						{
							self.debug('Using CACHED version',3);
							cb&&cb('')
						}
					});
				}
				else {
					self.debug('Using CACHED version',3);
					cb&&cb('');
				}
			} else
			{
				self.app.cache.set('template-'+self.uid,+new Date);
				self.debug("Caching view's last modification",3);
				this.app.getFile(fileName,cb);
			}
		},

		/**
		 * Get layout file and return it.
		 * @param $view string name of the view to be rendered.
		 */
		getLayout: function (layout,cb)
		{
			if (layout==null)
				return cb&&cb('');

			self.debug('Loading LAYOUT content: '+layout,3);
			var fileName = this.getConfig('path').views+'layouts/'+layout+'.tpl',
				lastModif = this.app.cache.get('template-layout-'+layout);
			if (lastModif)
			{
				if (WNS_DEV)
				{
					self.debug('DEV-MODE :: Ignoring LAYOUT CACHED version',3);
					fs.stat(this.app.modulePath+fileName,function (err,stats) {
						self.request.stat=stats;
						if (err!==null)
							cb&&cb(false);
						else if (stats.mtime.getTime() > lastModif)
						{
							self.app.cache.set('template-layout-'+layout,+new Date);
							self.app.getFile(fileName,cb);
						}
						else
						{
							self.debug('Using CACHED version',3);
							cb&&cb('')
						}
					});
				}
				else
				{
					self.debug('Using CACHED version',3);
					cb&&cb('');
				}
			} else
			{
				self.app.cache.set('template-layout'+layout,+new Date);
				self.debug("Saving VIEW's last modification",3);
				this.app.getFile(fileName,cb);
			}
		},

		/**
		 * Default handler for sending the rendered data.
		 */
		_send: function (e,data,stream)
		{
			var data = stream.data.toString('utf8');
			if (data.match(self.embedScriptTag) && (self.clientScript.length>0 || self.embedScript.length>0))
			{
				self.debug('EMBEDING scripts before send.',3);
				var html = '';
				for (c in self.embedScript)
					html+='<script type="text/javascript" src="'+self.embedScript[c]+'"></script>';

				for (c in self.clientScript)
					html+='<script type="text/javascript">'+self.clientScript[c]+'</script>';

				data=data.replace(self.embedScriptTag,html);
			}

			self.debug('SENDING rendered result to request',3);
			self.request.send(data);
		},

		/**
		 * Default handler for rendering the layout.
		 */
		_renderLayout: function (e,layoutTpl)
		{
			self.debug('Rendering LAYOUT',2);
			self.templateObj.view = self.view.export();
			self.layoutTpl = layoutTpl;

			var stream=self.template.render({
				name: 'layout-'+self.layout,
				source: self.layoutTpl
			}, self.templateObj, function (err,data) {
				// GOTO: _render
				self.e.send(data,stream);
			});
		},

		/**
		 * Default handler for rendering the view.
		 */
		_renderView: function (e,view)
		{
			self.debug('Rendering VIEW',2);
			self.view.language = self.app.getConfig('components').view.language;
			if (self.view.title == null)
				self.view.title = (new self.app.c.wnTemplate(self.app.getConfig('components').view.titleTemplate)).match(self.templateObj);
			self.view.layout = self.viewTpl;
			self.view.data = self.templateObj;
			
			self.view.render(function (viewTpl) {
				self.viewTpl = viewTpl;
				self.templateObj.content = function (chunk) {
					return chunk.write(this.html);
				}.bind({ html: viewTpl });

				self.getLayout(self.layout,function (layoutTpl) {
					// GOTO: _renderLayout
					self.e.renderLayout(layoutTpl);
				});
			});
		},
	
		/**
		 * Renders the view.
		 * @param $view string name of the view to be rendered
		 * @param $data object data that will replaced in the template
		 */
		render: function (view,data)
		{
			if (self.request.sent||self.request.closed)
				return false;

			self.debug('Start the RENDER',2);
			self.viewTpl = '';
			self.layoutTpl = '';
			self.uid = self.controllerName+'-'+self.action+'-'+self.layout+'-'+view;
			self.view.name = view;

			var _controller=this.getControllerName();
			var layout=this.layout;
			var templateObj = {};
			var renderLayout;
			var data = Object.extend(true,{},data||{});

			self.templateObj = templateObj;

			Object.extend(true,templateObj,data,{
				self: self.export(),
				app: self.app.export(),
				request: self.request.export(),
			});

			process.nextTick(function () {
				self.getView(view,function (gotView) {
					if (gotView!==false)
					{
						self.viewTpl = gotView;

						// GOTO: _renderView
						self.e.renderView(gotView);
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
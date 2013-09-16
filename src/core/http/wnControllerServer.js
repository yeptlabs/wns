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
	 * Private
	 */
	private: {
		_server: null,
		_controllers: [],
		_config: {
			defaultController:"site",
			errorPage: "site/error",
			path: {
				controllers: "controllers/",
				views: "views/"
			}
		}
	},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'open': {},
			'error': {},
			'send': {}
		}

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
			this.app = this.getParent();
			this.attachEvents(this.app);
		},
		
		/**
		 * Attach events to the application
		 */
		attachEvents: function (app)
		{
			self.debug('Attaching events to the parent application',0);
			if (!_(app).isObject())
				return false;
			app.prependListener('runRequest',function (e,req) {
				if (req.template.split("/").length>1 || req.template == '')
				{
					self.processRequest(req);
					e.stopPropagation=true;
				}
			});
		},

		/**
		 * Process the request
		 */
		processRequest: function (req)
		{
			req.header['Content-Type']='text/html';

			var _p=(req.route.translation).split('/');
			var _plen = _p.length;
			var _controller=_plen>0&&_p[1]!=''?_p[1]:undefined;
			var _action=_plen>1&&_p[2]!=''?_p[2]:undefined;
			var ctrlName = (_controller !== undefined && _controller !== 'undefined') ? _controller : this.getConfig('defaultController');

			req.prependOnce('error',function (e,status) {
				if (status == 404 && self.getConfig('errorPage')!=undefined)
				{
					self.debug('Redirecting to ERROR PAGE...',2);
					req.route.translation = '/'+self.getConfig('errorPage');
					self.processRequest(req);
					e.stopPropagation=true;
					return;
				}
			});

			req.controller=this.getController(ctrlName,req);

			if (!req.controller)
			{
				req.e.error(404,'Controller not found');
				return;
			}

			_action=req.action=(!_action?req.controller.defaultAction:_action);
			if (req.controller.resolveAction(_action)==false)
			{
				req.e.error(404,'Action not found');
			}
		},

		/**
		 * Flush all loaded application's controllers cache
		 */
		flushControllers: function () {
			for (c in _controllers)
				this.c['wn'+(c.substr(0,1).toUpperCase()+c.substr(1))+'Controller']=undefined;
			this.debug('All controllers has been flushed.',1);
		},

		/**
		 * Flush an application's controller cache
		 * @param string $c controller's name
		 */
		flushController: function (c) {
			this.c['wn'+(c.substr(0,1).toUpperCase()+c.substr(1))+'Controller']=undefined;
			this.debug('Controller ´'+c+'´ has been flushed.',1);
		},

		/**
		 * Get a new or cached instance from a controller.
		 * @param $id string controller's id
		 * @return wnController
		 */
		getController: function (id,req)
		{
			id = id.toLowerCase();
			var controllerName = 'wn'+(id.substr(0,1).toUpperCase()+id.substr(1))+'Controller';
			var classProto = this.app.c[controllerName];
			if (_(classProto).isUndefined()) {
				self.debug('Loading CONTROLLER from system: '+id,1);
				var controllerFile = this.getConfig('path').controllers+id+'.js';
				var builder = this.app.getComponent('classBuilder');
				if (fs.existsSync(this.app.modulePath+controllerFile))
				{
					var classSource = this.app.getFile(controllerFile);
					builder.addSource(controllerName,classSource);
					builder.classes[controllerName]=builder.buildClass(controllerName);
					builder.makeDoc(controllerName);
					if (!builder.classes[controllerName])
						this.app.e.exception(new Error('Could not build the controller class.'));
					this.app.c[controllerName]=builder.classes[controllerName];
					_controllers[id]=this.app.c[controllerName];
					classProto = this.app.c[controllerName];
				} else
				{
					return false;
				}
			}
			var config = { controllerName: id, verbosity: _verbosity, debug: _debug, path: this.getConfig('path') };
				controller = new classProto(config,this.app.c,this.app,req);
			return controller;
		}
	}
};	
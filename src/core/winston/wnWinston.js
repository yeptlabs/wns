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
	 * NPM Requires
	 */
	dependencies: ['winston'],

	/**
	 * PRIVATE
	 */
	private: {

		/**
		 * Default config
		 */
		_config: {
			catchErrors: true,
			transports: {
				"Console": { colorize: true },
				"File": { filename: 'app.log', maxsize: 1024*1024*10, maxFiles: 3, json: false }
			}
		}

	},

	/**
	 * Public Variables
	 */
	public: {},

	/**
	 * Methods
	 */
	methods: {

		init: function ()
		{
			var app = self.getParent();
			var transps = self.getTransports();
			self.debug('Starting WINSTON...',1);

			self.logger = new winston.Logger({
				transports: transps
			});

			self.bindModule(app);

			if (self.getConfig('catchErrors'))
			{
				self.debug('Catching ERRORS mode ON',1);
				wns.console.prependListener('exception',function (e,err) {
					self.debug('Error LOGGED.',5);
					e.stopPropagation=true;
					self.logger.log.call(self.logger,'error',err.stack);
				});
			}
		},

		bindModule: function (module,name)
		{
			module.prependListener('log', function (e,msg,zone) {
				var level = (zone=='error' ? 'error' : 'info');
				self.logger.log.call(self.logger,level,'['+e.owner.getConfig('id')+'] '+msg||'');
				e.stopPropagation=true;
			});
		},

		getTransports: function ()
		{
			var transp = [];
			var trs = self.getConfig('transports');
			for (t in trs)
			{
				if (trs[t].filename)
				{
					trs[t].filename = self.getParent().modulePath+trs[t].filename;
					if (fs.existsSync(trs[t].filename))
					fs.unlinkSync(trs[t].filename);
				}
				self.debug('Adding new transport: '+t,3);
				transp.push(new (winston.transports[t])( trs[t] ));
			}
			return transp;
		}

	}

};
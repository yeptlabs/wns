/**
 * Source of the wnLog class.
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
 * @package package.mysql
 * @since 1.0.0
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
	dependencies: ['winston','winston-mongodb'],

	/**
	 * PRIVATE
	 */
	private: {

		/**
		 * Default config
		 */
		_config: {
			catchErrors: true,
			transports: [
				{ name: 'Console', colorize: true },
				{ name: 'File', filename: 'app.log', maxsize: 1024*1024*10, maxFiles: 3, json: false }
			]
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
			winston.transports.MongoDB = winston_mongodb.MongoDB;
			
			var app = self.getParent();
			var transps = self.getTransports();
			app.e.log(' - Starting the LOG SYSTEM (winston)...');

			self.logger = new winston.Logger({
				transports: transps
			});

			self.bindModule(app);

			if (self.getConfig('catchErrors'))
			{
				wns.console.prependListener('exception',function (e,err) {
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
				if (!trs[t].name)
					continue;
				if (trs[t].filename)
				{
					trs[t].filename = self.getParent().modulePath+trs[t].filename;
					if (fs.existsSync(trs[t].filename))
					fs.unlinkSync(trs[t].filename);
				}
				transp.push(new (winston.transports[trs[t].name])( trs[t] ));
			}
			return transp;
		}

	}

};
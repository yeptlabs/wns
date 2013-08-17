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
	private: {
		_authKey: true
	},

	/**
	 * Public Variables
	 */
	public: {
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
			var parentId = this.getParent().getConfig('id');
			_authKey = crypto.createHash('sha1').update((this.getConfig('port')||'')+''+parentId+''+(+new Date)).digest('hex');
			this.ping();
			this.listen();
		},

		/**
		 * Listen a sync communication server
		 */	
		listen: function ()
		{
			console.log(this.getConfig('port'));
			this.syncServer=http.createServer(function (req,res) {
				console.log(req.data);
				res.end('');
			}).listen(65465,'127.0.0.1',function(){
				console.log('lol')
			});
		},

		/**
		 * Send to the WNSPM the instanceKey the SYNC address
		 */	
		ping: function ()
		{
			request('http://wnspm.yept.net/package/ping?key='+this.getKey()+'&port='+this.getConfig('port'),function (error,response,body) { console.log('PINGED') });
		},

		/**
		 * Return instanceKey...
		 */
		getKey: function ()
		{
			return _authKey;
		}

	}

};
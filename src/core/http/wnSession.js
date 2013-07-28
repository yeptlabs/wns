/**
 * Source of the wnSession class.
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
	private: {
		_preCookie: 'path=/; '
	},

	/**
	 * Public Variables
	 */
	public: {},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 */	
		init: function ()
		{
			this.getParent().prependListener('readyRequest',function (e,req) {
				req.prependOnce('run',function () {
					if (req.info.headers.cookie)
					{
						cookies = req.cookies;
						var reqId=cookies['wns-session-id'];
						if (reqId)
						{
							var sessionData = self.getParent().cache.get('wns-session-'+reqId);
							if (sessionData)
								req.user=sessionData;
						}
					}
				});
				req.prependOnce('send',function () {
					var reqId = self.getId(req);
					if (req.user && req.user.logout)
					{
						req.header['Set-Cookie']='wns-session-id=deleted; path=/;';
						self.getParent().cache.set('wns-session-'+reqId,false);
					} else if (req.user && req.user.auth)
					{
						req.header['Set-Cookie']='wns-session-id='+reqId+'; path=/;';
						self.getParent().cache.set('wns-session-'+reqId,req.user);
					}
				})
			});
		},

		/**
		 * Get request's session-id.
		 */
		getId: function (req)
		{
			var reqUser = req.user && req.user.id ? req.user.id : 'none';
			return crypto.createHash('md5').update(req.remoteAddress+''+reqUser).digest("hex");
		}
		
	}

};
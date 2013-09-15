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
		_config: {
			pathCookie: 'path=/;',
			cookieName: 'wns-session-id',
			ttlSession: 1000*60*5
		}
	},

	/**
	 * Public Variables
	 */
	public: {
		_pathCookie: '',
		_cookieName: '',
		_ttlSession: 1000
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
			_pathCookie = _config.pathCookie;
			_cookieName = _config.cookieName;
			_ttlSession = _config.ttlSession;

			this.getParent().prependListener('runRequest',function (e,req) {

				if (req.template == '<file>')
					return false;

				if (req.info.headers.cookie)
				{
					cookies = req.cookies;
					var reqId=cookies[_cookieName];
					self.debug('LOOK for session: '+reqId,1)

					if (reqId)
					{
						self.debug('GOT session!',1)
						var sessionData = self.getParent().cache.get('wns-session-'+reqId);
						if (sessionData)
						{
							if (+new Date - +new Date(sessionData._created) >= _ttlSession)
							{
								self.debug('RENEW session!',1);
								self.createSession(req,sessionData,function () {
									self.renewToken(req);
									self.debug('COOKING session',1)
									req.response.setHeader('Set-Cookie',_cookieName+'='+req.user._sid+'; '+_pathCookie);
								});
							}

							req.user=sessionData;
						}
						else
							self.debug('KILLED session.',1)
					}
				}

				if (!req.user)
				{
					self.createSession(req,{},function () {
						self.renewToken(req);
						self.debug('COOKING session',1)
						req.response.setHeader('Set-Cookie',_cookieName+'='+req.user._sid+'; '+_pathCookie);
					});
				} else {
					self.renewToken(req);
				}
			});

			this.getParent().prependListener('readyRequest',function (e,req) {

				if (req.template == '<file>')
					return false;

				req.prependOnce('send',function () {
					if (req.user && req.user._sid && self.getParent().cache.get('wns-session-'+req.user._sid))
					{
						self.debug('UPDATE session',1);
						var sessionData = self.getParent().cache.get('wns-session-'+req.user._sid);							

						for (p in req.user)
						{
							sessionData[p]=req.user[p];
						}

						self.getParent().cache.set('wns-session-'+req.user._sid,sessionData);
					}
				})
			});
		},

		/**
		 * Create a new session to the user.
		 * @param object $req request
		 * @param object $data session data
		 * @param function $cb callback
		 * @return self
		 */
		createSession: function (req,data,cb)
		{
			if (!_(req).isObject())
				return cb&&cb(false);

			self.getId(req,function (id) {

				var logged = false;
				var token = '';

				self.debug('CREATING session',1);
				req.user = data || { data: { time: +new Date } };

				if (!req.user.data)
					req.user.data = {};

				if (data._sid)
				{
					token = data._token;
					logged = data._logged;
					self.getParent().cache.set('wns-session-'+data._sid,undefined)
				}

				Object.defineProperty(req.user,'_sid', { value: id, enumerable: false, writable: false, configurable: true });
				Object.defineProperty(req.user,'_token', { value: '', enumerable: false, writable: true, configurable: true });

				function validateToken(tok) {
					if (!_(tok).isString())
						return false;

					return tok == req.user._token;
				}
				Object.defineProperty(req.user,'_validate', { value: validateToken, enumerable: false, writable: false, configurable: true });
				Object.defineProperty(req.user,'_created', { value: +new Date, enumerable: false, writable: false, configurable: true });
				Object.defineProperty(req.user,'_logged', {
					get: function () {
						return logged
					},
					set: function (val) {
						if (Boolean(val) == true)
						{
							logged=true;
						}
						else {
							self.debug('KILLING session',1)
							self.getParent().cache.set('wns-session-'+id,undefined)
							logged=false;
						}
					},
					enumerable: false, configurable: true
				});

				self.getParent().cache.set('wns-session-'+id,req.user)
				cb&&cb();
			});

			return self;
		},

		/**
		 * Renew the token of the session;
		 * @param object $req request
		 */
		renewToken: function (req)
		{
			self.debug('TOKEN session',1);
			var reqUser = req.user && req.user.id ? req.user.id : '';
			var uid = req.remoteAddress+''+reqUser+''+Math.floor(100000000+Math.random()*100000000)+''+new Date;
			var token = crypto.createHash('md5').update(uid).digest("hex");
			req.user._token = token;
		},

		/**
		 * Get request's new session id. (NEED TO CHANGE HASH CREATION)
		 * @param object $req request
		 * @param function $cb callback [optional]
		 * @return string
		 */
		getId: function (req,cb)
		{
			var reqUser = req.user && req.user.id ? req.user.id : '';
			var uid = req.remoteAddress+''+reqUser+''+Math.floor(100000000+Math.random()*100000000)+''+new Date;
			if (cb)
				return cb&&cb(crypto.createHash('md5').update(uid).digest("hex"));
			else
				return crypto.createHash('md5').update(uid).digest("hex");
		}
		
	}

};
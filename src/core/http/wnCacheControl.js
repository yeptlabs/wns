/**
 * Source of the wnCacheControl class.
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
		_servers: [],
		_serverTurn: 0,
		_cacheCount: 0
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
			_serverTurn=0;
			_cacheCount=0;
		},

		/**
		 * Define a new cache server to the cacheControl.
		 * @param $server object cache server instance
		 */
		attachServer: function (server,weight)
		{
			if (!server instanceof Object)
				return false;
			weight=new Number(weight||1);
			server.flush();
			_servers.push({ instance: server, weight: weight, count:0, data: [] });
			return this;
		},

		/**
		 * Remove a cache server from the cacheControl
		 * @param $server object cache server instance
		 */
		removeServer: function (server)
		{
			if (!server instanceof Object)
				return false;
			for (s in _servers)
			{
				if (_servers[s]==server)
					_servers.splice(s);
			}
			return this;
		},

		/**
		 * Return the server of the turn.
		 * @param $name string cache key
		 * @return $server object cache server instance.
		 */
		getTurn: function (name)
		{
			var turn = _serverTurn,
				newTurn = -1,
				bigDif=null,
				noCount = false;
			for (s in _servers)
			{
				var count = _servers[s].count,
					dif = (_servers[s].weight*_cacheCount)-count;
				if (dif > bigDif || bigDif == null)
				{
					bigDif = dif;
					newTurn = s;
				}
				if (name && _servers[s].data[name])
				{
					turn = s;
					noCount = true;
					break;
				}
			}
			if (!noCount)
			{
				_serverTurn=newTurn;
				_cacheCount++;
				_servers[turn].count++;
			}
			return turn;
		},

		/**
		 * Save a information to the right cache server.
		 * @param $name string key of the cache
		 * @param $value mixed cache information
		 * @param $cb function callback
		 */
		setCache: function (name,value,cb)
		{
			var selected = this.getTurn(name),
				cacheControl = _servers[selected].instance,
				name = name+'',
				value = value+'';
			_servers[s].data[name]=true;
			return cacheControl.set(name,value,cb);
		},

		/**
		 * Get a information from the correct cache server.
		 * @param $name string key of the cache
		 * @param $cb function callback
		 */
		getCache: function (name,value,cb)
		{
			var selected = this.getTurn(name),
				cacheControl = _servers[selected].instance,
				name = name+'',
				value = value+'';
			return cacheControl.get(name,value,cb);
		},

		/**
		 * Return the ETag for the respective file stat object.
		 * @param $stat object file stat object
		 * @return etag string
		 */
		getEtag: function (stat) {
			if (!stat instanceof Object)
				return false;
			return JSON.stringify([stat.ino, stat.size, stat.mtime].join('-'));
		},

		/**
		 * Define a cache-control headers of the request.
		 * @param $req object Request instance
		 */
		defineHeaders: function (req) {
			if (!req.stat)
				return false;
			req.header['Last-Modified']	= new (Date)(req.stat.mtime).toUTCString();
			req.header['ETag']			= self.getEtag(req.stat);
		    req.header['date']			= new(Date)().toUTCString();
		},

		/**
		 * Check if 'checkModif' is enabled and if the life of the cache ended.
		 * @param $req object Request instance
		 * @return boolean
		 */
		checkModif: function (req)
		{
			var lastCheck = self.getCache('request-check-'+req.info.url);
			if (self.getConfig('checkModif') && lastCheck && ((+new Date)-lastCheck <= self.getConfig('checkInterval')))
				return true;
			return false;
		},

		/**
		 * Check if the file request has been modified;
		 * @param $req object Request instance
		 * @return boolean the file has been modified?
		 */
		checkModified: function (req)
		{
			var etag = self.getCache('request-etag-'+req.info.url);
			if (etag && req.info.headers['if-none-match'] === etag && self.checkModif(req))
				return false;
			return true;
		},

		/**
		 * Send to the request a CACHE signal;
		 * @param $req Object request instance
		 * @param $cb function callback
		 */
		sendCached: function (req,cb)
		{
			req.code = 304;
			self.defineHeaders(req);
			req.send();
			cb&&cb(true);
		},

		/**
		 * Clear all cached information of a request
		 * @param $req Object request instance
		 */
		clearCached: function (req)
		{
			self.setCache('request-'+req.info.url,false);
			self.setCache('request-etag-'+req.info.url,false);
			self.setCache('request-modif-'+req.info.url,false);
			self.setCache('request-check-'+req.info.url,false);
		},

		/**
		 * Prepare to send the modified.
		 * @param $req Object request instance
		 */
		prepareModified: function (req)
		{
			self.defineHeaders(req);
			self.setCache('request-'+req.info.url,req.data);
			self.setCache('request-etag-'+req.info.url,self.getEtag(req.stat));
			self.setCache('request-modif-'+req.info.url,req.stat.mtime);
			self.setCache('request-check-'+req.info.url,+new Date);
		},

		/**
		 * Send to the request a CACHE signal;
		 * @param $req Object request instance
		 * @param $cb function callback
		 */
		sendModified: function (req,cb)
		{
			req.once('send',function () {
				if (!req.stat)
					return cb&&cb(false);

				self.prepareModified(req);
				cb&&cb(false);
			},true);

			// req.once('end',function () {
			// 	console.log(req.stat);

			// 	if (!req.stat)
			// 		return false;
			// 	if (req.stat)
			// 	{
			// 		self.setCache('request-'+req.info.url,req.data);
			// 		self.setCache('request-etag-'+req.info.url,self.getEtag(req.stat));
			// 		self.setCache('request-modif-'+req.info.url,req.stat.mtime);
			// 		self.setCache('request-check-'+req.info.url,+new Date);
			// 		console.log('cached');
			// 	}
			// 	cb&&cb(false);
			// },true);
		},

		/**
		 * Check the request to send it to the right handler.
		 * @param $req Object request instance
		 * @param $cb function callback
		 */
		cacheRequest: function (req,cb)
		{
			if (!req.cacheable)
				return cb&&cb(false);

			if (self.checkModified(req))
				self.sendModified(req,cb);
			else
				self.sendCached(req,cb);
		}

	}

};

module.exports.disattachServer = module.exports.removeServer;
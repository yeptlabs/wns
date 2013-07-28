	/**
 * Source of the wnCache class.
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
 * @package package.cache
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
		 * @var string string that prefix every cache key
		 */
		keyPrefix: undefined,
		
		/**
		 * @var boolean whether to md5-hash the cache key for normalization purposes. Defaults to true. Setting this property to false makes sure the cache
		 * key will not be tampered when calling the relevant methods {@link get()}, {@link set()}, {@link add()} and {@link delete()}. This is useful if a Yii
		 * application as well as an external application need to access the same cache pool (also see description of {@link keyPrefix} regarding this use case).
		 * However, without normalization you should make sure the affected cache backend does support the structure (charset, length, etc.) of all the provided
		 * cache keys, otherwise there might be unexpected behavior.
		 * @since 1.1.11
		 **/
		hashKey: true,

		/**
		 * @var string array|boolean the functions used to serialize and unserialize cached data
		 */
		serializer: false,

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 * Create a new HTTP server listener.
		 */	
		init: function ()
		{
			this.expire={};
			this.data={};
			if (this.keyPrefix == undefined)
				this.keyPrefix=this.getParent().getConfig('id')+'_';
		},

		/**
		 * @param string $key a key identifying a value to be cached
		 * @return string a key generated from the provided key which ensures the uniqueness across applications
		 */
		generateUniqueKey: function (key)
		{
			var md5 = crypto.createHash('md5').update(this.keyPrefix+key).digest("hex");
			return this.hashKey ? md5 : this.keyPrefix+key;
		},

		/**
		 * Retrieves a value from cache with a specified key.
		 * @param string $id a key identifying the cached value
		 * @return mixed the value stored in cache, false if the value is not in the cache, expired or the dependency has changed.
		 */
		get: function (id)
		{
			var value = this.getValue(this.generateUniqueKey(id));
			if (Array.isArray(value)){
				var dependency = value[1];
				if (!dependency.getHasChanged())
				{
					//this.getParent().e.log&&this.getParent().e.log('Serving `'+id+'` from cache','cache');
					return value[0];
				} else
					return false;
			} else
				return value;
		},

		/**
		 * Retrieves multiple values from cache with the specified keys.
		 * Some caches (such as memcache, apc) allow retrieving multiple cached values at one time,
		 * which may improve the performance since it reduces the communication cost.
		 * In case a cache does not support this feature natively, it will be simulated by this method.
		 * @param array $ids list of keys identifying the cached values
		 * @return array list of cached values corresponding to the specified keys. The array
		 * is returned in terms of (key,value) pairs.
		 * If a value is not cached or expired, the corresponding array value will be false.
		 */
		mget: function (ids)
		{
			var uids = [];
			for (id in ids)
				uids[id] = this.generateUniqueKey(id);

			var values = this.getValues(uids),
				results = [];

			for (id in uids)
			{
				var uid = uids[id],
					value = values[uid]!=undefined ? values[uid] : false;
				if (Array.isArray(value)){
					var dependency = new this.c[value[1]](value[2]);
					if (!dependency.getHasChanged())
					{
						//this.getParent().e.log&&this.getParent().e.log('Serving `'+id+'` from cache','cache');
						value = value[0];
					} else
						value = false;
				}
				results[id] = value;
			}

			return results;
		},

		/**
		 * Stores a value identified by a key into cache.
		 * If the cache already contains such a key, the existing value and
		 * expiration time will be replaced with the new ones.
		 *
		 * @param string $id the key identifying the value to be cached
		 * @param mixed $value the value to be cached
		 * @param integer $expire the number of seconds in which the cached value will expire. 0 means never expire.
		 * @param ICacheDependency $dependency dependency of the cached item. If the dependency changes, the item is labeled invalid.
		 * @return boolean true if the value is successfully stored into cache, false otherwise
		 */
		set: function (id,value,expire,dependency)
		{
			var value,
				dependency = dependency || null,
				expire = expire || 0;
//			this.getParent().e.log&&this.getParent().e.log('Saving `'+id+'` to cache','cache');

			if (dependency !== null)
			{
				dependency.evaluateDependency();
				value = [value,dependency];
			}

			return this.setValue(this.generateUniqueKey(id), value, expire);
		},

		/**
		 * Stores a value identified by a key into cache if the cache does not contain this key.
		 * Nothing will be done if the cache already contains the key.
		 * @param string $id the key identifying the value to be cached
		 * @param mixed $value the value to be cached
		 * @param integer $expire the number of seconds in which the cached value will expire. 0 means never expire.
		 * @param ICacheDependency $dependency dependency of the cached item. If the dependency changes, the item is labeled invalid.
		 * @return boolean true if the value is successfully stored into cache, false otherwise
		 */
		add: function (id,value,expire,dependency)
		{
			var value,
				dependency = dependency || null,
				expire = expire || 0;
//			this.getParent().e.log&&this.getParent().e.log('Saving `'+id+'` to cache','cache');

			if (dependency !== null)
			{
				dependency.evaluateDependency();
				value = [value,dependency];
			}

			return this.addValue(this.generateUniqueKey(id), value, expire);
		},

		/**
		 * Deletes a value with the specified key from cache
		 * @param string $id the key of the value to be deleted
		 * @return boolean if no error happens during deletion
		 */
		delete: function (id)
		{
//			this.getParent().e.log&&this.getParent().e.log('Deleting `'+id+'` from cache','cache');
			return this.deleteValue(this.generateUniqueKey(id));
		},

		/**
		 * Deletes all values from cache.
		 * Be careful of performing this operation if the cache is shared by multiple applications.
		 * @return boolean whether the flush operation was successful.
		 */
		flush: function ()
		{
			return this.flushValues();
		},

		/**
		 * Retrieves a value from cache with a specified key.
		 * This method should be implemented by child classes to retrieve the data
		 * from specific cache storage. The uniqueness and dependency are handled
		 * in {@link get()} already. So only the implementation of data retrieval
		 * is needed.
		 * @param string $key a unique key identifying the cached value
		 * @return string the value stored in cache, false if the value is not in the cache or expired.
		 * @throws CException if this method is not overridden by child classes
		 */
		getValue: function (key)
		{
			if (this.expire[key] == undefined || (this.expire[key] && (+new Date) <= this.expire[key]))
				return this.data[key];
		},

		/**
		 * Retrieves multiple values from cache with the specified keys.
		 * The default implementation simply calls {@link getValue} multiple
		 * times to retrieve the cached values one by one.
		 * If the underlying cache storage supports multiget, this method should
		 * be overridden to exploit that feature.
		 * @param array $keys a list of keys identifying the cached values
		 * @return array a list of cached values indexed by the keys
		 */
		getValues: function (keys)
		{
			results=[];
			for (k in keys)
				results[k]=this.getValue(key);
			return results;
		},

		/**
		 * Stores a value identified by a key in cache.
		 * This method should be implemented by child classes to store the data
		 * in specific cache storage. The uniqueness and dependency are handled
		 * in {@link set()} already. So only the implementation of data storage
		 * is needed.
		 *
		 * @param string $key the key identifying the value to be cached
		 * @param string $value the value to be cached
		 * @param integer $expire the number of seconds in which the cached value will expire. 0 means never expire.
		 * @return boolean true if the value is successfully stored into cache, false otherwise
		 * @throws CException if this method is not overridden by child classes
		 */
		setValue: function (key,value,expire)
		{
			if(expire != undefined && expire>0)
				this.expire[key]=expire+(+(new Date));

			this.data[key]=value;

			return true;
		},

		/**
		 * Stores a value identified by a key into cache if the cache does not contain this key.
		 * This method should be implemented by child classes to store the data
		 * in specific cache storage. The uniqueness and dependency are handled
		 * in {@link add()} already. So only the implementation of data storage
		 * is needed.
		 *
		 * @param string $key the key identifying the value to be cached
		 * @param string $value the value to be cached
		 * @param integer $expire the number of seconds in which the cached value will expire. 0 means never expire.
		 * @return boolean true if the value is successfully stored into cache, false otherwise
		 * @throws CException if this method is not overridden by child classes
		 */
		addValue: function (key,value,expire)
		{
			return this.setValue.apply(this,arguments);
		},

		/**
		 * Deletes a value with the specified key from cache
		 * This method should be implemented by child classes to delete the data from actual cache storage.
		 * @param string $key the key of the value to be deleted
		 * @return boolean if no error happens during deletion
		 * @throws CException if this method is not overridden by child classes
		 */
		deleteValue: function (key)
		{
			delete this.data[key];
			delete this.expire[key];
		},

		/**
		 * Deletes all values from cache.
		 * Child classes may implement this method to realize the flush operation.
		 * @return boolean whether the flush operation was successful.
		 * @throws CException if this method is not overridden by child classes
		 * @since 1.1.5
		 */
		flushValues: function ()
		{
			this.data = [];
			this.expire = [];
		},

		/**
		 * Returns whether there is a cache entry with a specified key.
		 * This method is required by the interface ArrayAccess.
		 * @param string $id a key identifying the cached value
		 * @return boolean
		 */
		offsetExists: function (id)
		{
			return this.get(id)!==false;
		},

		/**
		 * Retrieves the value from cache with a specified key.
		 * This method is required by the interface ArrayAccess.
		 * @param string $id a key identifying the cached value
		 * @return mixed the value stored in cache, false if the value is not in the cache or expired.
		 */
		offsetGet: function (id)
		{
			return this.get(id);
		},

		/**
		 * Stores the value identified by a key into cache.
		 * If the cache already contains such a key, the existing value will be
		 * replaced with the new ones. To add expiration and dependencies, use the set() method.
		 * This method is required by the interface ArrayAccess.
		 * @param string $id the key identifying the value to be cached
		 * @param mixed $value the value to be cached
		 */
		offsetSet: function (id,value)
		{
			this.set(id,value);
		},

		/**
		 * Deletes the value with the specified key from cache
		 * This method is required by the interface ArrayAccess.
		 * @param string $id the key of the value to be deleted
		 * @return boolean if no error happens during deletion
		 */
		offsetUnset: function (id)
		{
			this.delete(id);
		}

	}

};
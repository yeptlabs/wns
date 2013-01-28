/**
 * Source of the wnDbMongoSchema class.
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
 * @package system.core.db.mongo
 * @since 1.0.0
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnDbSchema'],

	/**
	 * PRIVATE
	 */
	private: {
		_mongoSchema: {}
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
		 * Mongo database schema prepare;
		 */	
		prepare: function ()
		{
			var colls = this.getCollections();
			for (c in colls)
				if (_mongoSchema[c] == undefined)
				{
					_mongoSchema[c] = new this.getDbConnection().dataObject.base.Schema(colls[c])
				}
			return this;
		},

		/**
		 * Get mongo schema object.
		 */	
		getMongoSchema: function (collection)
		{
			return (typeof collection == 'string' && _mongoSchema[collection]!=undefined) && _mongoSchema[collection];
		}

	}

};
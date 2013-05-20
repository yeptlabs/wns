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
 * @package package.mongo
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
			var getSchema = function () {
				var colls = self.getCollections();
				for (c in colls)
					if (_mongoSchema[c] == undefined)
					{
						for (a in colls[c])
						{
							if (typeof colls[c][a].type=='string')
							{
								colls[c][a].type=self.getDbConnection().dataObject.base.Schema.Types[colls[c][a].type];
							}
						}
						_mongoSchema[c] = new self.getDbConnection().dataObject.base.Schema(colls[c])
					}		
			}

			if (!this.getDbConnection().connected)
				this.getDbConnection().once('connect',getSchema);
			else
				getSchema();
			
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
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
		_connection: null,
		_schema: null
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
		init: function (config,c,schema)
		{
			_schema = schema;
			_connection = schema.getDbConnection();
		},

		/**
		 * CREATE a new object data on the database
		 * @param mixed $collection wnDbCollection or string
		 * @param object $data
		 * @return boolean success?
		 */
		createInsert: function (collection, data) {
			return false;
		},

		/**
		 * READ all objects from database that matches with the criteria.
		 * @param mixed $collection wnDbCollection or string
		 * @param object $data
		 * @return boolean success?
		 */
		createFind: function (collection, criteria) {
			return false;
		},

		/**
		 * UPDATE a new object data on the database
		 * @param mixed $collection wnDbCollection or string
		 * @param object $data
		 * @param wnDbCriteria $criteria
		 * @return boolean success?
		 */
		createUpdate: function (collection, data, criteria) {
			return false;
		},

		/**
		 * DELETE a object from the database
		 * @param mixed $collection wnDbCollection or string
		 * @param wnDbCriteria $criteria
		 * @return boolean success?
		 */
		createDelete: function (collection, criteria) {
			return false;
		},

		/**
		 * @return wnDbConnection database connection.
		 */
		getDbConnection: function ()
		{
			return _connection;
		},

		/**
		 * @return wnDbSchema the schema for this command builder.
		 */
		getSchema: function ()
		{
			return _schema;
		},

		/**
		 * Return the wnDbCollection from a given collection name;
		 * @param mixed $collection wnDbCollection or string
		 */
		getCollection: function (collection) {
			return ((typeof collection == 'object' && collection.getClassName() == 'wnDbCollection') || (typeof collection == 'string' && (collection=_schema.getCollection(collection)))) && collection;
		}

	}

};
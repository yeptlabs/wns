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
	extend: ['wnDbQueryBuilder'],

	/**
	 * PRIVATE
	 */
	private: {},

	/**
	 * Public Variables
	 */
	public: {},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * CREATE a new object data on the database
		 * @param string $collName collection name
		 * @param object $data
		 * @return boolean success?
		 */
		createInsert: function (collName, data) {
			var collection;
			if (collection = this.getCollection(collName) && typeof data == 'object')
			{
				var query = this.getDbConnection().createQuery();
					query.setQuery({
						'collection': collName,
						'action': 'insert',
						'data': data
					});
				return query;	
			}
			return false;
		},

		/**
		 * READ all objects from database that matches with the criteria.
		 * @param string $collName collection name
		 * @param mixed $criteria wnDbCriteria or object
		 * @return boolean success?
		 */
		createFind: function (collName, criteria) {
			collName = collName;
			if (collection = this.getCollection(collName) && criteria && typeof criteria == 'object')
			{
				var query = this.getDbConnection().createQuery();
					query.setQuery({
						'collection': collName,
						'action': 'find',
						'criteria': criteria
					});
				return query;
			}
			return false;
		},

		/**
		 * UPDATE all object from database that matches with the criteria
		 * @param string $collName collection name
		 * @param mixed $criteria wnDbCriteria or object
		 * @param object $data
		 * @return boolean success?
		 */
		createUpdate: function (collName, criteria, data) {
			collName = collName;
			if (collection = this.getCollection(collName) && criteria && typeof criteria == 'object' && data && typeof data == 'object')
			{
				var query = this.getDbConnection().createQuery();
					query.setQuery({
						'collection': collName,
						'action': 'update',
						'criteria': criteria,
						'data': data
					});
				return query;
			}
			return false;
		},

		/**
		 * DELETE all object from database that matches with the criteria
		 * @param string $collName collection name
		 * @param mixed $criteria wnDbCriteria or object
		 * @return boolean success?
		 */
		createDelete: function (collName, criteria) {
			var collection;
				collName = collName;
			if (collection = this.getCollection(collName) && criteria && typeof criteria == 'object')
			{
				var query = this.getDbConnection().createQuery();
					query.setQuery({
						'collection': collName,
						'action': 'delete',
						'criteria': criteria
					});
				return query;	
			}
			return false;
		},

		/**
		 * COUNT all objects from database that matches with the criteria
		 * @param string $collName collection name
		 * @param mixed $criteria wnDbCriteria or object
		 * @return boolean success?
		 */
		createCount: function (collName, criteria) {
			var collection;
				collName = collName;
			if (collection = this.getCollection(collName) && criteria && typeof criteria == 'object')
			{
				var query = this.getDbConnection().createQuery();
					query.setQuery({
						'collection': collName,
						'action': 'count',
						'criteria': criteria
					});
				return query;	
			}
			return false;
		},

		/**
		 * Create a database query
		 * @param string $collName collection name
		 * @return {Mongoose.Query} db query
		 */
		createQuery: function (collName,params) {
			var collection;
				collName = collName;
			if (collection = this.getCollection(collName))
			{
				var criteria = {};
				criteria=Object.extend(false,{},criteria,params);
				criteria.collection = collName;
				var query = this.getDbConnection().query(criteria);
				return query;
			}
			return false;
		},

		/**
		 * EXECUTE the query.
		 * @param object $query query object.
		 * @return boolean success?
		 */
		exec: function (query,cb) {
			if (typeof query != 'object' || query.collection == undefined || typeof cb != 'function')
				cb&&cb(false)
			else
			{
				this.getDbConnection().exec(query,cb);
			}
		}

	}

};
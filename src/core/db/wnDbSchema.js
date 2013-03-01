/**
 * Source of the wnDbSchema class.
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
 * @package system.core.db
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
		_connection: null,
		_builder: null,
		_collections: {}

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
		init: function (config,c,conn)
		{
			_connection = conn;
			this.prepare();
		},

		/**
		 * Specifica database schema prepare;
		 */	
		prepare: function ()
		{
			return this;
		},

		/**
	 	 * @return wnDbConnection database connection. The connection is active.
	 	 */
		getDbConnection: function ()
		{
			return _connection;
		},

		/**
		 * @return wnDbQueryBuilder the builder for this connection.
		 */
		getQueryBuilder: function ()
		{
			if(_builder!==null)
				return _builder;
			else
				return _builder=this.createQueryBuilder();
		},

		/**
		 * Creates a query builder for the database.
		 * This method may be overridden by child classes to create a DBMS-specific query builder.
		 * @return wnDbQueryBuilder query builder instance
		 */
		createQueryBuilder: function ()
		{
			var engine = _connection.getConfig('engine'),
				QBClass = 'wnDb'+engine.substr(0,1).toUpperCase()+engine.substr(1)+'QueryBuilder'
			return new this.c[QBClass]({}, this.c, this);
		},

		/**
		 * Define the meta-data for the collection.
		 * Format of the collection:
		 * {
	 	 *		'name': { type: 'String', label: "User's Name" },
	 	 *		'age': { type: 'Number', label: "User's Age" },
	 	 *		'status': { type: boolean, label: "User's Status", default: true }
		 * };
		 * @param string $name collection name
		 * @param object $object collection object
		 * @return wnDbCollection collection metadata. Null if the named collection does not exist.
		 */
		setCollection: function (name,object)
		{
			if (!(typeof name == 'string' && typeof object == 'object' && _collections[name] == undefined))
				return false;
			_collections[name] = object;
			this.prepare();
			return true;
		},

		/**
		 * Obtains the metadata for the named collection.
		 * @param string $name collection name
		 * @return wnDbCollection collection metadata. Null if the named collection does not exist.
		 */
		getCollection: function (name)
		{
			return (typeof name == 'string' && _collections[name]!=undefined) && _collections[name];
		},

		/**
		 * Returns the metadata for all collections in this schema.
		 * @param string $name the name of the collections. Defaults to empty string, meaning the current or default schema.
		 * @return array the metadata for all collections in the database.
		 */
		getCollections: function ()
		{
			return _collections;
		},

		/**
		 * Returns all collection names in this schema
		 * @return array all collection names in the database.
		 */
		getCollectionNames: function ()
		{
			var names = [];
			for (c in _collections)
				names.push(c);
			return names;
		}

	}

};	
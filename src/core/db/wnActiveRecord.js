/**
 * Source of the wnActiveRecord class.
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
 * @package package.db
 * @since 1.0.0
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnModel'],

	/**
	 * PRIVATE
	 */
	private: {

		_new: false,
		_attributes: {},
		_collectionName: '',
		_db: null,
		_schema: null

	},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var object events to be preloaded.
		 */
		defaultEvents: {
			'beforeSave': {},
			'afterSave': {},
			'beforeUpdate': {},
			'afterUpdate': {},
			'beforeDelete': {},
			'afterDelete': {},
			'beforeFind': {},
			'afterFind': {},
			'beforeCount': {},
			'afterCount': {}
		}

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 */	
		init: function (config,c,parent,db)
		{
			_db = db || this.getParent().db || _db;
			_attributes = this.getDefaults();
			_schema = this.schema() || this.getConfig('schema') || {};
			this.setIsNewRecord(true)
				.setCollectionName(config.name)
				.prepareSchema()
				.afterInit();
		},

		/**
		 * This function can be overwrite.
		 */
		afterInit: function ()
		{
		},

		/**
		 * Return a new instance of the given AR
		 * If null, returns a new instance of the same AR;
		 */
		model: function (className) {
			if (typeof className != 'string')
				className = this.getClassName();
			return new this.c[className](this.getConfig(), this.c, this.getParent(), _db);
		},

		/**
		 * This sends this AR's schema for the {_collectionName}'s collection
		 * to the wnDbSchema from the actual wnDbConnection. 
		 */
		prepareSchema: function () {
			var schema = _db.getSchema();
			schema.setCollection(this.collectionName(),this.getSchema());
			return this;
		},

		/**
		 * Returns the name of the associated database collection.
		 * @return string the collection name
		 */
		collectionName: function ()
		{
			return _collectionName;
		},

		/**
		 * Sets the name of the associated database collection.
		 * @param string $name the collection name
		 */
		setCollectionName: function (name) {
			_collectionName = name || _collectionName;
			return this;
		},

		/**
		 * Function that will return this AR schema.
		 * This function is just called in the initialization.
		 * To get the real schema object: {@see getSchema()}
		 * This schema will define which properties of this AR 
		 * is valid, their types and default values.
		 * Just override it, example:
		 * return {
	 	 *		'name': { type: 'String', label: "User's Name" },
	 	 *		'age': { type: 'Number', label: "User's Age" },
	 	 *		'status': { type: boolean, label: "User's Status", default: true }
		 * };
		 * @return object model's schema object
		 */
		schema: function ()
		{
			return null;
		},

		/**
		 * Returns the real AR schema's name.
		 */
		getSchema: function ()
		{
			return _schema;
		},

		/**
		 * Redefines the schema of this AR;
		 * @param object $schema new schema object.
		 */
		setSchema: function (schema)
		{
			if (!!schema && typeof schema == 'object')
				_schema = schema;
			return this;
		},

		/**
		 * Returns the AR's schema's default values for each property
		 * @return object result
		 */
		getDefaults: function ()
		{
			var schema = this.getSchema(),
				result = {};
			for (s in schema)
				if (schema[s]!=undefined && schema[s].default != undefined)
					result[s] = schema[s].default;
			return result;
		},

		/**
		 * Returns the database connection used by active record.
		 * By default, the "db" application component is used as the database connection.
		 * You may override this method if you want to use a different database connection.
		 * @return wnDbConnection the database connection used by active record.
		 */
		getDbConnection: function ()
		{
			return _db;
		},

		/**
		 * Returns the query builder used by this AR.
		 * @return wnDbQueryBuilder the query builder used by this AR
		 */
		getQueryBuilder: function ()
		{
			return this.getDbConnection().getSchema().getQueryBuilder();
		},

		/**
		 * Get the collection instance.
		 * @return instance collection instance
		 */
		getCollection: function ()
		{
			return this.getDbConnection().dataObject.getCollection(this.collectionName());
		},

		/**
		 * Checks whether this AR has the named attribute
		 * @param string $name attribute name
		 * @return boolean whether this AR has the named attribute (collection property).
		 */
		hasAttribute: function (name)
		{
			return this.getSchema()[name] !== undefined;
		},

		/**
		 * Check if attribute is required
		 * @return boolean is required?
		 */
		isAttributeRequired: function (name)
		{
			return this.getSchema()[name].required === true;
		},

		/**
		 * Returns the named attribute value.
		 * If this is a new record and the attribute is not set before,
		 * the default column value will be returned.
		 * If this record is the result of a query and the attribute is not loaded,
		 * null will be returned.
		 * @param string $name the attribute name
		 * @return mixed the attribute value. Null if the attribute is not set or does not exist.
		 */
		getAttribute: function (name)
		{
			return _attributes[name];
		},

		/**
		 * Returns the named attribute label.
		 * @param string $name the attribute name
		 * @return mixed the attribute label
		 */
		getAttributeLabel: function (name)
		{
			return this.getSchema()[name].label || '';
		},

		/**
		 * Check if the attribute has errors.
		 * @param string $name the attribute name
		 */
		hasErrors: function (name)
		{
			return false;
		},

		/**
		 * Sets the named attribute value.
		 * @param string $name the attribute name
		 * @param mixed $value the attribute value.
		 * @return boolean whether the attribute exists and the assignment is conducted successfully
		 */
		setAttribute: function (name,value)
		{
			_attributes[name]=value;	
		},

		/**
		 * Set all attributes in the object
		 * @param object $attributes new attributes
		 */
		setAttributes: function (attributes)
		{
			for (a in attributes)
				this.setAttribute(a,attributes[a]);
			return this;
		},		

		/**
		 * Returns all column attribute values.
	 	 * @param mixed $names names of attributes whose value needs to be returned.
	 	 * @return object attribute values indexed by attribute names.
		 */
		getAttributes: function (attributes)
		{
			var attrs = this.getDbConnection().getSchema().getCollection(this.collectionName()),
				attributes = Object.extend(true,{},_attributes,attributes),
				valid = {};
			for (a in attributes)
			{
				if (!!(attrs[a]))
					valid[a]=attributes[a];
			}
			return valid;
		},

		/**
		 * Saves the current record.
		 *
		 * @param array $attributes list of attributes that need to be saved. Defaults to null,
		 * meaning all attributes that are loaded from DB will be saved.
		 * @return boolean whether the saving succeeds
		 */
		save: function (attributes)
		{
			if (attibutes)
				this.setAttributes(attributes);
			return this.getIsNewRecord() ? this.insert(this.getAttributes()) : this.update(this.getAttributes());
		},

		/**
		 * Returns if the current record is new.
		 * @return boolean whether the record is new and should be inserted when calling {@link save}.
		 * Defaults to false, but it will be set to true if the instance is created using
		 * the new operator.
		 */
		getIsNewRecord: function ()
		{
			return _new;
		},

		/**
		 * Sets if the record is new.
		 * @param boolean $value whether the record is new and should be inserted when calling {@link save}.
		 */
		setIsNewRecord: function (value)
		{
			_new=value;
			return this;
		},

		/**
		 * TODO
		 */
		query: function (params)
		{
			var builder = this.getQueryBuilder(),
				query=builder.createQuery(this.collectionName(),params);
			return query;
		},

		/**
		 * Inserts a row into the data to the collection based on this active record attributes.
		 * After the record is inserted to DB successfully, its {@link isNewRecord} property will be set false
		 * @param array $attributes list of attributes that need to be saved. Defaults to null,
		 * meaning all attributes that are loaded from DB will be saved.
		 * @return boolean whether the attributes are valid and the record is inserted successfully.
		 */
		insert: function (attributes,cb)
		{
			if(this.getIsNewRecord())
				this.getParent().e.log&&
					this.getParent().e.log('wnActiveRecord.insert: The active record cannot be inserted to database because it is not new.');

			if (!attributes)
				return false;

			if (cb)
				this.once('afterSave',cb);

			var self = this;
			this.once('beforeSave', function () {
				var builder = self.getQueryBuilder(),
					query=builder.createInsert(self.collectionName(),attributes);
				query.exec(function (err) {
					if(!err)
						self.setIsNewRecord(false);
					self.e.afterSave.apply(self,arguments);
				});
			}).e.beforeSave();

			return this;
		},

		/**
		 * Remove all documents that matches with the criteria.
		 * @param mixed $criteria wnDbCriteria or object
		 */
		delete: function (criteria,cb)
		{
			if (!criteria)
				return false;

			if (cb)
				this.once('afterDelete',cb);

			var self = this;
			this.once('beforeDelete', function () {
				var builder = self.getQueryBuilder(),
					query=builder.createDelete(self.collectionName(),criteria);
				query.exec(function (err) {
					self.e.afterDelete.apply(self,arguments);
				});
			}).e.beforeDelete();

			return this;
		},

		/**
		 * Find all objects that matches with the criteria.
		 * @param mixed $criteria wnDbCriteria or object
		 */
		find: function (criteria,cb)
		{
			if (!criteria)
				return false;

			if (cb)
				this.once('afterFind',cb);

			var self = this;
			this.once('beforeFind', function () {
				var builder = self.getQueryBuilder(),
					query=builder.createFind(self.collectionName(),criteria);
				query.exec(function (err,d) {
					self.e.afterFind.apply(self,arguments);
				});
			}).e.beforeFind();

			return this;
		},

		/**
		 * Count all objects that matches with the criteria.
		 * @param mixed $criteria wnDbCriteria or object
		 */
		count: function (criteria,cb)
		{
			if (!criteria)
				return false;

			if (cb)
				this.once('afterCount',cb);

			var self = this;
			this.once('beforeCount', function () {
				var builder = self.getQueryBuilder(),
					query=builder.createCount(self.collectionName(),criteria);
				query.exec(function (err,d) {
					self.e.afterCount.apply(self,arguments);
				});
			}).e.beforeCount();

			return this;
		},

		/**
		 * Update all documents that matches with the criteria.
		 * @param mixed $criteria wnDbCriteria or object
		 */
		update: function (criteria,data)
		{
			if (!criteria || !data)
				return false;

			var cb = arguments[2] || arguments[3] || undefined;
			var options = typeof arguments[2]=='object' ? arguments[2] : {};

			if (cb)
				this.once('afterUpdate',cb);

			var self = this;
			this.once('beforeUpdate', function () {
				var builder = self.getQueryBuilder(),
					query=builder.createUpdate(self.collectionName(),criteria,data,options);
				query.exec(function (err,affected,raw) {
					self.e.afterUpdate.apply(self,arguments);
				});
			}).e.beforeUpdate();

			return this;
		}

	}

};
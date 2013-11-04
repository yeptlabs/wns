 /**
 * WNS Middleware
 * @copyright &copy; 2012- Pedro Nasser &reg;
 * @license: MIT
 * @see http://github.com/yeptlabs/wns
 * @author Pedro Nasser
 */
 
// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnComponent'],

	/**
	 * NPM dependencies
	 */
	dependencies: ['crypto'],	

	/**
	 * Constructor.
	 * @param string $expression the PHP expression whose result is used to determine the dependency.
	 */
	constructor: function (expression)
	{
		this.expression=expression;
	},

	/**
	 * PRIVATE
	 */
	private: {
		_hash: undefined,
		_data: undefined
	},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var boolean Whether this dependency is reusable or not.
		 * If set to true, dependent data for this cache dependency will only be generated once per request.
		 * You can then use the same cache dependency for multiple separate cache calls on the same page
		 * without the overhead of re-evaluating the dependency each time.
		 * Defaults to false;
		 */
		reuseDependentData: false,

		/**
		 * @var array cached data for reusable dependencies.
		 */
		_reusableData: []

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Evaluates the dependency by generating and saving the data related with dependency.
		 * This method is invoked by cache before writing data into it.
		 */
		evaluateDependency: function ()
		{
			if (this.reuseDependentData)
			{
				var hash=this.getHash();
				if (this._reusableData[hash]['dependentData']!=undefined)
					this._reusableData[hash]['dependentData']=this.generateDependentData();
				_data=this._reusableData[hash]['dependentData'];
			}
			else
				_data=this.generateDependentData();
		},

		/**
		 * @return boolean whether the dependency has changed.
		 */
		getHasChanged: function ()
		{
			if (this.reuseDependentData)
			{
				var hash=this.getHash();
				if (this._reusableData[hash]['hasChanged']!=undefined)
				{
					if (this._reusableData[hash]['dependentData']!=undefined)
						this._reusableData[hash]['dependentData']=this.generateDependentData();
					this._reusableData[hash]['hasChanged']=this._reusableData[hash]['dependentData']!=_data;
				}
				return this._reusableData[hash]['hasChanged'];
			}
			else {
				return this.generateDependentData()!=_data;
			}
		},

		/**
		 * @return mixed the data used to determine if dependency has been changed.
		 * This data is available after {@link evaluateDependency} is called.
		 */
		getDependentData: function ()
		{
			return _data;
		},

		/**
		 * Generates the data needed to determine if dependency has been changed.
		 * Derived classes should override this method to generate actual dependent data.
		 * @return mixed the data needed to determine if dependency has been changed.
		 */
		generateDependentData: function ()
		{
			return JSON.stringify(eval(this.expression));
		},

		/**
		 * Generates a unique hash that identifies this cache dependency.
		 * @return string the hash for this cache dependency
		 */
		getHash: function ()
		{
			if(_hash===null)
			{
				_hash = crypto.createHash('sha1').update(JSON.stringify(_data)).digest("hex");
			}
			return _hash;
		}

	}

};
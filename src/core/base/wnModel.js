/**
 * Source of the wnModel class.
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
 * @package system.core.base
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
		_errors: {},
		_validators: null,
		_scenario: ''
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
		init: function ()
		{

		},

		/**
		 * Return model's rules.
		 */
		rules: function ()
		{
			return [];
		},

		/**
		 * Validate model's attributes.
		 */
		validate: function ()
		{
			return true;
		},

		/**
		 * Returns a value indicating whether there is any validation error.
		 * @param string $attribute attribute name. Use null to check all attributes.
		 * @return boolean whether there is any error.
		 */
		hasErrors: function(attribute)
		{
			var attribute = attribute || null;
			if(attribute===null)
				return _errors!=={};
			else
				return _errors[attribute]!==undefined;
		},

		/**
		 * Returns the errors for all attribute or a single attribute.
		 * @param string $attribute attribute name. Use null to retrieve errors for all attributes.
		 * @return array errors for all attributes or the specified attribute. Empty array is returned if no error.
		 */
		getErrors: function (attribute)
		{
			var attribute = attribute || null;
			if(attribute===null)
				return _errors;
			else
				return _errors[attribute]!==undefined ? _errors[attribute] : {};
		},

		/**
		 * Returns the first error of the specified attribute.
		 * @param string $attribute attribute name.
		 * @return string the error message. Null is returned if no error.
		 */
		getError: function (attribute)
		{
			return _errors[attribute]!==undefined ? _errors[attribute][0] : {};
		},

		/**
		 * Adds a new error to the specified attribute.
		 * @param string $attribute attribute name
		 * @param string $error new error message
		 */
		addError: function (attribute,error)
		{
			_errors[attribute].push(error);
		},

		/**
		 * Adds a list of errors.
		 * @param array $errors a list of errors. The array keys must be attribute names.
		 * The array values should be error messages. If an attribute has multiple errors,
		 * these errors must be given in terms of an array.
		 * You may use the result of {@link getErrors} as the value for this parameter.
		 */
		addErrors: function (errors)
		{
			for (e in errors)
			{
				var error = errors[e];
				if(Array.isArray(error))
				{
					for (d in error)
						this.addError(attribute, error[d]);
				}
				else
					this.addError(attribute, error);
			}
		},

		/**
		 * Removes errors for all attributes or a single attribute.
		 * @param string $attribute attribute name. Use null to remove errors for all attribute.
		 */
		clearErrors: function (attribute)
		{
			var attribute = attribute || null;
			if(attribute===null)
				_errors={};
			else
				delete _errors[attribute];
		}
		
	}

};
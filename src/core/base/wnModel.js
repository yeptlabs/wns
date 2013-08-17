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
		 * Performs the validation.
		 *
		 * This method executes the validation rules as declared in {@link rules}.
		 * Only the rules applicable to the current {@link scenario} will be executed.
		 * A rule is considered applicable to a scenario if its 'on' option is not set
		 * or contains the scenario.
		 *
		 * Errors found during the validation can be retrieved via {@link getErrors}.
		 *
		 * @param array $attributes list of attributes that should be validated. Defaults to null,
		 * meaning any attribute listed in the applicable validation rules should be
		 * validated. If this parameter is given as a list of attributes, only
		 * the listed attributes will be validated.
		 * @param boolean $clearErrors whether to call {@link clearErrors} before performing validation
		 * @return boolean whether the validation is successful without any error.
		 * @see beforeValidate
		 * @see afterValidate
		 */
		validate: function (attributes, clearErrors)
		{
			return true;
			
			var attributes = attributes || null;
				clearErrors = clearErrors || true;
			if(clearErrors)
				this.clearErrors();

			var validators = this.getValidators();
			for(v in validators)
				validators[v].validate(this,attributes);

			return this.hasErrors();
		},

		/**
		 * Returns all the validators declared in the model.
		 * This method differs from {@link getValidators} in that the latter
		 * would only return the validators applicable to the current {@link scenario}.
		 * Also, since this method return a {@link CList} object, you may
		 * manipulate it by inserting or removing validators (useful in behaviors).
		 * For example, <code>$model->validatorList->add($newValidator)</code>.
		 * The change made to the {@link CList} object will persist and reflect
		 * in the result of the next call of {@link getValidators}.
		 * @return CList all the validators declared in the model.
		 * @since 1.1.2
		 */
		getValidatorList: function ()
		{
			if(this._validators===null)
				this._validators={};
			return this._validators;
		},

		/**
		 * Returns the validators applicable to the current {@link scenario}.
		 * @param string $attribute the name of the attribute whose validators should be returned.
		 * If this is null, the validators for ALL attributes in the model will be returned.
		 * @return array the validators applicable to the current {@link scenario}.
		 */
		getValidators: function (attribute)
		{
			var attribute = attribute || null;
			if(this._validators===null)
				this._validators={};

			validators=[];
			scenario=this.getScenario();
			for (v in this._validators)
			{
				var validator = this._validators[v];
				if(validator.applyTo(scenario))
				{
					if(attribute===null || validator.attributes[attribute]!==undefined)
						validators.push(validator);
				}
			}
			return validators;
		},

		/**
		 * Returns the attribute names that are safe to be massively assigned.
		 * A safe attribute is one that is associated with a validation rule in the current {@link scenario}.
		 * @return array safe attribute names
		 */
		getSafeAttributeNames: function ()
		{
			var attributes={},
				unsafe=[],
				safe=[];
				validators = this.getValidators();
			for(v in validators)
			{
				var validator = validators[v];
				if(!validator.safe)
				{
					for (a in validator.attributes)
						unsafe.push(a);
				}
				else
				{
					for (a in validator.attributes)
						attributes[a]=true;
				}
			}

			for(u in unsafe)
				delete attributes[unsafe[u]];
			for (u in attributes)
				safe.push(u);

			return safe;
		},

		/**
		 * Returns a value indicating whether the attribute is required.
		 * This is determined by checking if the attribute is associated with a
		 * {@link CRequiredValidator} validation rule in the current {@link scenario}.
		 * @param string $attribute attribute name
		 * @return boolean whether the attribute is required
		 */
		isAttributeRequired: function (attribute)
		{
			var attribute = attribute || null,
				validators = this.getValidators(attribute);

			for (v in validators)
			{
				var validator = validators[v];
				if(validator.instanceOf('wnRequiredValidator'))
					return true;
			}
			return false;
		},

		/**
		 * Returns a value indicating whether the attribute is safe for massive assignments.
		 * @param string $attribute attribute name
		 * @return boolean whether the attribute is safe for massive assignments
		 * @since 1.1
		 */
		isAttributeSafe: function (attribute)
		{
			var attribute = attribute || null;
			attributes=this.getSafeAttributeNames();
			return attributes[attribute] !== undefined;
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
			return _errors[attribute]!==undefined ? _errors[attribute][0] : '';
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
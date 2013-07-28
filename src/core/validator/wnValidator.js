// /**
//  * Source of wnValidator class file. (ported from Yii Framework)
//  *
//  * @author Qiang Xue <qiang.xue@gmail.com>
//  * @link http://www.yiiframework.com/
//  * @copyright Copyright &copy; 2008-2011 Yii Software LLC
//  * @license http://www.yiiframework.com/license/
//  */

// /**
//  * wnValidator is the base class for all validators.
//  *
//  * Child classes must implement the {@link validateAttribute} method.
//  *
//  * The following properties are defined in wnValidator:
//  * <ul>
//  * <li>{@link attributes}: array, list of attributes to be validated;</li>
//  * <li>{@link message}: string, the customized error message. The message
//  *   may contain placeholders that will be replaced with the actual content.
//  *   For example, the "{attribute}" placeholder will be replaced with the label
//  *   of the problematic attribute. Different validators may define additional
//  *   placeholders.</li>
//  * <li>{@link on}: string, in which scenario should the validator be in effect.
//  *   This is used to match the 'on' parameter supplied when calling {@link CModel::validate}.</li>
//  * </ul>
//  *
//  * When using {@link createValidator} to create a validator, the following aliases
//  * are recognized as the corresponding built-in validator classes:
//  * <ul>
//  * <li>required: {@link wnRequiredValidator}</li>
//  * <li>filter: {@link wnFilterValidator}</li>
//  * <li>match: {@link wnRegularExpressionValidator}</li>
//  * <li>email: {@link wnEmailValidator}</li>
//  * <li>url: {@link wnUrlValidator}</li>
//  * <li>unique: {@link wnUniqueValidator}</li>
//  * <li>compare: {@link wnCompareValidator}</li>
//  * <li>length: {@link wnStringValidator}</li>
//  * <li>in: {@link wnRangeValidator}</li>
//  * <li>numerical: {@link wnNumberValidator}</li>
//  * <li>captcha: {@link wnCaptchaValidator}</li>
//  * <li>type: {@link wnTypeValidator}</li>
//  * <li>file: {@link wnFileValidator}</li>
//  * <li>default: {@link wnDefaultValueValidator}</li>
//  * <li>exist: {@link wnExistValidator}</li>
//  * <li>boolean: {@link wnBooleanValidator}</li>
//  * <li>date: {@link wnDateValidator}</li>
//  * <li>safe: {@link wnSafeValidator}</li>
//  * <li>unsafe: {@link wnUnsafeValidator}</li>
//  * </ul>
//  *
//  * @author Qiang Xue <qiang.xue@gmail.com>
//  * @package package.validator
//  * @since 1.0
//  */

// // Exports
// module.exports = {

// 	/**
// 	 * Class dependencies
// 	 */
// 	extend: ['wnComponent'],

// 	/**
// 	 * PRIVATE
// 	 */
// 	private: {

// 		/**
// 		 * @var array list of built-in validators (name:class)
// 		 */
// 		builtInValidators: {
// 			'required':'CRequiredValidator',
// 			'filter':'CFilterValidator',
// 			'match':'CRegularExpressionValidator',
// 			'email':'CEmailValidator',
// 			'url':'CUrlValidator',
// 			'unique':'CUniqueValidator',
// 			'compare':'CCompareValidator',
// 			'length':'CStringValidator',
// 			'in':'CRangeValidator',
// 			'numerical':'CNumberValidator',
// 			'captcha':'CCaptchaValidator',
// 			'type':'CTypeValidator',
// 			'file':'CFileValidator',
// 			'default':'CDefaultValueValidator',
// 			'exist':'CExistValidator',
// 			'boolean':'CBooleanValidator',
// 			'safe':'CSafeValidator',
// 			'unsafe':'CUnsafeValidator',
// 			'date':'CDateValidator',
// 		};

// 		/**
// 		 * @var array list of attributes to be validated.
// 		 */
// 		public attributes;
// 		/**
// 		 * @var string the user-defined error message. Different validators may define various
// 		 * placeholders in the message that are to be replaced with actual values. All validators
// 		 * recognize "{attribute}" placeholder, which will be replaced with the label of the attribute.
// 		 */
// 		public message;
// 		/**
// 		 * @var boolean whether this validation rule should be skipped when there is already a validation
// 		 * error for the current attribute. Defaults to false.
// 		 * @since 1.1.1
// 		 */
// 		public skipOnError=false;
// 		/**
// 		 * @var array list of scenarios that the validator should be applied.
// 		 * Each array value refers to a scenario name with the same name as its array key.
// 		 */
// 		public on;
// 		/**
// 		 * @var array list of scenarios that the validator should not be applied to.
// 		 * Each array value refers to a scenario name with the same name as its array key.
// 		 * @since 1.1.11
// 		 */
// 		public except;
// 		/**
// 		 * @var boolean whether attributes listed with this validator should be considered safe for massive assignment.
// 		 * Defaults to true.
// 		 * @since 1.1.4
// 		 */
// 		public safe=true;
// 		/**
// 		 * @var boolean whether to perform client-side validation. Defaults to true.
// 		 * Please refer to {@link CActiveForm::enableClientValidation} for more details about client-side validation.
// 		 * @since 1.1.7
// 		 */
// 		public enableClientValidation=true;

// 	},

// 	/**
// 	 * Public Variables
// 	 */
// 	public: {
// 	},

// 	/**
// 	 * Methods
// 	 */
// 	methods: {

// 		/**
// 		 * Validates a single attribute.
// 		 * This method should be overridden by child classes.
// 		 * @param CModel $object the data object being validated
// 		 * @param string $attribute the name of the attribute to be validated.
// 		 */
// 		validateAttribute: function (object,attribute) {},

// 		*
// 		 * Creates a validator object.
// 		 * @param string $name the name or class of the validator
// 		 * @param CModel $object the data object being validated that may contain the inline validation method
// 		 * @param mixed $attributes list of attributes to be validated. This can be either an array of
// 		 * the attribute names or a string of comma-separated attribute names.
// 		 * @param array params initial values to be applied to the validator properties
// 		 * @return wnValidator the validator
		 
// 		function createValidator(name,object,attributes,params)
// 		{
// 			var params = params || {};
// 			if(is_string(attributes))
// 				attributes=preg_split('/[\s,]+/',attributes,-1,PREG_SPLIT_NO_EMPTY);

// 			if(undefined !== (params['on']))
// 			{
// 				if(is_array(params['on']))
// 					on=params['on'];
// 				else
// 					on=preg_split('/[\s,]+/',params['on'],-1,PREG_SPLIT_NO_EMPTY);
// 			}
// 			else
// 				on=array();

// 			if(undefined !== (params['except']))
// 			{
// 				if(is_array(params['except']))
// 					except=params['except'];
// 				else
// 					except=preg_split('/[\s,]+/',params['except'],-1,PREG_SPLIT_NO_EMPTY);
// 			}
// 			else
// 				except=array();

// 			if(method_exists(object,name))
// 			{
// 				validator=new CInlineValidator;
// 				validator.attributes=attributes;
// 				validator.method=name;
// 				if(undefined !== (params['clientValidate']))
// 				{
// 					validator.clientValidate=params['clientValidate'];
// 					unset(params['clientValidate']);
// 				}
// 				validator.params=params;
// 				if(undefined !== (params['skipOnError']))
// 					validator.skipOnError=params['skipOnError'];
// 			}
// 			else
// 			{
// 				params['attributes']=attributes;
// 				if(undefined !== (self::builtInValidators[name]))
// 					className=Yii::import(self::builtInValidators[name],true);
// 				else
// 					className=Yii::import(name,true);
// 				validator=new className;
// 				foreach(params as name:value)
// 					validator.name=value;
// 			}

// 			validator.on=empty(on) ? array() : array_combine(on,on);
// 			validator.except=empty(except) ? array() : array_combine(except,except);

// 			return validator;
// 		}

// 		/**
// 		 * Validates the specified object.
// 		 * @param CModel $object the data object being validated
// 		 * @param array $attributes the list of attributes to be validated. Defaults to null,
// 		 * meaning every attribute listed in {@link attributes} will be validated.
// 		 */
// 		validate: function (object,attributes)
// 		{
// 			var attributes = attributes || null;
// 			if(is_array(attributes))
// 				attributes=array_intersect(this.attributes,attributes);
// 			else
// 				attributes=this.attributes;
// 			foreach(attributes as attribute)
// 			{
// 				if(!this.skipOnError || !object.hasErrors(attribute))
// 					this.validateAttribute(object,attribute);
// 			}
// 		}

// 		/**
// 		 * Returns the JavaScript needed for performing client-side validation.
// 		 * Do not override this method if the validator does not support client-side validation.
// 		 * Two predefined JavaScript variables can be used:
// 		 * <ul>
// 		 * <li>value: the value to be validated</li>
// 		 * <li>messages: an array used to hold the validation error messages for the value</li>
// 		 * </ul>
// 		 * @param CModel $object the data object being validated
// 		 * @param string $attribute the name of the attribute to be validated.
// 		 * @return string the client-side validation script. Null if the validator does not support client-side validation.
// 		 * @see CActiveForm::enableClientValidation
// 		 * @since 1.1.7
// 		 */
// 		clientValidateAttribute: function (object,attribute)
// 		{
// 		},

// 		/**
// 		 * Returns a value indicating whether the validator applies to the specified scenario.
// 		 * A validator applies to a scenario as long as any of the following conditions is met:
// 		 * <ul>
// 		 * <li>the validator's "on" property is empty</li>
// 		 * <li>the validator's "on" property contains the specified scenario</li>
// 		 * </ul>
// 		 * @param string scenario scenario name
// 		 * @return boolean whether the validator applies to the specified scenario.
// 		 */
// 		applyTo: function (scenario)
// 		{
// 			if(undefined !== (this.except[scenario]))
// 				return false;
// 			return empty(this.on) || undefined !== (this.on[scenario]);
// 		},

// 		/**
// 		 * Adds an error about the specified attribute to the active record.
// 		 * This is a helper method that performs message selection and internationalization.
// 		 * @param CModel object the data object being validated
// 		 * @param string attribute the attribute being validated
// 		 * @param string message the error message
// 		 * @param array params values for the placeholders in the error message
// 		 */
// 		addError: function (object,attribute,message,params)
// 		{
// 			var params = params || {};
// 			params['{'+attribute+'}']=object.getAttributeLabel(attribute);
// 			object.addError(attribute,strtr(message,params));
// 		},

// 		/**
// 		 * Checks if the given value is empty.
// 		 * A value is considered empty if it is null, an empty array, or the trimmed result is an empty string.
// 		 * Note that this method is different from PHP empty(). It will return false when the value is 0.
// 		 * @param mixed $value the value to be checked
// 		 * @param boolean $trim whether to perform trimming before checking if the string is empty. Defaults to false.
// 		 * @return boolean whether the value is empty
// 		 */
// 		isEmpty: function (value,trim)
// 		{
// 			var trim = trim || false;
// 			return value===null || value===array() || value==='' || trim && is_scalar(value) && trim(value)==='';
// 		}

// 	}

// };
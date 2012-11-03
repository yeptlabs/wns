/**
 * Source of the wnTemplate class.
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
 * @package system.core.web
 * @since 1.0.0
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: [],

	/**
	 * Constructor
	 * {description}
	 */	
	constructor: function (text)
	{
		this.text = text || '';
	},

	/**
	 * PRIVATE
	 *
	 * Only get and set by their respectives get and set private functions.
	 *
	 * Example:
	 * If has a property named $id.
	 * It's getter function will be `this.getId`, and it's setter `this.setId`.
	 * To define a PRIVILEGED function you put a underscore before the name.
	 */
	private: {},

	/**
	 * Public Variables
	 * Can be accessed and defined directly.
	 */
	public: {

		/**
		 * @var string template to be matched
		 */
		text: '',

		/**
		 * @var string start of the template
		 */
		prefix: '[\{][\@|\#|\$|\!|\%|\:]?',

		/**
		 * @var string end of the template
		 */
		suffix: '\}',

		/**
		 * @var string check if the match is valid.
		 */
		templateCheck: '[\w|\.|\-]',

		/**
		 * @var string type object properties that may be replaced
		 */
		validTypes: 'string,number,boolean,date'

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Renders the layout of the view with all the page's information.
		 * @param object $object object to be matched.
		 * @param string $path path to the object as string (example: core.property)
		 */
		match: function (o,path)
		{
			var type = typeof o;
			if (!path)
			{
				var path='';
				this._text=this.text+'';
			}
			if (type == 'object' && path.split('.').length < 5)
			{
				for(n in o)
					this.match(o[n],path+n+'.');
			} else if (this.validTypes.indexOf(type) != -1)
			{
				this._text=this._text.replace(new RegExp(this.prefix+path.substr(0,path.length-1)+this.suffix,'gim'), function (txt) {
					if (txt.match(new RegExp(this.templateCheck,'gi')))
					{
						return (this.value+"");
					} else
						return txt;
				}.bind({ value: o }));
			}
			if (path=='') 
				return this._text;
		},
		
		/**
		 * Set the suffix of the template.
		 * @param string $reg regular expression
		 */
		setSuffix: function (reg)
		{
			this.suffix = reg || this.suffix;
			return this;
		},

		/**
		 * Set the prefix of the template.
		 * @param string $reg regular expression
		 */
		setPrefix: function (reg)
		{
			this.prefix = reg || this.prefix;
			return this;
		}

	}

};
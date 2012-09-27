/**
 * Source of the wnView class.
 * 
 * @author: Pedro Nasser
 * @link: http://pedroncs.com/projects/webnode/
 * @license: http://pedroncs.com/projects/webnode/#license
 * @copyright: Copyright &copy; 2012 WebNode Server
 */

/**
 * {full_description}
 *
 * @author Pedro Nasser
 * @version $Id$
 * @pagackge system.base
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
	 * @param VARTYPE $example description
	 */	
	constructor: function () {},

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
		 * @var string Page's title
		 */
		title: '',

		/**
		 * @var string Page's language
		 */
		language: '',

		/**
		 * @var string Page's layout
		 */
		layout: '',

		/**
		 * @var string Page's description
		 */
		description: '',

		/**
		 * @var string Page's keywords
		 */
		keywords: '', // Keywords

		/**
		 * @var string scripts that will be loaded and stored
		 */
		loadScript: []

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Renders the layout of the view with all the page's information.
		 */
		render: function () {	

			// Scripts.
			this.script = {};
			for (s in this.loadScript) {
				this.script[this.loadScript[s]] = "<script type='text/javascript'>\n"+((fs.readFileSync(this.super_.app.appPath+this.super_.app.config.path.public+this.super_.app.config.view.loadScriptPath+this.loadScript[s]+'.js')).toString())+"\n</script>";
			}

			// Menu
			var	_menu = '',
				_tplMenu = new this.super_.app.c.wnTemplate(this.super_.app.config.view.menuItemTemplate);
			for (m in this.super_.app.config.view.menu) {
				_menu += _tplMenu.match({'label':m,'url':this.super_.app.config.view.menu[m][0]});
			}
			this.menu = new this.super_.app.c.wnTemplate(this.super_.app.config.view.menuTemplate).match({'list':_menu});

			return (new this.super_.app.c.wnTemplate(this.layout,false)).match({'view':this});

		}

	}

};
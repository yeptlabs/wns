/**
 * Source of the wnView class.
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
	extend: ['wnComponent'],

	/**
	 * PRIVATE
	 */
	private: {},

	/**
	 * Public Variables
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
		 * Initializer
		 */	
		init: function () {
		 
			this.controller = this.getConfig('controller');
		 
		 },

		/**
		 * Renders the layout of the view with all the page's information.
		 */
		render: function () {	

			// Scripts.
			this.script = {};
			for (s in this.loadScript) {
				this.script[this.loadScript[s]] = "<script type='text/javascript'>\n"+((fs.readFileSync(this.controller.app.appPath+this.controller.app.getConfig('path').public+this.controller.app.getConfig('components').view.loadScriptPath+this.loadScript[s]+'.js')).toString())+"\n</script>";
			}

			// Menu
			var	_menu = '',
				_tplMenu = new this.controller.app.c.wnTemplate(this.controller.app.getConfig('components').view.menuItemTemplate);
			for (m in this.controller.app.getConfig('components').view.menu)
			{
				_menu += _tplMenu.match({'label':m,'url':this.controller.app.getConfig('components').view.menu[m][0]});
			}
			this.menu = new this.controller.app.c.wnTemplate(this.controller.app.getConfig('components').view.menuTemplate).match({'list':_menu});

			return (new this.controller.app.c.wnTemplate(this.layout,false)).match({'view':this});

		}

	}

};
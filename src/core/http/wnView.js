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
 * @package package.http
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
		 * Some code to execute every time before rendering.
		 */
		beforeRender: function () 
		{

		},

		/**
		 * Renders the layout of the view with all the page's information.
		 */
		render: function (cb) {	
			var exprt = {};
			this.beforeRender();
			Object.extend(true,exprt,self.data);
			exprt.view = this.export();
			var viewResult='';
			self.controller.template.render({
				name: self.controller.controllerName+'/'+self.name,
				source: self.layout
			},exprt,function (err,result) {
				cb&&cb(viewResult);
				viewResult=null;
			}).on('data',function (chunk) {
				viewResult+=chunk;
			});
		}

	}

};
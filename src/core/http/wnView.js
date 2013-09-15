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
	private: {},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var string Page's title
		 */
		title: null,

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
		render: function (cb) {	
			var exprt = {};
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
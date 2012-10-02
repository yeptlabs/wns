/**
 * Source of the wnModule class.
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
 * @package system.base
 * @since 1.0.0
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnComponent'],

	/**
	 * Constructor
	 * @param OBJECT $parent parent object.
	 * @param OBJECT $config configuration object.
	 */	
	constructor: function (parent,modulePath) {

		this.modulePath = modulePath || this.modulePath
		super_ = parent;

		this.preinit();

		this.importClasses();
		this.preloadComponents();
		this.attachBehaviors();
		this.configureFromFile(this.modulePath + this.configFile);

		this.init();

	},

	/**
	 * PRIVATE
	 */
	private: {
	
		_modules: {},
		_components: {},
		super_: undefined

	},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var STRING module configuration's file
		 */
		configFile: 'config.json',

		/**
		 * @var STRING module directory's path
		 */
		modulePath: './',

		/**
		 * @var ARRAY components to preload
		 */	
		preload: [],

		/**
		 * @var ARRAY behaviors to attach
		 */
		behaviors: {}
	
	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Create a wnBuilder to this module then import all classes from core.
		 */
		importClasses: function () {

			var _c = {};

			for (c in global.coreClasses) {
				var module = {},
				 _class = global.coreClasses[c];
				eval(_class);
				_c[c] = module.exports;
			}
			
			var classBuilder = new wns.wnBuild(_c);
			this.setComponent('classBuilder',classBuilder);

			classBuilder.build();

		},

		/**
		 *
		 */
		attachBehaviors: function () {
		
		},

		/**
		 * Extend this module configuration with new properties.
		 * @param OBJECT $extend configuration extension
		 * @param BOOLEAN $overwrite overwrite it?
		 */
		configure: function (extend, overwrite) {

			if (typeof extend != 'object') return false;

			this.config=Object.extend(true,this.config,extend);
			return true;

		},

		/**
		 * Get a JSON configuration from file then send it to the
		 * configure() method.
		 * @param STRING $file path to the file
		 * @return BOOLEAN success?
		 */
		configureFromFile: function (file) {

			if (!fs.existsSync(file)) return false;

			var _data = (fs.readFileSync(file,'utf8').toString())
						.replace(/\\/g,function () { return "\\"+arguments[0]; })
						.replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g,'');

			if(_data = JSON.parse(_data)) {
				this.configure(_data,true);
				return true;
			} else return false;
		
		},

		/**
		 * Puts a component under the management of the module.
		 * The component will be initialized by calling the init() method.
		 * @param STRING $id component ID
		 * @param BOOLEAN if successful true, else false
		 */
		setComponent: function (id,component) {
			if (!component) {
				delete _components[id];
			} else {
				_components[id]=component;
			}
		},

		/**
		 * Retrieves the named component.
		 * The component has to be declared in the global components list. A new instance will be created
		 * when calling this method with the given ID for the first time.
		 * @param STRING $id application module ID (case-sensitive)
		 * @return wnModule the module instance, false if the module is disabled or does not exist.
		 */
		getComponent: function (id) {
			if (_components[id] != undefined) 
				return _components[id];
			else if (this.classBuilder != undefined && this.classBuilder.has(id)) {
				var config = this.config[id] || {},
					component = this.classBuilder.create(id,config);
				component.init();
			}
		},

		/**
		 * Returns a value indicating whether the specified component is installed.
		 * @param STRING $id the component ID
		 * @return BOOLEAN whether the specified component is installed.
		 */
		hasComponent: function (id) {
		
		},

		/**
		 * Get all components from the list.
		 */
		getComponents: function (list) {
		},

		/**
		 * Preload all required components
		 */
		preloadComponents: function () {
			for (p in this.preload)
				this.getComponent(this.preload[p]);
		},

		/**
		 * Retrieves the named application module.
		 * The module has to be declared in the global modules list. A new instance will be created
		 * when calling this method with the given ID for the first time.
		 * @param string $id application module ID (case-sensitive)
		 * @return CModule the module instance, null if the module is disabled or does not exist.
		 */
		getModule: function (id) {
		
		},

		/**
		 * Returns a value indicating whether the specified module is installed.
		 * @param STRING $id the module ID
		 * @return BOOLEAN whether the specified module is installed.
		 */
		hasModule: function (id) {
		
		},

		/**
		 * Returns the configuration of the currently installed modules.
		 * @return array the configuration of the currently installed modules (module ID => configuration)
		 */
		getModules: function () {
		
		},

		/**
		 * Returns the parent object.
		 * @returen OBJECT the parent object.
		 */
		getParent: function () {
			return super_;
		},
		
		/**
		 * This methods is called before the real initialization of the module
		 */
		preinit: function () {},

		/**
		 * This methods is called after the real initialization of the module
		 */
		init: function () {}

	}

};
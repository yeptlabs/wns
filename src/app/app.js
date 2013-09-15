/**
 * Source of the application's run function.
 * 
 * @author: Pedro Nasser
 * @link: http://wns.yept.net/
 * @license: http://yept.net/projects/wns/#license
 * @copyright: Copyright &copy; 2012 WNS
 */

// Exports
module.exports = {

	// Extended methods
	methods: {

		/**
		 * Runtime function
		 */
		run: function ()
		{
			// Send a log to the application console
			this.e.log('Hello world! (edit this in the file `'+this.getConfig('appName')+'.js` in the app dir)');
		}

	}

};
/**
 * Source of the application main run function.
 * 
 * @author: Pedro Nasser
 * @link: http://wns.yept.net/
 * @license: http://yept.net/projects/wns/#license
 * @copyright: Copyright &copy; 2012 WNS
 */

/**
 * This function runs in the application context after 
 * the complete initialization.
 *
 * @author Pedro Nasser
 * @package system.core
 * @since 1.0.0
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
			var self = this;

			// Send a log to the application console
			this.e.log('Hello world! (this log is inside `default.js` in the app dir)');

			// Add an one-time event listener to the database handler
			// Once it connect.
			this.db.once('connect',function (e,err,con) {

				// Check connection
				if (err) 
					self.e.log('Database connection tested. [FAILED]');
				else 
					self.e.log('Database connection tested. [OK]');

				// MongoDB collection example usage
				//
				// con.collection('user', function (err, collection) {
				// 	collection.remove({ username: 'pedronasser' }, { w:1 }, function () {
				// 		collection.insert({ username: 'pedronasser', password: 'xt1200' }, function () {
				// 			if (err)
				// 				return false;
				// 			collection.find({ username: 'pedronasser' }).toArray(function (err, item) {
				// 				console.log(item);
				// 			});
				// 		});
				// 	});
				// });
		
				// MYSQL Query example usage
				// 
				//db.query('SELECT * FROM posts WHERE 1=1 LIMIT 1', function (err, rows) {
				//	console.log(err);
				//})

			});

		}

	}

};
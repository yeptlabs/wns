/**
 * UTIL: Recursive directory scan.
 * @param $dir STRING path to the directory
 * @param $done ARRAY callback that returns the list of files...
 */
module.exports = function(dir, done) {
  var results = [];
  var list = fs.readdirSync(dir);
	var i = 0;
	(function next() {
		var file = list[i++];
		if (!file) return done(null, results);
		file = dir + '/' + file;
		var stat = fs.statSync(file);
		if (stat && stat.isDirectory()) {
		  module.exports(file, function(err, res) {
			results = results.concat(res);
			next();
		  });
		} else {
		  results.push(file);
		  next();
		}
	})();
};
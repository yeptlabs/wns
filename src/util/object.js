/**
 * UTIL: Object functions extension.
 */
module.exports = {

	isEmpty: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	}

};
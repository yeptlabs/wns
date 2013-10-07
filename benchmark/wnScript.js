var times = process.argv[2] || 100;
var Damage = require('damage');

// Define the test enviroment
Damage.env({

});

// Prepare the test.
// This function will run before each test.
Damage.prepare(function () {
	global.WNS_QUIET_MODE= true;
	global.WNS_SHOW_LOAD= false;
	require(__dirname+'/src/wnInit.js');
	var compiler=wns.console.getComponent('classBuilder');
});

var damageOf = Damage({});

// damageOf('test',function (done) {
	// NEED TO BE DONE
// 	done();
// },times);
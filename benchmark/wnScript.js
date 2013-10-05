// Test Requirements
global.WNS_QUIET_MODE=true;
global.WNS_SHOW_LOAD=false;
require('../src/wnInit.js');
var compiler = wns.console.getComponent('classBuilder');
var damage = require('./damage.js');

// Test Resources
var times = process.argv[2] || 100;

// damage('test',function (done) {
	// NEED TO BE DONE
// 	done();
// },times);
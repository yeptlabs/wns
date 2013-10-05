// Test Requirements
global.WNS_QUIET_MODE=true;
global.WNS_SHOW_LOAD=false;
require('../src/wnInit.js');
var compiler = wns.console.getComponent('classBuilder');
var damage = require('./damage.js');

// Test Resources
var times = process.argv[2] || 100;

damage('adding random classes',function (done) {
	compiler.addSource('wn'+Math.random(),'../test/resources/wnFakeClass.js')
	done();
},times);

damage('compiling a new class',function (done) {
	compiler.build();
	done();
},times);

damage('creating wnComponent instances',function (done) {
	new compiler.classes.wnComponent;
	done();
},times);

damage('creating wnEvent instances',function (done) {
	new compiler.classes.wnEvent;
	done();
},times);
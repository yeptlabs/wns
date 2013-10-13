var times = process.argv[2] || 100;
var Damage = require('damage');

// Define the test enviroment
Damage.env({
	testObj: { a: { b: { c: 1 } } },
	i: 0,
	wnsPath: __dirname
});

// Prepare the test.
// This function will run before each test.
Damage.prepare(function () {
	global.WNS_QUIET_MODE= true;
	global.WNS_SHOW_LOAD= false;
	require(env.wnsPath+'/../src/wnInit.js');
	var compiler=wns.console.getComponent('classBuilder');
});

var damageOf = Damage({});

// Running tests
damageOf('adding random classes',function () {
	env.i++;
	compiler.addSource('wn'+env.i,'../test/resources/wnFakeClass.js')
	done();
},times)

damageOf('compiling a new class',function () {
	compiler.addSource('wn'+env.i,'../test/resources/wnFakeClass.js');
	start();
	compiler.build();
	done();
},times);

damageOf('creating wnComponent instances',function () {
	new compiler.classes.wnComponent;
	done();
},times);

damageOf('creating wnEvent instances',function () {
	new compiler.classes.wnEvent;
	done();
},times);

damageOf('exec a method of a instanciated class',function () {
	var instance = new compiler.classes.wnComponent;
	start();
	instance.setConfig(env.testObj)
	done();
},times*10)

damageOf('exec a method of a literal object',function () {
	compiler.classes.wnComponent.object.setConfig(env.testObj);
	done();
},times*10);
// Test Requirements
global.WNS_QUIET_MODE=true;
global.WNS_SHOW_LOAD=false;
require('../src/wnInit.js');
var assert = require('assert');
var _ = require('lodash');

// Test Resources
var className = 'wnConsole';
var compiler = wns.console.getComponent('classBuilder');
var instance;
var methods;

// Test Run
describe(className, function () {
	it('should be instantiated without problems', function (done) {
		instance = new compiler.classes[className](wns.console,{},wns.console.modulePath,wns.console.npmPath,compiler.classesPath);
		methods = compiler.classes[className].build.methods;
		done();
	});

	it('should execute all its methods without problems',function (done) {
		for (m in methods)
			instance[m]();
		done();
	});

	// SPECIFICS TESTS
	// NEED TO BE DONE

});
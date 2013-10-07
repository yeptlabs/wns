// Test Requirements
global.WNS_QUIET_MODE=true;
global.WNS_SHOW_LOAD=false;
require('../src/wnInit.js');
var assert = require('assert');
var _ = require('lodash');

// Test Resources
var className = 'wnComponent';
var compiler = wns.console.getComponent('classBuilder');
var instance;
var methods;

// Test Run
describe(className, function () {
	it('should be instantiated without problems', function (done) {
		instance = new compiler.classes[className]({ myConfigTest: 1 },compiler.classes);
		methods = compiler.classes[className].build.methods;
		done();
	});

	it('should execute all its methods without problems',function (done) {
		for (m in methods)
			instance[m]();
		done();
	});

	// SPECIFICS TESTS
	it('should save configuration when is instantiated',function (done) {
		assert.equal(1,instance.getConfig('myConfigTest'))
		done();
	});

	// Unit Test: setConfig / getConfig
	it('setConfig/getConfig unit test',function (done) {
		instance.setConfig({ a: 4123 });
		instance.setConfig({ b: { c: { d: 4123 } } });
		assert.equal(4123,instance.getConfig('a'))
		assert.equal(4123,instance.getConfig().a);
		assert.equal(4123,instance.getConfig('b').c.d);
		done();
	});

	// NEED TO BE DONE

});
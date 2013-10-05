// Test Requirements
var wnBuild = require('../src/wnBuild.js');
var assert = require('assert');
var _ = require('underscore');

// Test Resources
var compiler;
var instance;
var testClassesPath = { "wnComponent": "src/core/base/wnComponent.js" };
var fakeModule = {
	getClassName: function () { return 'WNS' },
	getModulePath: function () { return process.cwd() },
	npmPath: [process.cwd()+'/node_modules/']
}

// Test Run
describe('wnBuild', function () {
	it('should accept classes path on constructor', function (done) {
		compiler = new wnBuild(testClassesPath,fakeModule);
		assert.notEqual(false,compiler);
		done();
	});

	it('should accept classes path on addSource', function (done) {
		var result=compiler.addSource("wnEvent","src/core/base/wnEvent.js");
		assert.notEqual(false,result);
		done();
	});

	it('should compile valid classes', function (done) {
		compiler.build();
		instance=new compiler.classes.wnEvent;
		assert.equal(true,_(instance).isObject())
		done();
	});

	it('should accept invalid classes on addSource()', function (done) {
		var result = compiler.addSource('wnBuild','src/wnBuild.js',true);
		assert.notEqual(false,result);
		done();
	});

	it('should ignore invalid classes on load()', function (done) {
		compiler.load('wnBuild');
		assert.equal(undefined,compiler.classesBuild.wnBuild);
		done();
	});

	it('should ignore valid classes with invalid extensions', function (done) {
		compiler.addSource('wnConsole','src/wnConsole.js');
		assert.equal(undefined,compiler.classesBuild.wnConsole);
		done();
	});

	it('should look for npm dependencies in node_modules/ directories', function (done) {
		compiler.addSource('wnFakeClass','test/resources/wnFakeClass.js');
		compiler.build();
		assert.notEqual(undefined,compiler.classesBuild.wnFakeClass);
		assert.notEqual(undefined,compiler.classes.wnFakeClass);
		assert.notEqual(undefined,compiler.loadedModules.npm);
		assert.notEqual(undefined,compiler.loadedModules.mocha);
		assert.notEqual(undefined,compiler.loadedModules.commander);
		assert.equal(undefined,compiler.loadedModules.falseModule);
		done();
	});

});

describe('an instance of a compiled class', function () {
	it('should have npm dependencies inside its methods scope', function (done) {
		var fakeInstance = new compiler.classes.wnFakeClass;
		var mocha = fakeInstance.getMocha();
		assert.notEqual(undefined,mocha);
		assert.notEqual(1,mocha);
		done();
	});

	it('should have variable self in all functions scopes', function (done) {
		assert.equal(instance,instance.info())
		done();
	});

	it('should support promises functions', function (done) {
		var promise = instance.$getFile('src/wnBuild.js');
		assert.notEqual(undefined,promise.catch)
		done();
	});

	it('should return the correct getClassName()', function (done) {
		assert.equal('wnEvent',instance.getClassName())
		assert.equal('wnEvent',instance.className)
		done();
	});

	it('should be instanceOf() what it extends', function (done) {
		assert.equal(true,instance.instanceOf('wnComponent'))
		done();
	});

	it('should access methods and properties from what it extends', function (done) {
		instance.setConfig({ test: '1k2j41251423651423' })
		assert.equal('1k2j41251423651423',instance.getConfig('test'))
		done();
	});

	it('should have different memory addresses for private/public properties', function (done) {
		instance.testingProperty = '1k2j41251423651423';
		var otherInstance = new compiler.classes.wnEvent;
		otherInstance.setConfig({ test: '654d65sda4f56dsa4f56ds4f' })
		otherInstance.testingProperty = '654d65sda4f56dsa4f56ds4f';
		assert.equal('1k2j41251423651423',instance.getConfig('test'))
		assert.equal('1k2j41251423651423',instance.testingProperty)
		assert.equal('654d65sda4f56dsa4f56ds4f',otherInstance.getConfig('test'))
		assert.equal('654d65sda4f56dsa4f56ds4f',otherInstance.testingProperty)
		done();
	});
});
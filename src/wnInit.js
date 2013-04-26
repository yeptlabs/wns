/**
 * @WNS - A NodeJS MVC Framework and HTTP Server
 * 
 * @author: Pedro Nasser
 * @link: http://wns.yept.net/
 * @license: http://yept.net/projects/wns/#license
 * @copyright: Copyright &copy; 2012 WNS
 */

/**
 * Description coming soon.
 *
 * @author Pedro Nasser
 * @package system
 * @since 1.0.0
 */

global.WNS_SHOW_LOAD = typeof WNS_SHOW_LOAD !== 'undefined' ? WNS_SHOW_LOAD : true;
global.WNS_QUIET_MODE = typeof WNS_QUIET_MODE !== 'undefined' ? WNS_QUIET_MODE : false;

var memory = process.memoryUsage().rss,
	sl = WNS_SHOW_LOAD;

 console.log('\n  o       o o--o  o--o (TM)');
 console.log('  |   o   | |   | o__');
 console.log('   \\ / \\ /  |   |    o');
 console.log('    o   o   o   o o--o');
 console.log('\n         powered by YEPT(R)');
 console.log();

// Loading requirements..
try
{

	global.sourcePath = 'src/';
	global.cwd = __dirname+'/../';
	global._r = require;
	sl&&console.log(' CWD: '+cwd);
	sl&&console.log(' SOURCEPATH: '+cwd+sourcePath);
	sl&&console.log();

	// WNS object.
	// Will contain the classes to build and load.
	process.wns = global.wns = {};
	global.wns.info=_r(cwd+'package.json');

	sl&&console.log(' Loading and compiling:');

	sl&&console.log(' - Required utilities..');
	global._walk = _r(cwd+sourcePath+'util/recursiveReadDir');
	Object.extend = _r(cwd+sourcePath+'util/extend');
	Object.extend(true,Object,_r(cwd+sourcePath+'util/object'));

	sl&&process.stdout.write(' - Required node modules..');
	var nm = ['http','fs','path','url','zlib','crypto','stream','util','events','buffer'];
	for (d in wns.info.dependencies)
		nm.push(d);
	for (n in nm)
		global[nm[n].replace(/\W|\_/gim,'')] = _r(nm[n]);
	if (fs.existsSync == undefined)
		fs.existsSync = path.existsSync;
	global.emitter = events.EventEmitter;
	global.Buffer = buffer.Buffer;
	cwd=path.normalize(cwd);
	sourcePath=path.normalize(sourcePath);
	sl&&process.stdout.write(' ('+nm.length+' modules)\n');

} catch (e) {
	sl&&console.log('Failed to load some dependencies...');
	throw e;
	process.exit();
}

// We need this class for building the rest of the required classes.
wns.wnBuild = _r(cwd+sourcePath+'wnBuild.js');

sl&&process.stdout.write(' - Required classes...');

var _coreClasses={}, toBuild = {};
// Recursivelly getting list of all classes in the core/
_walk(cwd+sourcePath+'core', function (err, classes) {

	// Load core class sources to the memory.
	for (c in classes)
	{

		// Loading class source.
		var _class = fs.readFileSync(classes[c]).toString(),
			className = classes[c].split('/').pop().split('.')[0];

		// Compiling the class.
		var module = {};
		eval(_class);

		// Check structure.
		if (wns.wnBuild.prototype.checkStructure(module.exports))
		{
			// Send it to the build list.
			toBuild[className] = module.exports;
		} else
		{
			// Send it to the WNS.
			wns[className] = module.exports;
		}

		// Store class source.
		_coreClasses[className] = _class; 
	}


	// We will compile the new classes to the WNS object.
	var compiled = (new wns.wnBuild(toBuild,cwd).build()),
		loaded = 0;
	for (c in toBuild)
	{
		if (compiled[c].loaded)
		{
			// Store compiled classes as read-only.
			Object.defineProperty(wns, c, {
				value: compiled[c],
				writable: false,
				configurable: false,
				enumerable: true
			});
			loaded++;
		}
	}

	sl&&process.stdout.write(' ('+loaded+' classes)\n');

});

// Sending coreClasses to global, read-only.
Object.defineProperty(global, 'coreClasses', { value: _coreClasses, writable: false, configurable: false });

// Clear require cache.
memory = (new Number((process.memoryUsage().rss - memory) / 1024 / 1024)).toFixed(2);
sl&&console.log(' - WNS version: '+wns.info.version);
sl&&console.log(' - Core memory usage: '+memory+' mb');

sl&&console.log('');

// Create a new console
wns.console = new wns.wnConsole({ modulePath: cwd }, cwd);

//

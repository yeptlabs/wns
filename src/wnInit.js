/**
 * @WNS - The NodeJS Middleware and Framework
 * 
 * @copyright: Copyright &copy; 2012- YEPT &reg;
 * @page: http://wns.yept.net/
 * @docs: http://wns.yept.net/docs/
 * @license: http://wns.yept.net/license/
 */

/**
 * WNS`s main file. It initiates and load every thing.
 *
 * @author Pedro Nasser
 */

 console.log('\n  o       o o--o  o--o (TM)');
 console.log('  |   o   | |   | o__');
 console.log('   \\ / \\ /  |   |    o');
 console.log('    o   o   o   o o--o');
 console.log('\n         powered by YEPT(R)');
 console.log();


// DEFINING ZONE...

global.WNS_SHOW_LOAD = (process.argv.indexOf('--silent') != -1 ? true : (typeof WNS_SHOW_LOAD !== 'undefined' ? WNS_SHOW_LOAD : true));
global.WNS_QUIET_MODE = (process.argv.indexOf('--quiet') != -1 ? true : (typeof WNS_QUIET_MODE !== 'undefined' ? WNS_QUIET_MODE : false));
global.WNS_TEST = (process.argv.indexOf('--test') != -1 || process.env.TEST ? true : false);
global.WNS_DEV = (process.argv.indexOf('--dev') != -1 || process.env.DEV ? true : false);
global._r = require;

// Checking for v8debug
if (process.execArgv.indexOf('--expose-debug-as=v8debug') !==-1)
	var foundDebug = true;
else
	global.v8debug=undefined;

var memory = process.memoryUsage().rss,
	sl = WNS_SHOW_LOAD,
	builder;



// LOADING ZONE...
try
{

	// Defining base paths
	global.sourcePath = 'src/';
	global.cwd = __dirname.replace(/\\\\/g,"/").replace(/\\/g,"/")+'/../';
	mainPath = process.mainModule.filename.replace(/\\\\/g,"/").replace(/\\/g,"/").split('/');
	mainPath.pop();
	global.mainPath = mainPath.join("\/");

	sl&&console.log(' CWD: '+cwd);
	sl&&console.log(' SOURCEPATH: '+cwd+sourcePath);
	sl&&console.log(' MAINPATH: '+mainPath);
	sl&&process.stdout.write(' MODES: ');
	for (g in global)
		if (g.indexOf('WNS_')!=-1 && global[g]==true)
			sl&&process.stdout.write(g.replace('WNS_','')+' ');
	sl&&console.log("\n");

	if (!WNS_DEV)
		sl&&console.log(" Running PRODUCTION MODE - Run with --dev to switch to development.\n");

	// WNS's Global Object
	process.wns = global.wns = {};
	// Importing WNS package info
	global.wns.info=_r(cwd+'package.json');

	sl&&console.log(' Loading and compiling:');

	// Importing some utils.
	sl&&console.log(' - Required utilities..');
	global._walk = _r(cwd+sourcePath+'util/recursiveReadDir');
	Object.extend = _r(cwd+sourcePath+'util/extend');
	Object.extend(true,Object,_r(cwd+sourcePath+'util\/object'));

	// Importing node's core modules and npm modules.
	sl&&process.stdout.write(' - Required node modules..');
	var nm = ['http','fs','path','url','zlib','crypto','stream','util','events','buffer','domain'];
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
	// Catch any error...
	sl&&console.log(' Failed to load some dependencies...');
	throw e;
	process.exit();
}



// BUILDING ZONE...

// Get THE BUILDER.
wns.wnBuild = _r(cwd+sourcePath+'wnBuild.js');

sl&&process.stdout.write(' - Required classes...');
var _coreClasses={}, toBuild = {};
// Recursivelly getting list of all classes in the core/
_walk(cwd+sourcePath+'core', function (err, classes) {

	// // Load core class sources to the memory.
	for (c in classes)
	{
		// Loading class source from file.
		var _class = fs.readFileSync(classes[c]).toString(),
			className = classes[c].split('/').pop().split('.')[0];

		// Store class source.
		_coreClasses[className] = _class; 
	}


	// We will compile the new classes to the WNS object.
	builder = new wns.wnBuild(_coreClasses,{
		getClassName: function () { return 'WNS' },
		getModulePath: function () { return cwd },
		npmPath: [cwd+'node_modules/'],
	});

	var compiled = builder.build(),
		loaded = 0;
	for (c in compiled)
		if (compiled[c].loaded)
		{
			// Store compiled classes as read-only.
			Object.defineProperty(wns, c, {
				value: compiled[c],
				writable: false,
				configurable: false,
				enumerable: true
			});
			wns[c]=compiled[c];
			loaded++;
		}

	sl&&process.stdout.write(' ('+loaded+' classes)\n');

});

// Saving the core classes source in the global (read-only)
Object.defineProperty(global, 'coreClasses', { value: _coreClasses, writable: false, configurable: false });

// Clear require cache.
memory = (new Number((process.memoryUsage().rss - memory) / 1024 / 1024)).toFixed(2);
sl&&console.log(' - WNS version: '+wns.info.version);
sl&&console.log(' - Core memory usage: '+memory+' mb');
builder.buildTime&&
sl&&console.log(' - Build time: '+builder.buildTime+' ms');

sl&&console.log('');

// FINISHED LOADING...



// START WNS CONSOLE
wns.console = new wns.wnConsole({ modulePath: cwd }, {}, cwd, [cwd]);
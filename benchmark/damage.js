var q = require('q');
var util = require('util');
var queue = [];
var running = false;
var initialData;
var resultListener;

console.log('\n  How much is the DAMAGE of...')

function damage(desc, fn, repeats)
{
	var defer = q.defer();
	repeats = repeats || 1;
	defer.promise.defaultMessage=true;
	defer.promise.is = listener;

	add(desc,fn,repeats,defer);

	if (!running)
		next();

	return defer.promise;
}

function add (desc,fn,repeats,defer)
{
	queue.push([desc,fn,repeats,defer])
}

function run (desc,fn,repeats,defer)
{
	fn&&fn(defer.resolve);
}

function listener (fn)
{
	this.defaultMessage=false;
	resultListener=fn;
}

function getInitialData ()
{
	initialData={};
	initialData.time=+new Date;
	initialData.rss=process.memoryUsage().rss;
	initialData.heapTotal=process.memoryUsage().heapTotal;
	initialData.heapUsed=process.memoryUsage().heapUsed;
}

function processResult ()
{
	var result = initialData;
	result.time = +new Date - initialData.time+'ms';
	result.rss = ((process.memoryUsage().rss - initialData.rss)/1024).toFixed(2)+'kb';
	result.heapTotal = ((process.memoryUsage().heapTotal - initialData.heapTotal)/1024).toFixed(2)+'kb';
	result.heapUsed = ((process.memoryUsage().heapUsed - initialData.heapUsed)/1024).toFixed(2)+'kb';
	return result;
}

function handleDone (desc,fn,repeats,defer)
{
	if (defer.promise.defaultMessage)
	{
		var dump = util.inspect(processResult());
		var dumpLines = dump.split('\n');
		for (var d=1;d<dumpLines.length;d++)
			dumpLines[d]='    '+dumpLines[d];
		console.log('  └─'+dumpLines.join('\n'))
	}
	else
		resultListener&&resultListener(processResult());

	running = false;
	next();
}

function next()
{
	if (queue.length>0)
	{
		console.log('');
		running = true;
		var task = queue.shift();
		process.nextTick(function () {
			getInitialData();
			console.log('  » '+task[0]+' ('+task[2]+'x)');
			var i=0;
			(function () {
				if (i>=task[2]) {
					handleDone(task[0],task[1],task[2],task[3]);
				}
				else {
					i++;
					task[3].promise.then(arguments.callee);
					run.apply(undefined,task);
				}
			})();
		});
	}
}

module.exports = damage;
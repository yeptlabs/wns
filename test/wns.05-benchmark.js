/**
 * Check all functions of the urlManager component.
 * Check if it parses correctly.
 *
 * @author Pedro Nasser
 * @version $Id$
 * @since 1.0.12
 */

var self=this,
	server = this.getServer(1),
	app = server.getApplication('test'),
	spawn = require('child_process').spawn,
   	validBenchs=0;

if (server.http.benchmark)
	return self.e.endTest();

// app.addListener('newRequest', function (e,req,resp) {
// 	console.log('newRequest');
// 	resp.end('okay');
// 	e.stopPropagation=true;
// });

app.addListener('readyRequest', function (e,req) {
	//console.log('readyRequest');
	req.send('okay');
	e.stopPropagation=true;
	req=null;
});

_walk('./test/benchmark',function (err,benchs) {

	if (err)
		process.exit(-1);

    benchs=benchs.sort(function(a, b) {
		return a < b ? -1 : 1;
    });

	var i = 0;
	(function () {

		if(benchs.length == i)
		{
			console.log('');
			console.log('[*] Done '+validBenchs+' benchmark(s).');
			self.e.endTest();
		}

		var args = arguments;
		if (benchs[i].split('.').pop()!='js')
		{
			i++;
			args.callee();
		} else {
			var b=spawn('node', [ benchs[i], 80, 1000, 1000 ]);
			b.once('close', function (code) {
				i++;
				validBenchs++;
  				args.callee();
  				b.kill();
			});
			b.stdout.on('data', function (data) {
				var data = data.toString('utf8').split("\n");
				for (d in data)
					if (data[d]!="")
						console.log('[*] -BENCH:'+benchs[i].split('/').pop()+'- '+data[d]);
			});
			b.stderr.once('data', function (data) {
			  if (/^execvp\(\)/.test(data))
			    b.kill();
			});
		}

	})(i);

});

'executed benchmark test.'
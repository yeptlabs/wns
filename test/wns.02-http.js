/**
 * Check if the wnHttp component sends
 * the request correctly
 *
 * @author Pedro Nasser
 * @version $Id$
 * @since 1.0.12
 */

var self = this,
	server = this.getServer(1),
	appConfig = server.getModulesConfig(),
	httpComponent = server.getComponent('http'),
	app = server.getApplications(),
	testedApp = 0,
	totalApps = 0,
	connections = 0,
	finished = 0,
	connectionTime = 0,
	numConnections = 10000,
	apps = {};

self.e.log('-------------------------------------');
self.e.log('Benchmarking `wnHttp` component.');

for (a in appConfig)
{
	appConfig[a].domain='notvalid';
	totalApps++;
}

http.globalAgent.maxSockets = numConnections*totalApps;

for (a in appConfig)
{
	var a=a;
	appConfig[a].domain = 'localhost';

	apps[a]={};

	server.getModule(a).addListener('readyRequest',function (e,r) {
		r.once('run',function () {
			appConfig[a].domain='notvalid';
			connectionTime += (+new Date - r.created);
			finished++;
			if (finished == totalApps*numConnections)
			{
				self.e.log('--------- BENCHMARK RESULT ----------');
				self.e.log('TOTAL REQUESTS: '+finished);
				self.e.log('AVG REQUEST TIME: '+(connectionTime/connections)+'ms');
				self.e.log('-------------------------------------');
				self.e.endTest();
			}
		});
	});

	for (i=0;i<numConnections;i++)
	{

		apps[a][i] = new http.ClientRequest({
			hostname: 'localhost',
			port: 80,
			path: '/',
			method: 'GET'
		});
		apps[a][i].created = +(new Date);

		apps[a][i].on('socket',function (socket) {

			var i = this.index;

			apps[a][i].socket = apps[a][i].connection = socket;
			var resp = new http.ServerResponse(apps[a][i]);

			apps[a][i].headers={};
			apps[a][i].headers['host'] = appConfig[a].domain;
			apps[a][i].url = '/';
			connections++;
			apps[a][i].code = connections+'-'+apps[a][i].created;

			httpComponent.e.open(apps[a][i],resp);

		}.bind({ index: i  }));

	}

}

self.e.log('Benchmark running...');
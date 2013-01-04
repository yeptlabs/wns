/**
 * Check if the wnHttp component sends
 * the request correctly
 *
 * @author Pedro Nasser
 * @version $Id$
 * @since 1.0.0
 */

var self = this,
	server = this.getServer(1),
	appConfig = server.getConfig('app'),
	httpComponent = server.getComponent('http'),
	app = server.getApplications(),
	testedApp = 0,
	totalApps = 0;

for (a in app)
{
	appConfig[a].domain='notvalid';
	totalApps++;
}

for (a in app)
{
	appConfig[a].domain = 'localhost';
	req = http.get('http://localhost:'+httpComponent.getConfig('listen')[0]+'/',
		function (resp) {
			resp.on('data', function (data) {
				testedApp++;
				if (testedApp == totalApps)
					self.e.endTest();
			});
		});
	req.setTimeout(5000, function () {
		self.errors++;
		self.e.endTest();
	});
	req.on('error', function (e) {
		throw e;
		self.errors++;
		self.e.endTest();
	});
	appConfig[a].domain='notvalid';
}
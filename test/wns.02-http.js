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
	var req = { headers: {}, parsedUrl: {}, url: '' },
		resp = new http.ServerResponse(req);

	req.headers={};
	req.headers['host'] = appConfig[a].domain;
	req.url = '/';

	httpComponent.once('redirect', function () {
		testedApp++;
		if (testedApp == totalApps)
			self.e.endTest();
	});
	httpComponent.e.open(req,resp);
	
	appConfig[a].domain='notvalid';
}
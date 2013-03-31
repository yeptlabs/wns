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
	appConfig = server.getConfig('app'),
	httpComponent = server.getComponent('http'),
	app = server.getApplications(),
	testedApp = 0,
	totalApps = 0;

	try {
		server.http.benchmark=false;
		httpComponent.listen();
	} catch (e) { server.http.benchmark=false; }

for (a in app)
{
	appConfig[a].domain='notvalidx';
	totalApps++;
}

for (a in app)
{
	appConfig[a].domain = 'localhost';
	var req = new http.ClientRequest({ agent: false }),
		resp = new http.ServerResponse(req);

	req.headers={};
	req.headers['host'] = new String(appConfig[a].domain);
	req.url = '/';

	httpComponent.getEvent('redirect').once(function (e) {
		var a;
		e.stopPropagation=true;
		testedApp++;
		if (testedApp == totalApps)
			self.e.endTest();
	}, true);
	httpComponent.e.open(req,resp);
	
	appConfig[a.replace('app-','')].domain='127.0.0.1';
}

'executed http test.'
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

	//http.createServer(function () {}).listen(80);
	server.benchmark=true;
	var listenError=false;
	process.once('uncaughtException',function () {
		listenError=true;
		server.benchmark=false;
		self.e.endTest();
	});
	try {
		httpComponent.listen(function () {

			if (listenError)
				return false;
			
			for (a in app)
			{
				appConfig[a].domain='notvalid';
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
					{
						console.log(httpComponent.connection._handle.owner);
						self.e.endTest();
					}
				}, true);
				httpComponent.e.open(req,resp);
				
				appConfig[a.replace('app-','')].domain='127.0.0.1';
			}

		});
	} catch (e)
	{
		console.log('error');
	}

'executed http test.'
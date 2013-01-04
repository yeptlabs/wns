/**
 * Check all functions of the urlManager component.
 * Check if it parses correctly.
 *
 * @author Pedro Nasser
 * @version $Id$
 * @since 1.0.0
 */

var server = this.getServer(1),
	app = server.getApplication('wns-test'),
	urlManager = app.getComponent('urlManager'),
	urlTests = [
		'/test.jpg', '/test/site'
	],
	req = new http.ClientRequest({ agent: false });

for (t in urlTests)
{
	req.url = urlTests[t];
	req.parsedUrl = url.parse(req.url);

	if (!urlManager.parseRequest(req))
		this.errors++;
}

this.e.endTest();
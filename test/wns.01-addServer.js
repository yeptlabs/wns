/**
 * Add a server to the console.
 * If no config found, copy the default
 *
 * @author Pedro Nasser
 * @version $Id$
 * @since 1.0.12
 */

var serverConfig = {},
	consoleID = this.getServerModules().length+1;
	serverConfig[consoleID] = {
		"modulePath": "./test/tmp",
		"serverID": consoleID,
		"appDirectory": "app/",
		"app": {
			"test": {
				"appPath": "test/",
				"domain": "127.0.0.1"
			}
		},
		"components": {
			"http": {
				"class": "wnHttp",
				"listen":[80],
				"alias": "http",
				"autoListen": false
			}
		}
	};

this.setServers(serverConfig);
var server = this.createServer(consoleID);
server.once('ready',function () {
	console.log(' ')
	console.log('[SERVER CONFIG] -------------------');
	console.log(util.inspect(server.getConfig()));
	console.log(' ')
	console.log('[APP CONFIG] -------------------');
	console.log(util.inspect(server.getApplication('test').getConfig()));
	console.log(' ')
	self.selectServer(consoleID);
	self.e.endTest();
});


'executed addServer test.'
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
		"app": {
			"test": {
				"appPath": "test/",
				"domain": "127.0.0.1",
				"dbEngine": "mongo"
			}
		},
		"components": {
			"http": {
				"listen":[80]
			}
		}
	};

this.setServers(serverConfig);
var server = this.createServer(consoleID);
console.log(' ')
console.log('[SERVER CONFIG] -------------------');
console.log(util.inspect(server.getConfig()));
console.log(' ')
console.log('[APP CONFIG] -------------------');
console.log(util.inspect(server.getApplication('test').getConfig()));
console.log(' ')
this.selectServer(consoleID);

this.e.endTest();
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
			"wns-test": {
				"appPath": "wns-test/",
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
this.selectServer(consoleID);

this.e.endTest();
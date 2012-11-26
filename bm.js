var request = require('request'),
	requests = 500,
	http = require('http');
	http.globalAgent.maxSockets = requests,
	connections = 0;
	for (var i=0;i<requests;i++)
	{
		request('http://www.dm.com.br/texto/'+(1000+Math.round(Math.random()*9000)), function (error, response, body) {
			connections++;
			console.log(connections);
			if (connections == requests-1)
			{
				console.log('feito.');
			}
		});
	}
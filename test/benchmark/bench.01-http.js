console.log('Running HTTP benchmark...');

var sys = require('sys'),
    http = require('http');
 
// Usage:
// node client.js port, num, c
 
var port = process.argv[2];
var n = process.argv[3];
var c = process.argv[4];
 
var count = n;
var data = 0;
var start = new Date().valueOf();

for (var i = 0; i < c; i++) {
    (function () {
        (function get() {
            function _finish () {
                count--;
                if (count > 0) get();
                else end();
            }
            var req = http.request({
            	hostname: '127.0.0.1',
            	method: "GET",
            	path: "/",
            	port: port
            }, function (res) {
                res.on('data', function (chunk) {
                	//console.log(chunk.toString('utf8'));
                    data += chunk.length;
                });
                res.once('end', function () {
                    _finish();
                });
            });
            req.on('error', function(e) { _finish(); console.log(e); });
            req.end();
        }());
    }());
}
 
var done = false;
function end() {
    if (done) return;
    done = true;
    var seconds = (new Date().valueOf() - start) / 1000;
    console.log("Port: " + port);
    console.log("Num Requests: " + n);
    console.log("Concurrency: " + c);
    console.log("Total Data: " + data + " bytes");
    console.log("Total Time: " + seconds + " seconds");
    console.log((n / seconds) + " Requests/sec");
    console.log((data / 1024 / seconds) + " Kilobytes/sec");
}
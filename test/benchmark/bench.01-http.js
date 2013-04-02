console.log('Running HTTP benchmark...');

var sys = require('sys'),
    http = require('http'),
    port = process.argv[2],
    n = process.argv[3],
    c = process.argv[4],
    count = n,
    data = 0,
    errors = 0,
    success = 0,
    start = new Date().valueOf();

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
                res.once('data', function (chunk) {
                    success++;
                });
                res.on('data', function (chunk) {
                	//console.log(chunk.toString('utf8'));
                    data += chunk.length;
                });
                res.once('end', function () {
                    //console.log('ok')
                    _finish();
                });
            });
            req.on('error', function(e) {});
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
    console.log("Success: " + success);
    console.log("Errors: " + errors);
    console.log("Total Data: " + data + " bytes");
    console.log("Total Time: " + seconds + " seconds");
    console.log((success / seconds) + " Requests/sec");
    console.log((data / 1024 / seconds) + " Kilobytes/sec");
}
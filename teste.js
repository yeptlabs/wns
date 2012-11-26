var mem = process.memoryUsage().rss,
	intervalTime = 1000;
/*setInterval(function () {
	console.log(process.memoryUsage().rss-mem);
	mem = process.memoryUsage().rss;
},1000);*/


/* loop = function () {
	console.log(process.memoryUsage().rss);
	mem = process.memoryUsage().rss;
	setTimeout(loop,1000);
};
(loop)();*/

function interval(){
  process.nextTick(doIntervalStuff) 
}

function doIntervalStuff() {
  var now = +new Date;
  if (+new Date - initial > intervalTime)
  {
	console.log(process.memoryUsage().rss - mem);
	mem = process.memoryUsage().rss;
	initial = now;
  }
  interval();
}

var initial=+new Date;
doIntervalStuff();
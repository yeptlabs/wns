/**
 * @WNS - The NodeJS Middleware and Framework
 * 
 * @copyright: Copyright &copy; 2012- YEPT &reg;
 * @page: http://wns.yept.net/
 * @docs: http://wns.yept.net/docs/
 * @license: http://wns.yept.net/license/
 */

/**
 * Loads WNS.
 *
 * @author Pedro Nasser
 */

require('./src/wnInit.js');
module.exports = wns;

console.time('object declare')
for (var i=0;i<10000;i++)
	var c = wns.console.c.wnComponent.call({ type: 'object' });
console.timeEnd('object declare')

console.time('object call')
for (var i=0;i<100000;i++)
	c.setConfig({ a:1, b:2, c:3 });
console.timeEnd('object call')

console.time('prototype create')
for (var i=0;i<10000;i++)
	var c = new wns.console.c.wnComponent();
console.timeEnd('prototype create');

console.time('prototype create')
for (var i=0;i<100000;i++)
	c.setConfig({ a:1, b:2, c:3 });
console.timeEnd('prototype create');
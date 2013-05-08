/**
 * Check all functions of the cache component.
 *
 * @author Pedro Nasser
 * @version $Id$
 * @since 1.0.12
 */

var server = this.getServer(1),
	app = server.getApplication('test'),
	cache = app.getComponent('cache'),
	testValue = Math.random();

if (!cache)
{
	this.errors++;
	this.e.endTest();
}

cache.set('test',testValue);
var result = cache.get('test');

if (result !== testValue)
	this.errors++;

this.e.endTest();

'executed cache test.'
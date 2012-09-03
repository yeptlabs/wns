/**
 * Source of the wnConnection class.
 * 
 * @author: Pedro Nasser
 * @link: http://pedroncs.com/projects/webnode/
 * @license: http://pedroncs.com/projects/webnode/#license
 * @copyright: Copyright &copy; 2012 WebNode Server
 */

/**
 * {full_description}
 *
 * @author Pedro Nasser
 * @version $Id$
 * @pagackge system.base
 * @since 1.0.0
 */

// Exports.
module.exports = wnConnection;
	
/**
 * Constructor
 * {description}
 */	
 function wnConnection (extend) {

	// Extend with wnObject
	util.inherits(this,wnObject);

	// Extend this object with the wnHTTP properties..
	this.super_.extend(true, this, extend);
 
	/* HTTP Gateway */

	// Find out which the client want to access
	this.parsedUrl=url.parse(this.request.url);
	this.header=wnObject.extend(true,{},this.app.config.http.header);

	// Check if its a controller/action or just a public file.
	if (this.parsedUrl.pathname.match(/[\w|\/]+/gim).length == 1)
	{
		this.controllerHandler();
	} else {
		this.publicHandler();
	}

}
/**
 * Source of the wnView class.
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
module.exports = wnView;
	
/**
 * Constructor
 * {description}
 */
function wnView() {}

/**
 * A class of template inside the wnView class.
 * Usage:
 * - First create a new template: var template=new wnView.template(text);
 * - Then match all template tags with an object: template.match(object);
 * @param string $text the object to be matched
 * @param string $path path to the object as string (example: core.property)
 */
wnView.prototype.template = function (text,clean) { 

	this.text = text;
	this.clean = clean || this.clean;
	this.match = function (object,path) {
		if (!path) {
			var path='';
			this._text=this.text;
		}
		if (typeof object == 'object' && path.split('.').length < 5) {
			for(n in object) this.match(object[n],path+n+'.');
		} else {
			this._text=new String(this._text).replace(new RegExp('[{\/\!]'+path.substr(0,path.length-1)+'}','gim'), (new String(object)).replace(/\{/gi,'&abrechave;').replace(/\}/gi,'&fechachave;'));
		}
		if (path=='') return (this.clean ? new String(this._text).replace(new RegExp('[{\/\!].*}','gim'),'') : this._text).replace(/\&abrechave\;/gi,'{').replace(/\&fechachave\;/gi,'}');
	}

};

/**
 * @var string Page's title
 */
wnView.prototype.title = '';

/**
 * @var string Page's language
 */
wnView.prototype.language = '';

/**
 * @var string Page's layout
 */
wnView.prototype.layout = '';

/**
 * @var string Page's description
 */
wnView.prototype.description = '';

/**
 * @var string Page's keywords
 */
wnView.prototype.keywords = ''; // Keywords

/**
 * @var string scripts that will be loaded and stored
 */
wnView.prototype.loadScript=[];

/**
 * Renders the layout of the view with all the page's information.
 */
wnView.prototype.render = function () {	

	// Scripts.
	this.script = {};
	for (s in this.loadScript) {
		this.script[this.loadScript[s]] = "<script type='text/javascript'>\n"+((fs.readFileSync(this.super_.super_.app.appPath+this.super_.super_.app.config.path.public+this.super_.super_.app.config.view.loadScriptPath+this.loadScript[s]+'.js')).toString())+"\n</script>";
	}

	// Menu
	_menu = '';
	for (m in this.super_.super_.app.config.view.menu) {
		_menu += new this.template(this.super_.super_.app.config.view.menuItemTemplate).match({'label':m,'url':this.super_.super_.app.config.view.menu[m][0]});
	}
	this.menu = new this.template(this.super_.super_.app.config.view.menuTemplate).match({'list':_menu});

	return (new this.template(this.layout,false)).match({'view':this});

}
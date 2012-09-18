/**
 * Source of the wnUrlRule class.
 *
 * Some codes were taken from Yii Framework source
 * (https://github.com/yiisoft/yii/blob/master/framework/web/CUrlManager.php)
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
module.exports = wnUrlRule;

// wnUrlRule Class
function wnUrlRule (route,pattern) {

	/**
	 * Constructor
	 * {description}
	 * Need revision.
	 * @param string route of the rule
	 * @param string pattern of the rule
	 */	
	this.construct = function (route,pattern) {

		function trim(str,chars){
			return ltrim(rtrim(str,chars),chars);
		}
		function ltrim(str,chars){
			chars=chars||'\\s';
			return str.replace(new RegExp("^["+chars+"]+","g"),"");
		}
		function rtrim(str,chars){
			chars=chars||'\\s';
			return str.replace(new RegExp("["+chars+"]+$","g"),"");
		}

		var tr = { '/': '\\/' },
			tokens = {}, matches, result;

		this.route=trim(route,'/');

		// Getting route translations
		if(this.route.indexOf('<')!==-1 && this.route.match(/<(\w+):?(\w+)?>/gi))
		{
			result = this.route.match(/<(\w+):?(\w+)?>/gi);
			for(r in result) {
				var _t=trim(result[r].replace(/[\<|\>]/gi,''),'/');
				this.translations[_t.split(':')[0]]=_t.split(':').length>1?_t.split(':')[1]:'';
			}
		}

		if (pattern.match(/<(\w+):?(.*?)?>/gi)) {

			matches = pattern.match(/<(\w+):?(.*?)?>/gi);

			for (m in matches) {
				var match = trim(trim(matches[m],'>'),'<'),
					param = match.split(':')[0],
					reg = match.split(':').length>1?match.split(':')[1]:'[^\/]+';
				if (this.translations[param] == undefined) this.params[param] = reg;
				else {
					this.patternList.push({ 'name': param, 'pattern': reg });
				}
			}

		}

		var p=rtrim(pattern,'*');
			p=trim(p,'/');

		this.template=p.replace(/<(\w+):?.*?>/gi,function () {
			return '<'+arguments[1]+'>';
		});

		this.pattern='^\/'+p.replace(/<(\w+):?.*?>/gi,function () {
			arguments[0]=trim(trim(arguments[0],'>'),'<');
			return (arguments[0].split(':').length>1?arguments[0].split(':')[1]:'[^\/]+');
		});

	};

	/**
	 * Read the request then parse the request url on this rule.
	 * @param wnUrlManager $manager the URL Manager
	 * @param wnHttpRequest $request the request object
	 */	
	this.parseRequest = function (manager,request) {
		var pathInfo = request.parsedUrl.pathname;
		if (pathInfo.match(new RegExp(this.pattern,'gi')) !== null) {

			// Declare result object.
			var result = {
				template: this.template,
				params: {},
				translation: this.route
			}, _urlPiece = pathInfo;

			// Searching for regexp from the pattern's list
			for (p in this.patternList) {
				var reg = this.patternList[p].pattern;
				result.params[this.patternList[p].name] = (_urlPiece.match(new RegExp('^\/'+reg,'gi'))[0]).replace(/^\//gi, '');
				_urlPiece=_urlPiece.replace(new RegExp('^\/'+reg,'gi'),'');
			}

			// Searching for regexp from the param's list
			for (p in this.params) {

				var reg = this.params[p],
					match = _urlPiece.match(new RegExp('\/'+reg,'gi'));
				if (match) {
					result.params[p] = match[0].replace(/^\//gi, '');
					_urlPiece=_urlPiece.replace(new RegExp('^\/'+reg,'gi'),'');
				}
			}

			// Making the translation:
			if(this.route.indexOf('<')!==-1 && this.route.match(/<(\w+):?(.*?)?>/gi))
			{
				var match = this.route.match(/<(\w+):?(\w+)?>/gi);
				for(m in match) {
					var _t=(match[m].replace(/[\<|\>]/gi,'')).replace(/^\//,'').replace(/\/$/,''),
						_param = _t.split(':')[0],
						_fromParam = this.translations[_param]=='';
					result.translation=result.translation.replace(new RegExp(match[m],'gi'),_fromParam?result.params[_param]:this.translations[_param]);
				}
			}


			// Replacing remaning not translated tags..
			result.translation='/'+result.translation.replace('<(\w+):?(\w+)?>','_');

			return result;

		} else
			return false;
	};

	/**
	 * @var string template used to construct a URL
	 */
	this.template = '';

	/**
	 * @var object the list of translations (param=>translation)
	 */
	this.translations = {};

	/**
	 * @var object whether the URL allows additional parameters at the end of the path info.
	 */
	this.params = {};

	/**
	 * @var string regular expression used to parse a URL
	 */
	this.pattern = '';

	/**
	 * @var array list of regular expressions of each param of the route
	 */
	this.patternList = [];

	/**
	 * @var string the controller/action pair
	 */
	this.route = '';

	// Construct function
	this.construct.apply(this,arguments);

}
/**
 * Source of the wnDustTemplate class.
 * 
 * @author: Pedro Nasser
 * @link: http://wns.yept.net/
 * @license: http://yept.net/projects/wns/#license
 * @copyright: Copyright &copy; 2012 WNS
 */

/**
 * Description coming soon.
 *
 * @author Pedro Nasser
 * @package package.template
 * @since 1.0.0
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnTemplate'],

	/**
	 * NPM dependencies
	 */
	dependencies: ["dustjs-linkedin","dustjs-helpers"],

	/**
	 * PRIVATE
	 *
	 * Only get and set by their respectives get and set private functions.
	 *
	 * Example:
	 * If has a property named $id.
	 * It's getter function will be `this.getId`, and it's setter `this.setId`.
	 * To define a PRIVILEGED function you put a underscore before the name.
	 */
	private: {},

	/**
	 * Public Variables
	 * Can be accessed and defined directly.
	 */
	public: {},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Render template.
		 */
		render: function (text,obj,cb)
		{
			// var compiled = dustjs_linkedin.compile(text, "tmp");
   			// dustjs_linkedin.loadSource(compiled);
			// dustjs_linkedin.render('tmp',obj,cb);

			if (obj)
			{
				for (o in obj)
				{
					if (typeof obj[o] == 'string' && obj[o].match(/\<\/?[a-z]{1,6}\>/ig))
					{
						obj[o] = function (chunk) {
								return chunk.write(this.html);
							}.bind({ html: obj[o]+'' });
					}
				}
				obj.html=function(chunk, context, bodies, params) {
					var options = null,
						args = [];
				    if (!params.t || !self.parent().request.html[params.t])
				       return chunk.write('');
				    if (params.opts && params.opts.substr(0,1)==='(')
				       options = JSON.parse(params.opts.replace(/\'/g,'"').replace(/\(/g,'{').replace(/\)/g,'}'));
				    if (params.args && params.args.substr(0,1)==='[')
				       args = JSON.parse(params.args.replace(/\'/g,'"'));
				    var type = params.t;
				    if ((type.indexOf('active')!==-1 || type == 'error') && context.stack.head.model!==undefined)
				    	args.unshift(context.stack.head.model);
				    args.push(options);
				    return chunk.write(self.parent().request.html[type].apply(self.parent().request.html,args));
				};
			}

			dustjs_linkedin.helpers=dustjs_helpers.helpers;
			dustjs_linkedin.renderSource(text,obj,cb);
		}

	}

};
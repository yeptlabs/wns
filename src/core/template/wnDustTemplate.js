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
	extend: ['wnComponent','wnTemplate'],

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
		render: function (template,obj,cb)
		{
			var template;
			var name;
			var compiled;

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

				obj.html=function(chunk, context, bodies, params)
				{
					var options = null,
						args = [];
				    if (!params.t || !self.parent().html[params.t])
				       return chunk.write('');
				    if (params.opts && params.opts.substr(0,1)==='(')
				       options = JSON.parse(params.opts.replace(/\'/g,'"').replace(/\(/g,'{').replace(/\)/g,'}'));
				    if (params.args && params.args.substr(0,1)==='[')
				       args = JSON.parse(params.args.replace(/\'/g,'"'));
				    var type = params.t;
				    if ((type.indexOf('active')!==-1 || type == 'error') && context.stack.head.model!==undefined)
				    	args.unshift(context.stack.head.model);
				    args.push(options);

				    var resultHTML = self.parent().html[type].apply(self.parent().html,args);

				    var c=chunk.write(resultHTML);
				    return c;
				};

				obj.m=function(chunk, context, bodies, params)
				{
					if (!context.stack.head.model || !params.attr)
						return chunk;
					var model = context.stack.head.model;
				    return chunk.write(model.getAttribute(params.attr));
				};
			}

			if (typeof template == 'object' && typeof template.name == 'string' && (typeof template.source == 'string' || typeof template.file == 'string'))
			{
				var _stream = function () {
					var stream=dustjs_linkedin.stream(template.name,obj);
					stream.data = new Buffer(0);
					stream.on("data", function(chunk) {
						stream.data = Buffer.concat([stream.data,new Buffer(chunk)]);
	    			});
	    			stream.on("end", function() {
						cb&&cb(null,stream.data.toString('utf8'));
	    			});
	    			return stream;
				};

				if (!self.parent().cache.get('template-'+template.name))
				{
					var _compile = function () {
						//console.log('building template')
						compiled = dustjs_linkedin.compile(template.source, template.name);
						self.parent().cache.set('template-'+template.name,+new Date)
		   				dustjs_linkedin.loadSource(compiled);
		   				return _stream();			
					};

					if (template.file)
					{
						//console.log('getting from file.')
						fs.readFile(template.file,function (err,f) {
							//console.log("read file")
							template.source=f+'';
							return _compile();
						});
					}
					else
					{
						//console.log('getting from source.')
						return _compile();
					}
				}
				else 
					return _stream();
				
			} else
			{
				if (typeof template == 'string')
					source = template;
				else 
					source = template.source;
				
				//console.log('runtime rendering')
				dustjs_linkedin.helpers=dustjs_helpers.helpers;
				dustjs_linkedin.renderSource(source,obj,cb);
			}

			return self;

		},

		/**
		 * Has the template cached?
		 */
		has: function (templateName)
		{	
			return self.parent().app.cache.get('template-'+templateName) !== undefined;
		}


	}

};
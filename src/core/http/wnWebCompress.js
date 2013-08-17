/**
 * @WNS - The NodeJS Middleware and Framework
 * 
 * @copyright: Copyright &copy; 2012- YEPT &reg;
 * @page: http://wns.yept.net/
 * @docs: http://wns.yept.net/docs/
 * @license: http://wns.yept.net/license/
 */

/**
 * No description yet.
 *
 * @author Pedro Nasser
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['wnComponent'],

	/**
	 * PRIVATE
	 */
	private: {},

	/**
	 * Public Variables
	 */
	public: {

		/**
		 * @var object all compress object constructors
		 */
		compressMode: {},

		/**
		 * @var object 
		 */
		defaultEvents: {
		}

	},

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Initializer
		 */	
		init: function ()
		{
			this.compressMode = { 
				gzip: zlib.createGzip,
				deflate: zlib.createDeflate
			};
		},

		/**
		 * Compress the instance of wnHttpRequest,
		 * @param wnHttpRequest instance to be compressed
		 */
		compressRequest: function (req)
		{
			if (typeof req == 'object' && req.getClassName() == 'wnHttpRequest')
			{
				var methods = this.compressMode,
					accept = req.info.headers['accept-encoding'];
				for (m in this.compressMode)
					if (this.checkEncoding(accept,m))
					{
						this.compress(req,m);
						break;
					}
			}
		},

		/**
		 * Executes the compression.
		 */
		compress: function (req,mode) {
			if (!this.checkEncoding(req.info.headers['accept-encoding'],mode))
				return false;

			var res = req.response,
				stream;
				res.directWrite = res.write;
				res.directEnd = res.end;

			req.header['Vary'] = 'Accept-Encoding';

			res.write = function (chunk, encoding)
			{
				//if (!this.headerSent) this._implicitHeader();
				return stream ? 
					stream.write(new Buffer(chunk,encoding)) : res.directWrite.call(res,chunk,encoding);
			};

			res.end = function(chunk, encoding) {
				if (chunk) this.write(chunk, encoding);
				return stream ?
					stream.end() : res.directEnd.call(res);
		    };

			stream = this.createCompression(mode);

			req.header['Content-Encoding'] = mode;
			delete req.header['Content-Length'];

			stream.on('data',function (chunk) {
				res.directWrite.call(res, chunk);
			});
			stream.on('end',function () {
				res.directEnd.call(res);
			});
			stream.on('drain', function() {
    			res.emit('drain');
  			});

		},

		/**
		 * Create a new compression.
		 * @param string mode {gzip/deflate}
		 */
		createCompression: function (mode) {
			var compression = this.compressMode[mode];
			if (compression!=undefined)
				return compression(this.getConfig());
			return false;
		},

		/**
		 * Check the accept-encoding
		 * @param string $accept request accept-encoding
		 * @param string $model compressing mode
		 */
		checkEncoding: function (accept,mode)
		{
			return (accept||'').match(new RegExp(mode));
		}

	}

};
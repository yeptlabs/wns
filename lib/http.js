/* HTTP Handler */
module.exports = {

	// Variáveis do HTTP Handler
	data: '', // Resposta
	code: 200, // Código da resposta.
	header: {}, // Header da resposta.

	// Função responsável pelo tratamento final da resposta e envio.
	send: function () {

		// Objeto http
		var self=this,
			http=self.http;

		// Import data.
		http.data = self.response || '';

		// Busca saber se é possivel encodar o conteúdo
		var acceptEncoding = http.request.headers['accept-encoding'];
		if (!acceptEncoding) { acceptEncoding = ''; }

		// Verifica se é possivel utilizar gzip e se possui mais de 150bytes.
		if (acceptEncoding.match(/\bgzip\b/) || (typeof http.data == 'string' && Buffer.byteLength(http.data, 'utf8')>150)) {
			// gzipa.
			http.header['Content-Encoding']='gzip';
			zlib.gzip(new Buffer(http.data), function (e,buf) {
				// Envia a resposta..
				http.header['Content-Length']=buf.length;
				http.response.writeHead(http.code,http.header);
				http.response.end(buf);
			});
		} else {
			// Envia a resposta..
			http.header['Content-Length']=http.data.length;
			http.response.writeHead(http.code,http.header);
			http.response.end(http.data);		
		}

	},

	// Handler HTTP 
	handler: function () {

		/* HTTP Gateway */

		// Descobrir qual arquivo a requisição deseja acessar... 
		this.parsedUrl=url.parse(this.request.url);
		this.header=this.app.extend(true,{},this.app.config.http.header);

		// Verifica se é um caminho controller/action ou apenas um arquivo.
		if (this.parsedUrl.pathname.match(/[\w|\/]+/gim).length == 1)
		{
			this.controllerHandler();
		} else {
			this.publicHandler();
		}

	},

	// Handler de acesso ao Controller.
	controllerHandler: function () {

		var _p=this.parsedUrl.pathname.split('/'),
			_plen = _p.length,
			_controller=_plen>0&&_p[1]!=''?_p[1]:this.app.config.http.defaultController,
			_action=_plen>1&&_p[2]!=''?_p[2]:undefined;
	
		// Verifica se já foi carregado o controller
		// TODO: Sistema de Cache Inteligente (cache.js)
		if (!this.app.controllers[_controller] || 1==1) {

			// Verifica a existencia do controller requisitado.
			var self = this;
			fs.exists('./'+this.app.appPath+this.app.config.path.controllers+_controller+'.js', function (e) {
				if (!e) {
					if (self.app.config.errorPage==undefined) {
						// Se não existir este controller...
						self.code = 404;
						self.header['Status']='404 Not Found';
						self.app.log('Controller not found: '+_controller,'access');
						return false;
					} else {
						_controller=self.app.config.errorPage.split('/')[0];
						_action=self.app.config.errorPage.split('/')[1];
						self.parsedUrl.pathname=self.app.config.errorPage;
					}
				}
					
				// Cria um novo controller baseado no default
				self.app.controllers[_controller]=self.app.extend(true,{},self.app.defaults.controller);
				// Extende ele com o controller carregado..
				self.app.extend(true,self.app.controllers[_controller],_r('./'+self.app.appPath+self.app.config.path.controllers+_controller+'.js'));
				self.controller=_controller;

				// Executa a ação requisitada e depois envia a resposta.
				_action=self.action=(!_action?self.app.controllers[_controller].defaultAction:_action);


				// Cria uma nova instância para execução..
				var _instance=self.app.extend(true,{},self.app.controllers[_controller]);
					_instance.http=self.app.extend(true,{},self);
					_instance.app=self.app.extend(true,{},self.app);
					_instance.http.app=undefined;
					_instance.send=_instance.http.send;
					_instance._construct();

				for (a in self.app.controllers[_controller]) {
					if (a.toLowerCase() == 'action'+_action.toLowerCase()) _action=a;
				}

				_instance[_action]&&_instance[_action]();
	
			});

		} else {

			this.controller=_controller;

			// Executa a ação requisitada e depois envia a resposta.
			_action=this.action=(!_action?this.app.controllers[_controller].defaultAction:_action);

			// Cria uma nova instância para execução..
			var _instance=this.app.extend(true,{},this.app.controllers[_controller]);
				_instance.http=this.app.extend(true,{},this);
				_instance.app=this.app.extend(true,{},this.app);
				_instance.http.app=undefined;
				_instance.send=_instance.http.send;
				_instance._construct();

			for (a in this.app.controllers[_controller]) {
				if (a.toLowerCase() == 'action'+_action.toLowerCase()) _action=a;
			}

			_instance[_action]&&_instance[_action]();
				
		}
		
	},

	// Controle de envio de arquivo público.
	publicHandler: function () {

			// Pega a extenção do arquivo...
			var ext=this.parsedUrl.pathname.split('.').slice(-1)[0];

			// Busca e envia o arquivo que deve existir na pasta 'public'.
			// Tenta ler o arquivo requisitado...
			var self = this;
			fs.readFile('./'+this.app.appPath+this.app.config.path.public+this.parsedUrl.pathname.substr(1), function (err, data) {

				var _instance = {};

				// Se não for encontrado...
				if (err) { self.code = 404; self.header['Status']='404 Not Found'; self.app.log('File not found: '+self.parsedUrl.pathname,'access'); }
				// Se for encontrado pega o arquivo e envia como resposta...
				else { _instance.response = data; }

				// Define que qualquer arquivo será baixado caso não haja outro header..
				self.header['Content-Length']=self.data.length;
				self.header['Content-Type']=self.app.config.http.contentType[ext]?self.app.config.http.contentType[ext]:'application/octet-stream';

				_instance.http=self.app.extend(true,{},self);
				_instance.send=_instance.http.send;
				_instance.send();

			});
	
	}

}
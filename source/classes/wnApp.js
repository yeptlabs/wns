/*@
 * Classe: wnApp
 * Desc: Estrutura padrão de uma aplicação
 */

// Exportar:
module.exports = wnApp;

// Construtor:
function wnApp(appName) {

	// Herança:
	util.inherits(this, wnObject);

	// Carrega as configurações desta aplicação.
	this.config = new wnConfig;

}
/*
		web.log('Loading Application: `'+app+'`');

		// Criar um novo objeto para aplicação.
		var _app = {
				defaults: {},
				zone: app
			},
			appPath=web.config.app[app];

		// Carregando configurações padrões
		var defaultConfig = './'+sourcePath+'appConfig.json';
		web.log('['+app+'] Loading default application config ['+defaultConfig+']');
		var data = fs.readFileSync(defaultConfig);
			_app.config=JSON.parse(data);

		// Carregando configurações customizadas
		var customConfig='./'+appPath+'config.json';
		if (fs.existsSync(customConfig)) {	
			web.log('['+app+'] Loading custom application config ['+customConfig+']');
			var data = fs.readFileSync(customConfig);
				web.extend(true,_app.config,JSON.parse(data));
		}
		
		// Carrega libs da aplicação
		web.log('['+app+'] Loading application libraries...');
		for (e in web.config.lib) {
			console.log('['+app+'] - Loaded base lib: /lib/'+web.config.lib[e]+'.js');
			_app.config[web.config.lib[e]] = _app.config[web.config.lib[e]] || {};
			_app[web.config.lib[e]] = web[web.config.lib[e]];
			_app[web.config.lib[e]].app;
		}
		_templib = {};
		for (e in _app.config.lib) {
			console.log('['+app+'] - Loaded app lib: /'+appPath+_app.config.path.lib+_app.config.lib[e]+'.js');
			_app.config[_app.config.lib[e]] = _app.config[_app.config.lib[e]] || {};
			_templib[_app.config.lib[e]] = _r('./'+appPath+_app.config.path.lib+_app.config.lib[e]+'.js');
			_templib[_app.config.lib[e]].app = _app;
		}
		_app.extend(true,_app,_templib);

		// Importando classes, libs.
		web.log('['+app+'] Importing default classes to the application...');
		_app.defaults=web.defaults || {};

		// Carrega as classes padrões...
		if (_app.config.classes != undefined && _app.config.path.classes != undefined) {
			web.log('['+app+'] Loading custom classes...');
			var classes=_app.config.classes;
			for (c in classes) {
				console.log('['+app+'] - Loaded class: /'+appPath+_app.config.path.classes+classes[c]+'.js');
				_app.defaults[classes[c]] = _r('./'+appPath+_app.config.path.classes+classes[c]+'.js');
			}
		}

		_app.controllers={};
		_app.appPath = appPath;

		// Puxa o objeto da aplicação para o objeto principal.
		web.app[app]=_app;*/
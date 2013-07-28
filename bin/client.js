global.WNS_SHOW_LOAD = false,
global.WNS_QUIET_MODE = true;

var sourcePath = '../src/',
	cmdr = require('commander')
	pkg = require('../package.json'),
	fs = require('fs'),
	path = require('path'),
	version = pkg.version;

cmdr.Command.prototype.parseArgs = function(args, unknown){
  var cmds = this.commands
    , len = cmds.length
    , name;

  if (args.length) {
    name = args[0];
    if (this.listeners(name).length) {
      this.emit(args.shift(), args, unknown);
    } else {
      this.emit('*', args);
    }
  }

  return this;
};

var prog = new cmdr.Command;

prog.modulePath = '.';
prog._modulePath = path.resolve((process.cwd()+'/'+prog.modulePath).replace(/\\/g,'/'))+'/';
prog.wnsPath = path.resolve(__dirname+'/..');
prog.isValidModule = fs.existsSync(prog._modulePath+'/config.json');
prog.isServer = prog.isValidModule&&require(prog._modulePath+'/package.json').moduleClass=='wnServer'?true:false;
prog.isApp = prog.isValidModule&&require(prog._modulePath+'/package.json').moduleClass=='wnApp'?true:false;
prog.version(version)
prog.keepAlive = false;

require(sourcePath+'wnInit.js');
module.exports = prog;
module.exports = function (text,clean) { 
	this.text = text;
	this.clean = clean==false?false:true;
	this.match = function (o,path) {
		if (!path) {
			var path='';
			this._text=this.text;
		}
		if (typeof o == 'object' && path.split('.').length < 5) {
			for(n in o) this.match(o[n],path+n+'.');
		} else {
			this._text=new String(this._text).replace(new RegExp('[{\/\!]'+path.substr(0,path.length-1)+'}','gim'), (new String(o)).replace(/\{/gi,'&abrechave;').replace(/\}/gi,'&fechachave;'));
		}
		if (path=='') return (this.clean ? new String(this._text).replace(new RegExp('[{\/\!].*}','gim'),'') : this._text).replace(/\&abrechave\;/gi,'{').replace(/\&fechachave\;/gi,'}');
	}
};
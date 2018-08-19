// index.js

var http = require('http');
var fs = require('fs');
var path = require('path');
var opn = require('opn');
var server;
var serverfn = function(option) {
	console.log(option.port)
	this.port = option.port;
	this.dirname = option.dirname;
	this.index = option.index || 'index.html';
	this.open = option.open;
	
	
}

serverfn.prototype.start = function start(callback) {
  this._socket = http.createServer(response_callback(this)).listen(this.port, callback);
  console.log(this.open)
  if(this.open && this.port){
    opn('http://localhost:' + this.port);
  }
}

function response_callback(option){
	return function(req, res){
		var url = req.url;
		var pathname;

		//var static = 'F:/nodejs/caipiao/public/static'; //'/static/'
		var static = option.dirname;//'static/'
		if (/\.ico$/.test(url)) {
			res.end('');
			return;
		}
		console.log('url: ' + url)
		if (/\/$/.test(url)) {
			url += option.index || 'index.html'
		}

		if (path.isAbsolute(static)) {
			pathname = path.join(static, url)
		} else {
			pathname = path.join(process.cwd(), static, url)
		}

		console.log(pathname)
		fs.createReadStream(pathname)
			.on('error', (err) => {
				console.error('发生异常:', err.path);
				res.writeHeader(200, {
					'Content-Type': 'text/plain;charset=utf-8' // 添加charset=utf-8
				});
				res.end('文件不存在：' + url);
			})
			.pipe(res);
	}
}
serverfn.prototype.stop = function stop() {
  if (this._socket) {
    this._socket.close();
    this._socket = null;
  }
}
module.exports = serverfn;

var fs = require('fs');
var path = require('path');
var co = require('co');

module.exports.readdir = function readdir(filePath) {
	return new Promise((resolve, reject) => {
		fs.readdir(filePath, function(err, files) {
			pathList(files, filePath)
			.then((res)=>{
				resolve(res);
			})
		});
	})
};


function pathList(files, pathBase) {
	pathBase = pathBase || ''
	var list = [];
	var file;
	var type;
	return co(function*() {
		for (var i = 0; i < files.length; i++) {
			file = path.join(pathBase, files[i]);
			type = yield pathType(file);
			list.push({
				path: files[i],
				type: type
			})
		}
		return list.sort(function(one, two){return one.type - two.type});
	})
}
/*
	return 0 err 不存在
	1 dir 文件夹
	2 file 文件
*/
module.exports.pathType = pathType;

function pathType(filePath) {
	return new Promise((resolve, reject) => {
		fs.stat(filePath, function(err, stat) {
			var type = 0;
			if (err) {
				type = 0
			}else if (stat.isDirectory()) {
				type = 1
			}else if (stat.isFile()) {
				type = 2
			}
			return resolve(type);
		});
	})
};

var css = `
<style>
body{padding: 20px 40px;    background: #e2e1e1;}
div{border:1px solid #333;padding: 20px 40px;    border-radius: 20px;}
a{    text-decoration: none;    color:#19154a;}
a:hover{     text-decoration: underline; }
</style>
`;
module.exports.listHtml = function(list, title){
	var str = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>${title || 'title'}</title>
  </head>
  <body><div>`;
	list.forEach(function(item){
		str += `<p><a href="${item.path}${item.type==1?'/':''}">${item.path}${item.type==1?'/':''}</a></p>`;
	});
	if(list.length <= 0){
		str += `<p>暂无 文件或内容</p>`;
	}
	str += '</div></body><html>';
	str += css;
	return str;
}
// fs.readdir(__dirname + '/fsDir/', function(err, files) {
// 	if (err) {
// 		console.error(err);
// 		return;
// 	} else {
// 		files.forEach(function(file) {
// 			var filePath = path.normalize(__dirname + '/fsDir/' + file);
// 			fs.stat(filePath, function(err, stat) {
// 				if (stat.isFile()) {
// 					console.log(filePath + ' is: ' + 'file');
// 				}
// 				if (stat.isDirectory()) {
// 					console.log(filePath + ' is: ' + 'dir');
// 				}
// 			});
// 		});
// 		for (var i = 0; i < files.length; i++) {
// 			//使用闭包无法保证读取文件的顺序与数组中保存的致 
// 			(function() {
// 				var filePath = path.normalize(__dirname + '/fsDir/' + files[i]);
// 				fs.stat(filePath, function(err, stat) {
// 					if (stat.isFile()) {
// 						console.log(filePath + ' is: ' + 'file');
// 					}
// 					if (stat.isDirectory()) {
// 						console.log(filePath + ' is: ' + 'dir');
// 					}
// 				});
// 			})();
// 		}
// 	}
// });
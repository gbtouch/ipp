var http = require('http');
var qs = require('querystring');
var bufferHelper = require('bufferhelper');

var client = {
  get: function (options, callback) {
    var data = "";
    var httpRequest = http.get(options, function (res) {
      var buffer = new bufferHelper();
      res.setEncoding('utf8');
      global.logger.info(util.format("http notify to %s:%d %s statusCode: %d", options.hostname, options.port, options.path, res.statusCode));
      res.on('data', function (chunk) {
        //buffer.concat(chunk);
        data += chunk;
      });
      res.on('end', function () {
        //data = buffer.toBuffer().toString();
        //res.writeHead(200);
        //res.end(data);
        if (callback) callback(null, data);
      });
    });

    httpRequest.on('error', function (err) {
      global.logger.error(util.format("http notify to %s:%d %s error: %s",options.hostname,options.port,options.path,err));
      callback(err);
    });
  },

  post: function (options, data, callback) {
    if (!data) {data = {};}
    var len = JSON.stringify(data).replace(/[\u4e00-\u9fa5]/g, "aaa").length;  //中文长度为3个字符长度
    options.headers = {
      'Content-Type': 'application/json',
      'Accept-Contect': 'application/json',
      "Content-Length": len
    };
    var clientReq = http.request(options, function (res) {
      var buffer = new bufferHelper();
      res.setEncoding('utf8');
      global.logger.info(util.format("http notify to %s:%d path:'%s' statusCode: %d",options.hostname,options.port,options.path,res.statusCode));
      res.on('data', function (chunk) {
        buffer.concat(chunk);
      });
      res.on('end', function () {
        global.logger.info(util.format("http notify to %s:%d path:'%s' post end",options.hostname, options.port, options.path));
        var data = parseInt(buffer.toBuffer().toString());

        if (callback) {callback(null,data);}
      });
    });
    //clientReq.setHeader('Connection', 'close');
    clientReq.on('error', function (err) {
      global.logger.error(util.format("http notify to %s:%d path:'%s' error: %s",options.hostname,options.port,options.path,err));
      if (callback) {callback(err);}
    });
    if(data) {
      clientReq.write(JSON.stringify(data));
    }
    clientReq.end();
  }

//  postChinese: function (options, data, callback) {
//    var len = JSON.stringify(data).replace(/[\u4e00-\u9fa5]/g, "aaa").length;  //中文长度为3个字符长度
//    options.headers = {
//      'Content-Type': 'application/json',
//      'Accept-Contect': 'application/json',
//      "Content-Length": len
//    };
//    var clientReq = http.request(options, function (res) {
//      var buffer = new bufferHelper();
//      res.setEncoding('utf8');
//      global.logger.info(util.format("http notify to %s:%d path:'%s' statusCode: %d",options.hostname,options.port,options.path,res.statusCode));
//      res.on('data', function (chunk) {
//        buffer.concat(chunk);
//      });
//      res.on('end', function () {
//        console.log(util.format("http notify to %s:%d path:'%s' post end",options.hostname, options.port, options.path));
//        var val = parseInt(buffer.toBuffer().toString());
//        if (val && val != NaN && typeof(val) === "number") {
//          if (callback) {
//            setTimeout(function(){callback(val);}, 10000);
//          }
//        }else {
//          if (callback) {callback();}
//        }
//      });
//    });
//    clientReq.on('error', function (err) {
//      global.logger.error(util.format("http notify to %s:%d path:'%s' error: %s",options.hostname,options.port,options.path,err));
//    });
//    clientReq.write(JSON.stringify(data));
//    clientReq.end();
//  }
};
exports = module.exports = client;
/**
 * Created by Joan on 2015/7/3.
 */
var request = require('request-json');

var attendees = {
  client:function(){
    return request.createClient('http://'+config.goServer+':'+config.attendeesPort);
  },
  get:function(url,callback){
    this.client().get(url,function(err,res,result){
      callback(err,res,result);
    });
  },
  post:function(url,data,callback){
    this.client().post(url,data,function(err,res,result){
      callback(err,res,result);
    });
  },
  delete:function(url,callback){
    this.client().del(url, function(err, res, result) {
      return callback(err,res,result);
    });
  },
  patch:function(url,data,callback){
    this.client().patch(url,data, function(err, res, result) {
      return callback(err,res,result);
    });
  }

};

exports = module.exports = attendees;
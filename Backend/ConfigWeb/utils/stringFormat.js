/**
 *
 * Created by Joan on 2015/5/13.
 */

//String.format = function() {
//  if( arguments.length == 0 )
//    return null;
//
//  var str = arguments[0];
//  for(var i=1;i<arguments.length;i++) {
//    var re = new RegExp('\\{' + (i-1) + '\\}','gm');
//    console.log('format: ' + str);
//    str = str.replace(re, arguments[i]);
//  }
//  return str;
//};


sm.Overload("format",String.prototype,{
  "array" : function(params){
    var reg = /{(\d+)}/gm;
    return this.replace(reg,function(match,name){
      return params[~~name];
    });
  },
  "object" : function(param){
    var reg = /{([^{}]+)}/gm;
    return this.replace(reg,function(match,name){
      return param[name];
    });
  }
});

console.log("aaaa:{0},bbb:{1}".format('2','4'));
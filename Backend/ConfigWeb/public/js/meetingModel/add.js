/**
 * Created by tommy_2 on 2015/11/12.
 */
function create(obj){
}
var court = [];
function save(){
  court = [];
  var mm = [];
  $("#tree").children(".Node").each(function(index,item){
    var name = $(item).children("span").attr("title");
    $.get("/meeting/id",function(data) {
      var datas = {
        id: data,
        name: name,
        cord: "",
        sub: []
      };
      court.push(datas);
      mm = saveChild(item,index,court);
      console.log(mm);
    });
  });
}
function saveChild(obj,i,court){
  $(obj).children().children(".Node").each(function(index,item){
    var name = $(item).children("span").attr("title");
    $.get("/meeting/id",function(data) {
      var datas = {
        id: data,
        name: name,
        cord: "",
        sub: []
      };
      court[i].sub.push(datas);
      saveChild(item,index,court[i].sub);
    });
  });
  return court;
}

/**
 * Created by kpin on 2015/6/19.
 */

$(function() {
  //var i, id;
  //var len = $("#devicesLen").text();
  //for(i = 0;i<len;i++) {
  //  id = $('#device' + i).find("td[style='display:none']").text();
  //  isOnline(id);
  //}
  //setInterval(function(){
  //  for(i = 0;i<len;i++){
  //    id = $('#device'+i).find("td[style='display:none']").text();
  //    isOnline(id);
  //  }
  //},60000);
  setMenu('device');
});

//function isOnline(id){
//  $.ajax({
//    url: '/device/isOnline?id='+id,
//    type: 'get',
//    dataType: 'json',
//    async: false,
//    success: function (data) {
//      if (data.code == 200) {
//        if (data.device){
//          $('#status'+id).find('img').attr('src','/img/online.png');
//          $('#lasttime'+id).text('');
//        }
//      }
//    }
//  });
//}

function deviceDelete(id){
  if (confirm("是否确定删除选中项？") == true) {
    $.ajax({
      url: '/device/' + id,
      type: 'delete',
      dataType: 'json',
      async: false,
      success: function (data) {
        if (data == 200) {
          $('#device' + id).remove();
        } else {
          alert("未知错误！")
        }
      }
    });

  }
  setMenu('device');
}
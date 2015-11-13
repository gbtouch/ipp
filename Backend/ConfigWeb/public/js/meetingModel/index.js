/**
function edit(mid){
  forward('/meeting/edit?meetingid='+mid);
 *
 * Created by Joan on 2015/5/19.
 */
$(function(){
  //CheckBoxInitial('chkAll','meeting');
  CheckBoxInitial('chkAgendaAll','agenda');
  //$("#status").html("").css('display','none');
  var tab = $("#tabShow").text();
  if(tab=="") {
    $('#tabMeeting a:first').tab('show');
  }else if(tab =="1"){
    $('#tabMeeting a:eq(1)').tab('show');
  }else{
    $('#tabMeeting a:last').tab('show');
  }
  $('#tabMeeting a:first').on('click',function(e){
    window.location.href="/meeting";
  });
  $('#tabMeeting a:eq(1)').on('click',function(e){
    window.location.href="/meeting?tab=1";
  });
  $('#tabMeeting a:last').on('click',function(e){
    window.location.href="/meeting?tab=2";
  });
  var m = $("#meetingC").text();
  $("#agendaTimeModal").on('show.bs.modal',function(e){
    var index = $(e.relatedTarget).data('index');
    var starttime = $(e.relatedTarget).data('starttime');
    var endtime = $(e.relatedTarget).data('endtime');
    $(this).find("#agendastarttime").val(starttime);
    $(this).find("#agendafinishtime").val(endtime);
    $(this).find("#status").html("").css('display', 'none');
    $("#saveDelay").unbind('click').bind('click', function () {
        var delay = $('#agendadelaytime').val();
        if (delay === "") {
            return $('#agendaTimeModal').find("#status").html("顺延时间不能为空").css('display', 'block');
        }
        if (!(/^[0-9]+(.[0-9]{1,3})?$/).test(delay)||parseInt(delay)>300||parseInt(delay)<0){
            return $('#agendaTimeModal').find("#status").html("请确认输入0-300间的整数").css('display', 'block');
        }
        $.ajax({
            data: {model: m, delay: delay},
            url: '/meeting/agendaTime/'+index,
            type: 'post',
            dataType: 'json',
            success: function (data) {
                if (data == 500) {
                    $("#status").html("未知错误").css('display', 'block');
                } else if (data == 200) {
                    window.location.href = "/meeting?tab=1";
                }
            }
        });
    });
  });
  setMenu('meeting');
  $("#meetingModal").on('show.bs.modal',function(e) {
    var id = $(e.relatedTarget).data('id');
    var name = $(e.relatedTarget).data('name');
    var starttime = $(e.relatedTarget).data('starttime');
    var endtime = $(e.relatedTarget).data('endtime').substring(11, 16);
    $(this).find('#name1').text(name);
    $(this).find('#time1').text(starttime+ " - " +endtime);
    $("#toEdit").unbind('click').bind('click', function () {
      edit(id);
    });
    $("#toDetail").unbind('click').bind('click', function () {
      forward('/meeting/detail?mid='+id);
    });
  });
});

function del(id, tab){
  if (confirm("是否确定删除该项？") == true) {
    $.ajax({
      url: '/meeting/' + id,
      type: 'delete',
      dataType: 'json',
      success: function (data) {
        //if (data.code == 200) {
        //  window.location.reload();
        //} else{
        //  alert(data.error);
        //  window.location.reload();
        //}
        if (tab){
          window.location.href = "/meeting?tab=2";
        } else{
          window.location.href = "/meeting";
        }
      }
    });
  }
}

//function deletes() {
//  var chk = $("input[id^='meeting']:checked").not("#chkAll");
//  if (chk.length == 0) {
//    alert("请选中要删除的项");
//    return void(0);
//  }
//  else if (confirm("是否确定删除选中项？") == true) {
//    $(chk).each(function (each) {
//      var id = $(this).val();
//      $.ajax({
//        url: '/meeting/' + id,
//        type: 'delete',
//        dataType: 'json',
//        success: function (stateCode) {
//          if (stateCode == 200) {
//            window.location.reload();
//          }
//          else if (stateCode == 202) {
//            alert("会议正在进行中，不能删除");
//          }else if(stateCode ==404){
//            alert("会议不存在");
//          }else {
//            alert("未知错误");
//          }
//        }
//      });
//    });
//  }
//}

function meeting(mid,status) {
  var str = '';
  var url = '';
  switch (status) {
    case 'inprogress':
      str = '是否确认开始会议';
      break;
    case 'finish':
      str = '是否确认结束会议';
      break;
    default :
      break;
  }
  if (confirm(str)) {
    $.ajax({
      url: '/meeting/' + mid,
      type: 'patch',
      data: {status: status},
      dataType: 'json',
      async: false,
      success: function (data) {
        if (data.code == 500) {
          alert("未知错误");
        } else if (data.code == 400) {
          alert("数据错误,请刷新页面重试");
        } else if (data.code == 309) {
            if(confirm("是否结束正在进行的会议？")){
                $.ajax({
                    url: '/meeting/' + data.id,
                    type: 'patch',
                    data: {status: 'finish'},
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        if (data == 500) {
                            alert("未知错误");
                        } else if (data == 400) {
                            alert("数据错误,请刷新页面重试");
                        }
                        $.ajax({
                            url: '/meeting/' + mid,
                            type: 'patch',
                            data: {status: 'inprogress'},
                            dataType: 'json',
                            async: false,
                            success: function (data) {
                                if (data == 500) {
                                    alert("未知错误");
                                } else if (data == 400) {
                                    alert("数据错误,请刷新页面重试");
                                }
                            }
                        })
                    }
                })
            }
        }
        if(status == 'inprogress'){
          window.location.href='/meeting?tab=1'
        } else {
          window.location.href='/meeting?tab=2'
        }
      }
    });
  }
}

function resetMeeting(mid){
  if(confirm("是否重置该会议到未开始状态？")){
    $.ajax({
      url: '/meeting/reset',
      type: 'post',
      data:{mid:mid},
      dataType: 'json',
      success: function (data) {
        if (data == 200) {
          window.location.reload();
        }else if(data == 500){
          alert("未知错误");
        }else{
          alert("数据读取有误，请刷新页面重试");
        }
      }
    });
  }
}

function copyMeeting(mid){
  if(confirm("是否复制一条会议记录？")){
    $.ajax({
      url: '/meeting/copy',
      type: 'post',
      data:{mid:mid},
      dataType: 'json',
      success: function (data) {
        if (data.code == 200) {
          window.location.href='/meeting'
        }else{
          alert(data.error);
          window.location.reload();
        }
      }
    });
  }
}

//function endShare(mid){
//  if(confirm("是否结束当前共享？")){
//    $.ajax({
//      url: '/meeting/share/end',
//      type: 'post',
//      data:{mid:mid},
//      dataType: 'json',
//      success: function (data) {
//        if (data == 200) {
//          window.location.reload();
//        }else if(data == 500){
//          alert("未知错误");
//        }else{
//          alert("数据读取有误，请刷新页面重试");
//        }
//      }
//    });
//  }
//}

//设置主持位
function setChair(id, index, l){
  var i, a, b;
  if(confirm("是否更新主持位设置？")) {
    $.ajax({
      url: '/device/' + id + '/setChair',
      type: 'post',
      dataType: 'json',
      success: function (data) {
        if (data == 500) {
          alert("未知错误");
        } else if (data == 404) {
          alert("数据异常，请刷新页面重试");
        } else if (data == 200) {
          for (i=0;i<l;i++) {
            a = document.getElementById("icon"+i);
            a.setAttribute('style','display:none');
          }
          b = document.getElementById("icon"+index);
          b.setAttribute('style','');
        }
      }
    });
  }
}

function edit(mid){
  $.ajax({
    url: '/meeting/load',
    data:{mid: mid},
    type: 'post',
    dataType: 'json',
    success: function (data) {
      if (data == 200) {
        forward('/meeting/edit?meetingid=' + mid);
      } else {
        alert("未知错误！")
      }
    }
  });
}

function download(id){
  if (confirm("是否确定打包下载会议记录？") == true) {
    var ip = getCurrIp();
    $.get('/meeting/download/'+id,function(data) {
      if (data.statusCode == 200) {
        window.location.href = "http://" + ip + ":" + data.port + data.nginxDownload + "/" + id + ".zip";
      } else if (data.statusCode == 500) {
        alert(data.error);
      } else {
        alert("zip包正在生成中，请稍后")
      }
    });
  }
}

function selectDelayTime(t){
    $('#agendadelaytime').val(t);
}



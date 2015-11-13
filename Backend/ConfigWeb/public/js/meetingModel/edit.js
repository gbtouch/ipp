
/**
 * Created by Joan on 2015/5/28.
 */
$(function(){
  var mid = $("#meetingid").text();
  var tabIndex = $(".tabIndex").text();
  uploadFiles(mid);
  //uploadOthers(mid);
  if(tabIndex){
    $('#tabMeeting a:eq(1)').tab('show');
  }else{
    $('#tabMeeting a:first').tab('show');
  }
  $('#tabMeeting a:first').on('click',function(e){
    window.location.href="/meeting/edit?meetingid="+mid;
  });
  $('#DTChk').datetimepicker({
    language:  'zh-CN',
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startDate:new Date(),
    endDate:null,
    initialDate:new Date(),
    startView: 2,
    minView:0,
    maxView:2,
    forceParse: 0
    //showMeridian: 1
  });
  setMenu('meeting');
  $("ul li button").click(function(event){
    event.stopPropagation();
    var ids = $(this).data();
    if($(this).hasClass('up')){
      moveAgenda(ids.mid, ids.aid, -1);
    }else if($(this).hasClass('down')){
      moveAgenda(ids.mid, ids.aid, 1);
    }else{
      deleteAgenda(ids.mid,ids.aid);
    }
  });

  //媒体库初始化
  $("#mediaHouseModal").on('show.bs.modal',function(e) {
    var id = $(e.relatedTarget).data('id');
    $.ajax({
      url:'/meeting/association?id='+ id,
      type:'get',
      dataType:'json',
      async:false,
      success:function(data){
        if(data.code !== 200){
          alert("未知错误");
        }else{
          $('#mediaTable').find('tbody').html("");
          if (data.files.length > 0) {
            data.files.forEach(function (item) {
              var tmpl = _.template($('#mediaTemp').html());
              $('#mediaTable').append(tmpl(item));
            });
            CheckBoxInitial('chkMediaAll', 'media_');
          }
        }
      }
    });
  });

  //新建议程框初始化
  $("#createAgenda").on('show.bs.modal',function(e){
    $(this).find("#status").html("").css('display', 'none');
    $("#saveAgenda").unbind('click').bind('click', function () {
      var index = $('#agendaindex').val().trim();
      var name = $('#agendaname').val().trim();
      var reporter = $('#agendareporter').val().trim();
      var starttime = $('#agendastarttime').val();
      var finishtime = $('#agendafinishtime').val();
      var pattern = /^[1-9][0-9]?$/;
      if(pattern.test(index)==false){
        return $("#status").html("议题序号必须为数字").css('display','block');
      }
      if(name=== ""||reporter===""||starttime===""||finishtime===""){
        return $("#status").html("每项内容均不能为空").css('display','block');
      }
      if(starttime>finishtime){
        alert("结束时间不能早于开始时间");
        return;
      }
      $.ajax({
        data:{index:index,name: name,reporter:reporter,starttime:starttime,finishtime:finishtime},
        url:'/meeting/agenda/'+mid,
        type:'post',
        dataType:'json',
        success:function(data){
          if(data.code == 500){
            $("#status").html("未知错误").css('display','block');
          }else if(data.code ==404){
            $("#status").html("议程已存在，请重新输入！").css('display','block');
          }else if(data.code == 200){
            forward('/meeting/edit?meetingid='+mid)
          }
        }
      });
    });
  });

  $("ul li span.badge").click(function(event){
    deleteFileClick(event);
  });
  //$("body").css("overflow","auto");

  $("#meetingname").trigger("change");
  $("#meetingname").bind("change",function() {
    saveNameAndTime()
  });
  $("#meetingtime").trigger("change");
  $("#meetingtime").bind("change",function() {
    saveNameAndTime()
  });
  $("#checkAlready").click(function(){
    $(".linkFiles").find("input:checkbox").each(function(){
      if($("#checkAlready").prop("checked")) {
        $(this).prop("checked", "checked");
      }else{
        $(this).prop("checked", false);
      }
    })
  });
  $("#checkNone").click(function(){
    $(".unlinkFiles").find("input:checkbox").each(function(){
      if($("#checkNone").prop("checked")) {
        $(this).prop("checked", "checked");
      }else{
        $(this).prop("checked", false);
      }
    })
  });

});

function associate(id){
  var guid, name, size, path, pdfPath;
  var status = true;
  var chk = $("input[id^='media_']:checked").not("#chkMediaAll");
  if (chk.length == 0) {
    alert("请选中要关联的项");
    return void(0);
  }
  else if (confirm("是否确定关联选中文件？") == true) {
    $(chk).each(function (each) {
      guid = $(this).val();
      name = $("#name_" + guid).text();
      size = $("#size_" + guid).text();
      path = $("#path_" + guid).text();
      pdfPath = $("#padPath_" + guid).text();
      $.ajax({
        data: {guid: guid, name: name, size: size, path: path, pdfPath: pdfPath},
        url: '/meeting/association/' + id,
        type: 'post',
        dataType: 'json',
        success: function (data) {
          if (data == 200) {
          }else{
            status = false;
          }
        }
      })
    });
    if (status) {
      window.location.reload();
    }else{
      alert("关联失败！")
    }
  }
}

function saveEdit(){
  var time = $('#meetingtime').val();
  var name = $('#meetingname').val().trim();
  var mid = $("#meetingid").text();
  if(name==="" || time ===""){
    return $(".errorStatus").errorShow("会议名称或者时间不允许为空");
  }
  $.ajax({
    data:{name:name,starttime:moment(time).format("YYYY-MM-DD HH:mm")},
    url:'/meeting/modify/' + mid,
    type:'post',
    dataType:'json',
    async:false,
    success:function(data){
      if(data.code == 500){
        alert("未知错误");
      }else if (data.code == 200) {
        alert("提交成功！");
        forward('/meeting');
      }
    }
  });
}

function saveNameAndTime(){
  var time = $('#meetingtime').val();
  var name = $('#meetingname').val().trim();
  var mid = $("#meetingid").text();
  if(name==="" || time ===""){
    return $(".errorStatus").errorShow("会议名称或者时间不允许为空");
  }
  $.ajax({
    data:{id:mid,name:name,starttime:moment(time).format("YYYY-MM-DD HH:mm")},
    url:'/meeting/create',
    type:'post',
    dataType:'json',
    async:false,
    success:function(data){
    }
  });
}

function deleteAgenda(mid,aid){
  if (confirm("是否确定删除该议程？") == true) {
    $.ajax({
      url: '/meeting/' + mid + '/agenda/' + aid,
      type: 'delete',
      dataType: 'json',
      success: function (data) {
        if (data.code == 200) {
          $("#itemAgenda"+data.aid).remove();
        } else if (data.code == 202) {
          alert("进行中的会议不能删除议程");
        }
        else if (data.code == 404) {
          alert("数据加载有误，请刷新页面重试");
        } else {
          alert("未知错误");
        }
      }
    });
  }
}



function back(){
  if (confirm("修改信息未提交，确定返回主页？") == true) {
    forward('/meeting')
  }
}




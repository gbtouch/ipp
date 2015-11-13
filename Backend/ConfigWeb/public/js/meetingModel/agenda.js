/**
 * Created by kpin on 2015/5/21.
 */

$(function(){
  var startDate = $("#mDate").text();
  var endDate = moment(startDate).format("YYYY-MM-DD")+" 23:59:00";

  setGuidHeader('guideAgenda');
  //$("body").css('overflow','auto');
  CheckBoxInitial('ChkAll','agenda');
  var mid = $("#meetingid").text();
  //新建议程框初始化
  $("#agendaModal").on('show.bs.modal',function(e) {
    $(this).find("#status").html("").css('display', 'none');
    initialDTChk(startDate,endDate);
    var agendaid = $(e.relatedTarget).data('agenda');
    var page = $(e.relatedTarget).data('type');
    if (page == 'edit') {
      $(this).find("#myModalLabel").text("编辑议题");
      $.get('/meeting/agenda/'+mid+'/'+agendaid,function(agenda){
        if(agenda == 400){
          $(this).find("#status").errorShow("获取数据有误，请刷新页面重试");
        }else{
          //$('#agendaindex').val(agenda.index);
          $('#agendaname').val(agenda.name);
          $('#agendareporter').val(agenda.reporter);
          $('#agendastarttime').val(agenda.starttime);
          $('#agendafinishtime').val(agenda.endtime);
          var ifVote = document.getElementById('agendaVoteInput');
          if(agenda.vote){
            $('#agendaVote').prop('checked','checked');
            if(ifVote){
              $('#agendaVoteName').val(agenda.vote.name);
            }else{
              $('#agendaMoadlBody').append('<div style="margin-top:15px" class="form-group" id="agendaVoteInput"><div class="input-group"><span class="input-group-addon">表 决 项</span><input id="agendaVoteName" type="text" class="form-control"></div></div>')
              $('#agendaVoteName').val(agenda.vote.name);
            }
          }
        }
      });
      $("#saveAgenda").unbind('click').bind('click', function () {
        editAgenda(mid,agendaid);
      });
    } else if (page == 'add'){
      $(this).find("#myModalLabel").text("添加议题");
      initialInput();
      $("#saveAgenda").unbind('click').bind('click', function () {
        addAgenda(mid);
      });
    }
  });

  setMenu('meeting');
});

function initialInput(){
  //$('#agendaindex').val("");
  $('#agendaname').val("");
  $('#agendareporter').val("");
  $('#agendastarttime').val("");
  $('#agendafinishtime').val("");
  $('#agendaVoteName').val("");
}

function initialDTChk(startDate,endDate){
  $('#DTChk1').datetimepicker({
    language:  'zh-CN',
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startDate:startDate,
    endDate:null,
    initialDate:startDate,
    startView: 1,
    minView:0,
    maxView:1,
    forceParse: 0
    //format:"hh:ii"
    //showMeridian: 1
  });
  //  .on('show',function(ev) {
  //  if($('#agendaModal').length>0) {
  //    var rootSTop = agendaModal.scrollTop;
  //    console.log("root:"+rootSTop);
  //    var rootTop = parseFloat( $('.datetimepicker:visible').css('top'));
  //    console.log("top:"+rootTop);
  //    $('.datetimepicker:visible').data('rootSTop', rootSTop);
  //    $('.datetimepicker:visible').data('rootTop', rootTop);
  //  }
  //  console.log('show');
  //  var height = $('#agendaModal .modal-dialog').height();
  //  height = height+500;
  //  $('#agendaModal .modal-dialog').css('height',height);
  //}).on('hide',function(ev) {
  //  console.log('hide');
  //  var height = $('#agendaModal .modal-dialog').height();
  //  height = height-500;
  //  $('#agendaModal .modal-dialog').css('height',height)
  //  $('.datetimepicker:visible').css('top', 0)
  //});

  $('#DTChk2').datetimepicker({
    language:  'zh-CN',
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startDate:startDate,
    endDate:null,
    initialDate:startDate,
    startView: 1,
    minView:0,
    maxView:1,
    forceParse: 0
    //format:"hh:ii"
    //showMeridian: 1
  });
}

function voteAppear(){
  var a = $("#agendaVote").is(':checked');
  if(a){
    $('#agendaMoadlBody').append('<div style="margin-top:15px" class="form-group" id="agendaVoteInput"><div class="input-group"><span class="input-group-addon">表 决 项</span><input id="agendaVoteName" type="text" class="form-control"></div></div>')
  }else{
    $('#agendaVoteInput').remove();
  }
}



function addAgenda(mid){
  //var index = $('#agendaindex').val().trim();
  var name = $('#agendaname').val().trim();
  var reporter = $('#agendareporter').val().trim();
  var starttime = $('#agendastarttime').val();
  var finishtime = $('#agendafinishtime').val();
  var agendaVote = $('#agendaVote').is(':checked');
  var agendaVoteName;
  if(agendaVote){
    agendaVoteName = $('#agendaVoteName').val().trim();
    if(agendaVoteName == ''){
      return $("#status").errorShow("表决名不能为空").css('display','block');
    }
  }else{
    agendaVoteName = 'param';
  }
  var pattern = /^[1-9][0-9]?$/;
  //if(pattern.test(index)==false){
  //  return $("#status").errorShow("议题序号必须为数字").css('display','block');
  //}
  if(name=== ""||reporter===""||starttime===""||finishtime===""){
    return $("#status").errorShow("每项容均不能为空").css('display','block');
  }
  if(name.length>50){
    return $("#status").errorShow("议题名不能超过50个字符").css('display','block');
  }
  if(reporter.length>10){
    return $("#status").errorShow("汇报人不能超过10个字符").css('display','block');
  }
  if(starttime>=finishtime){
    return $("#status").errorShow("结束时间必须大于开始时间").css('display', 'block');
  }
  if(agendaVote && agendaVoteName.length>30){
    return $("#status").errorShow("表决名不能超过30个字符").css('display', 'block');
  }
  $.ajax({
    data:{name: name,reporter:reporter,starttime:starttime,finishtime:finishtime,vote:agendaVote,voteName:agendaVoteName},//index:index,
    url:'/meeting/agenda/'+mid,
    type:'post',
    dataType:'json',
    success:function(data){
      if(data.code == 500){
        $("#status").html("未知错误").css('display','block');
      }else if(data.code ==404){
        $("#status").html("议题已存在，请重新输入！").css('display','block');
      }else if(data.code == 200){
        window.location.reload();
      }
    }
  });
}

function editAgenda(mid,agendaid){
  //var index = $('#agendaindex').val().trim();
  var name = $('#agendaname').val().trim();
  var reporter = $('#agendareporter').val().trim();
  var starttime = $('#agendastarttime').val();
  var finishtime = $('#agendafinishtime').val();
  var agendaVote = $('#agendaVote').is(':checked');
  var agendaVoteName;
  if(agendaVote){
    agendaVoteName = $('#agendaVoteName').val().trim();
    if(agendaVoteName == ''){
      return $("#status").errorShow("表决名不能为空").css('display','block');
    }
  }else{
    agendaVoteName = 'param';
  }
  var pattern = /^[1-9][0-9]?$/;
  //if(pattern.test(index)==false){
  //  return $("#status").html("议题序号必须为数字").css('display','block');
  //}
  if(name=== ""||reporter===""||starttime===""||finishtime===""){
    return $("#status").html("每项容均不能为空").css('display','block');
  }
  if(name.length>50){
    return $("#status").errorShow("议题名不能超过50个字符").css('display','block');
  }
  if(reporter.length>10){
    return $("#status").errorShow("汇报人不能超过10个字符").css('display','block');
  }
  if(starttime>=finishtime){
    return $("#status").errorShow("结束时间必须大于开始时间").css('display', 'block');
  }
  if(agendaVote && agendaVoteName.length>30){
    return $("#status").errorShow("表决名不能超过30个字符").css('display', 'block');
  }
  $.ajax({
    data:{agendaid:agendaid,name: name,reporter:reporter,starttime:starttime,finishtime:finishtime,vote:agendaVote,voteName:agendaVoteName},//,index:index
    url:'/meeting/agenda/'+mid+'/'+agendaid,
    type:'post',
    dataType:'json',
    success:function(data){
      //if(data.code == 500){
      //  $("#status").html("未知错误").css('display','block');
      //}else if(data.code == 309){
      //  $("#status").html("议题已存在，请重新输入！").css('display','block');
      //}else if(data.code == 200){
      //  alert('成功！');
      window.location.reload();
      //}
    }
  });
}

function deleteAgendas() {
  var mid = $("#meetingid").text();
  var chk = $("input[id^='agenda']:checked").not("#chkAll");
  if (chk.length == 0) {
    alert("请选中要删除的项");
    return void(0);
  }
  else if (confirm("是否确定删除选中项？") == true) {
    $(chk).each(function (each) {
      var id = $(this).val();
      $.ajax({
        url: '/meeting/'+mid+'/agenda/' + id,
        type: 'delete',
        dataType: 'json',
        success: function (data) {
          if (data.code == 200) {
            window.location.reload();
          } else if (data.code == 202) {
            alert("进行中的会议不能删除议题");
          }
          else if (data.code == 404) {
            alert("数据加载有误，请刷新页面重试");
          } else {
            alert("未知错误");
          }
        }
      });
    });
  }
  setMenu('meeting');
}

function getAgenda(mid){
  $.ajax({
    url:'/meeting/'+mid+'/agenda',
    type:'get',
    async:false,
    dataType:'json',
    success:function(data){
      if(data == 500){
        $("#agendaStatus").find("#status").html("未知错误,未加载议题列表").css('display','block');
      }else if(data ==404){
        $("#agendaStatus").find("#status").html("数据错误,请刷新页面重试").css('display','block');
      }else {
        $('#agendaTable').find('tbody').html("");
        if (data.length > 0) {
          data.forEach(function (item) {
            item.meetingid = mid;
            var tmpl = _.template($('#agendaTemp').html());
            $('#agendaTable').append(tmpl(item));
          });
          CheckBoxInitial('ChkAll', 'agenda');
        }
      }
    }
  });
    setMenu('meeting');
}

function moveAgenda(mid,aid,move){
  $.ajax({
    url:'/meeting/agenda/moving',
    type:'post',
    data:{meetingid:mid,agendaid:aid,move:move},
    dataType:'json',
    async: false,
    success:function(data){
      if(data.code == 500){
        $("#statusAgenda").errorShow("<span class=\"glyphicon glyphicon-warning-sign\">&nbsp未知错误</span>");
      } else if(data.code == 404){
        $("#statusAgenda").errorShow("<span class=\"glyphicon glyphicon-warning-sign\">&nbsp数据异常，请刷新页面重试</span>");
      } else if (data.code == 200){
        var current = $("#itemAgenda"+data.aid);
        if(move===1){ //下移
          var other = $(current).next();
          $(current).insertAfter($(other));
        }else{
          var other = $(current).prev();
          $(current).insertBefore($(other));
        }
        var i = $(current).find('.index');
        if(i){
          var j = $(other).find('.index');
          var num = $(j).html();
          $(j).html($(i).html());
          $(i).html(num);
        }
      } else{
        $("#statusAgenda").errorShow("<span class=\"glyphicon glyphicon-warning-sign\">&nbsp文件超出移动范围</span>").css('display','block');
      }
    }
  });
    setMenu('meeting');
}

function nextPage(url){
  if($("#agendaTable .agendaTbody tr").length>=1) {
    forward(url);
  }else{
    alert("至少需要一条议题记录");
  }
}
/**
 *
 * Created by Joan on 2015/5/20.
 */

$(function(){
  setGuidHeader('guideAllocation');
  var mid = $("#meetingid").text();
  //$("body").css('overflow','hidden');

  $(".liAgenda").click(function(event) {
    if(event.target.type!='radio') {
      liAgendaClick($(this), event);
    }
  });

  $(".liFile").click(function(event){
    if(event.target.type!='checkbox') {
      liFileClick($(this), event);
    }
  });

  $(".fileFilter li").click(function(event){
    if(event.target.type!='checkbox') {
      liFileClick($(this), event);
    }
  });

  setMenu('meeting');
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

function liAgendaClick(obj,e) {
  var v = !$(obj).find('input:radio').prop('checked');
  $(obj).find('input').prop('checked', v);
}

function liFileClick(obj,e) {
  var v = !$(obj).find('input:checkbox').prop('checked');
  $(obj).find('input').prop('checked', v);
}

function agendaRadioChange(mid,aid){
  var name = $("li#itemAgenda"+aid).attr("title");
  $('.currentAgenda').text("当前议程：" + name);
  $.ajax({
    url: '/meeting/allocation/agenda',
    type: 'post',
    dataType: 'json',
    data: {mid: mid, aid: aid},
    success: function (data) {
      $('ul.linkFiles').html("");
      $('ul.unlinkFiles').html("");
      if (data.code == 200) {
        data.linkFiles.forEach(function(item){
          if(item.name.length>20) {
            item.name = item.name.substr(0, 20) + '...';
          }
          var tmpl = _.template($('#filelist').html());
          $('ul.linkFiles').append(tmpl(item));
          if(item.type=="image"){
            $("ul.linkFiles").find("li[id^='li"+item.id+"'] span#glyphiconType").addClass("glyphicon-picture");
          }else if(item.type == "video"){
            $("ul.linkFiles").find("li[id^='li"+item.id+"'] span#glyphiconType").addClass("glyphicon-facetime-video");
          }else{
            $("ul.linkFiles").find("li[id^='li"+item.id+"'] span#glyphiconType").addClass("glyphicon-file");
          }
          $('ul.linkFiles').find("span[class='badge circle']").attr('style','display:none');
        });

        data.unlinkFiles.forEach(function(item){
          if(item.name.length>20) {
            item.name = item.name.substr(0, 20) + '...';
          }
          var tmpl = _.template($('#filelist').html());
          $('ul.unlinkFiles').append(tmpl(item));
          if(item.type=="image"){
            $("ul.unlinkFiles").find("li[id^='li"+item.id+"'] span#glyphiconType").addClass("glyphicon-picture");
          }else if(item.type == "video"){
            $("ul.unlinkFiles").find("li[id^='li"+item.id+"'] span#glyphiconType").addClass("glyphicon-facetime-video");
          }else{
            $("ul.unlinkFiles").find("li[id^='li"+item.id+"'] span#glyphiconType").addClass("glyphicon-file");
          }
          $('ul.unlinkFiles').find("span[class='badge circle']").attr('style','');
        });

        //初始化file click事件
        $(".liFile").click(function(event){
          if(event.target.type!='checkbox') {
            liFileClick($(this), event);
          }
        });
        $("ul li span.badge").click(function(event){
          deleteFileClick(event);
        });
        //初始化筛选按钮
        $(".fileFilter span").each(function(){
          $(this).removeClass('btn-primary').addClass('btn-default active');
        });
        $("#allF").addClass('btn-primary').removeClass('btn-default active')

      } else if (data.code == 404) {
        alert(data.error);
      } else {
        alert("未知错误");
      }
    }
  });
}

function moveLeft(mid) {
  var chk = $("input[id^='agenda']:checked");
  var aid = $(chk).val();
  if (chk.length == 0) {
    return alert("请选中议程");
  }
  var files = [];
  var chkFiles = $('ul.unlinkFiles').find("input[id^='file']:checked");
  if (chkFiles.length == 0) {
    return alert("请选中需要分配的资料");
  } else {
    $(chkFiles).each(function () {
      files.push($(this).val());
    });
  }
  $.ajax({
    url: '/meeting/' + mid + '/agenda/' + aid + '/allocation',
    type: 'post',
    dataType: 'json',
    data: {ids:JSON.stringify(files)},
    success: function (data) {
      if (data.code == 200) {
        data.files.forEach(function(id){
          $('ul.unlinkFiles').find("li[id='li"+id+"']").appendTo($('ul.linkFiles'));
          $('ul.linkFiles').find("span[class='badge circle']").attr('style','display:none');
        });
      }
      else if (data.code == 202) {
        alert("会议正在进行中，不能删除");
      } else if (data.code == 404) {
        alert("会议不存在或已被删除");
      } else {
        alert("未知错误");
      }
    }
  });
}

function moveRight(mid){
  var chk = $("input[id^='agenda']:checked");
  var aid = $(chk).val();
  if (chk.length == 0) {
    return alert("请选中议程");
  }
  var files = [];
  var chkFiles = $('ul.linkFiles').find("input[id^='file']:checked");
  if (chkFiles.length == 0) {
    return alert("请选中需要撤回的资料");
  } else {
    $(chkFiles).each(function () {
      files.push($(this).val());
    });
  }
  $.ajax({
    url: '/meeting/' + mid + '/agenda/' + aid + '/cancel',
    type: 'post',
    dataType: 'json',
    data: {ids:JSON.stringify(files)},
    success: function (data) {
      if (data.code == 200) {
        data.files.forEach(function(id){
          $('ul.linkFiles').find("li[id='li"+id+"']").appendTo($('ul.unlinkFiles'));
          $('ul.unlinkFiles').find("span[class='badge circle']").attr('style','');
          $('ul.linkFiles').find("span[id='span"+id+"']").click(function(event){
            deleteFileClick(event);
          });
        });
        //initialClick();
        $('ul.unlinkFiles li').each(function() {
          $(this).attr('style', '');
        });
        //初始化筛选按钮
        $(".fileFilter span").each(function(){
          $(this).removeClass('btn-primary').addClass('btn-default active');
        });
        $("#allF").addClass('btn-primary').removeClass('btn-default active')
      }
      else if (data.code == 202) {
        alert("会议正在进行中，不能删除");
      } else if (data.code == 404) {
        alert("会议不存在或已被删除");
      } else {
        alert("未知错误");
      }
    }
  });
}

function deleteFiles(mid) {
  var chk = $("input[id^='file']:checked").not("#fileChkAll");
  if (chk.length == 0) {
    return alert("请选中要删除的项");
  }
  else {
    if (confirm("是否确定删除选中项？") == true) {
      $(chk).each(function (each) {
        var id = $(this).val();
        var config = {};
        config.url = '/meeting/file/' + id;
        config.data = {mid: mid};
        d(config, deleteFileCallback);
      });
    }
  }
}

function deleteFileCallback(data){
  if (data.stateCode == 200) {
    $("#filesTable").find("tr[id='" + data.fid + "']").remove();
  } else if (data.stateCode == 202) {
    $("#meetingFile").find("#status").html("会议正在进行中，会议资料不能删除").css('display', 'block');
  } else if (data.stateCode == 309) {
    $("#meetingFile").find("#status").html("会议资料转换中，不能删除").css('display', 'block');
  } else if (data.stateCode == 404) {
    $("#meetingFile").find("#status").html("会议不存在").css('display', 'block');
  } else if (data.stateCode == 500) {
    $("#meetingFile").find("#status").html("未知错误").css('display', 'block');
  }
}

function complete(mid){
  if(confirm("是否完成会议配置？")){
    postMeeting(mid);
    forward('/meeting');
  }else{
    return false;
  }
}

function deleteFileClick(event){
  var mid = $(event.target).data('mid');
  var fid = $(event.target).data('fid');
  event.stopPropagation();
  if (confirm("是否确定删除已分配文件？") == true) {
    $.ajax({
      url: '/meeting/file/' + fid,
      data: {mid: mid},
      type:'delete',
      dataType:'json',
      async:false,
      success:function(data){
        if (data.stateCode == 200) {
          $('ul.unlinkFiles').find("li[id='li" + fid + "']").remove();
        } else if (data.stateCode == 202) {
          alert("会议正在进行中，会议资料不能删除!")
        } else if (data.stateCode == 309) {
          alert("会议资料转换中，不能删除!")
        } else if (data.stateCode == 404) {
          alert("会议不存在!")
        } else if (data.stateCode == 500) {
          alert("未知错误!")
        }
      }
    })
  }
}

function select(a, b, c) {
  $('.unlinkFiles li').each(function(){
    $(this).attr('style','');
    var type = $(this).data('type');
    if(type == a || type == b || type == c){
    }else{
      $(this).attr('style','display:none');
    }
  });
}

function filterFile(obj){
  select('file',null,null);
  filter(obj);
}

function filterImage(obj){
  select('image',null,null);
  filter(obj);
}

function filterVideo(obj){
  select('video',null,null);
  filter(obj);
}

function filterAll(obj){
  select('video','file','image');
  filter(obj);
}

function filter(obj){
  $(".fileFilter span").each(function(){
    $(this).removeClass('btn-primary').addClass('btn-default active');
  });
  $(obj).addClass('btn-primary').removeClass('btn-default active');
}
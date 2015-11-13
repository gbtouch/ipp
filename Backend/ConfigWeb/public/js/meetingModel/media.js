/**
 *
 * Created by Joan on 2015/5/20.
 */

$(function(){
  setGuidHeader('guideUpload');
  var mid = $("#meetingid").text();
  uploadFiles(mid);
  //uploadOthers(mid);
  //$("body").css('overflow','hidden');
  CheckBoxInitial('fileChkAll','file');
  $(".modal").modal({
    backdrop: 'static',
    keyboard: false,
    show: false
  });
  setMenu('meeting');
});


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

function nextPage(url){
  if($("table tbody tr").length>=1) {
    forward(url);
  }else{
    alert("至少需要一条文件记录");
  }
}
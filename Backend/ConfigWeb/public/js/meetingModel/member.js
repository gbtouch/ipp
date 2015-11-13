/**
 * Created by tommy_2 on 2015/7/6.
 */
$(function(){
  setGuidHeader('guideAttendees');
  var mid = $("#meetingid").text();
  setMenu('meeting');
  //$("body").css('overflow','hidden');
  $(".liMember").click(function(event) {
    if(event.target.type!='checkbox') {
      liMemberClick($(this), event);
    }
  });
  liCheckBoxInitial("unlinkMember");
  liCheckBoxInitial("linkMember");
});

function mMoveLeft(mid) {
  var chkMember = $('ul.unlinkMember').find("input[id^='member']:checked");
  var arr = [];
  if (chkMember.length == 0) {
    return alert("请选中需要分配的人员");
  } else {
    $(chkMember).each(function () {
      var m = $(this).data('member');
      if($(this).data('filter') != 'f'){
        arr.push(JSON.stringify(m));
      }
    });
  }
  $.ajax({
    url: '/meeting/' + mid + '/member/allocation',
    type: 'post',
    dataType: 'json',
    data: {member:arr},
    success: function (data) {
      if (data.code == 200) {
        for(var i in arr){
          var memberid = JSON.parse(arr[i]).id;
          $('ul.unlinkMember').find("li[id='li" + memberid + "']").appendTo($('ul.linkMember'));
        }
        liCheckBoxInitial("unlinkMember");
        liCheckBoxInitial("linkMember");
      } else {
        alert("未知错误");
      }
    }
  });


}

function mMoveRight(mid) {
  var chkMember = $('ul.linkMember').find("input[id^='member']:checked");
  var ids = [];
  if (chkMember.length == 0) {
    return alert("请选中需要撤回的人员");
  } else {
    $(chkMember).each(function () {
      ids.push($(this).val());
    });
  }
  $.ajax({
    url: '/meeting/' + mid + '/member/cancel',
    type: 'post',
    dataType: 'json',
    data: {ids: ids},
    success: function (data) {
      if (data.code == 200) {
        for(var i in ids){
          var memberid = ids[i];
          $('ul.linkMember').find("li[id='li" + memberid + "']").appendTo($('ul.unlinkMember'));
        }
        $('ul.unlinkMember li').each(function() {
          $(this).attr('style', '');
        });
        //初始化筛选按钮
        $(".fileFilter span").each(function(){
          $(this).removeClass('btn-primary').addClass('btn-default active');
        });
        $("#allF").addClass('btn-primary').removeClass('btn-default active');
        liCheckBoxInitial("unlinkMember");
        liCheckBoxInitial("linkMember");
      } else {
        alert("未知错误");
      }
    }
  });
}
function gotoAgenda(url){
  if($("ul.linkMember li").length>=1) {
    forward(url);
  }else{
    alert("请分配参会人员");
  }
}
function liMemberClick(obj,e) {
  var v = !$(obj).find('input:checkbox').prop('checked');
  $(obj).find('input').prop('checked', v);
}

function select(a) {
  $('.unlinkMember li').each(function(){
    $(this).attr('style','');
    $(this).find('input').data('filter','');
    var type = $(this).data('unit');
    if(type == a){
    }else{
      $(this).attr('style','display:none');
      $(this).find('input').data('filter','f');
    }
  });
}

function filterOne(unit, obj){
  select(unit);
  filter(obj);
  liCheckBoxInitial("unlinkMember");
  liCheckBoxInitial("linkMember");
}

function filterAll(units, obj){
  $('.unlinkMember li').each(function(){
    $(this).attr('style','');
    $(this).find('input').data('filter','');
  });
  filter(obj);
  liCheckBoxInitial("unlinkMember");
  liCheckBoxInitial("linkMember");
}

function search(){
  var index = $('#searchIndex').val().trim();
  $(".fileFilter span").each(function(){
    $(this).removeClass('btn-primary').addClass('btn-default active');
  });
  $('#allF').addClass('btn-primary').removeClass('btn-default active');
  $('.unlinkMember li').each(function() {
    $(this).attr('style', '');
    $(this).find('input').data('filter', '');
    var content = $(this).data('index');
    if(index == ''){
    } else if (content.indexOf(index) == -1){
      $(this).attr('style', 'display:none');
      $(this).find('input').data('filter','f');
    }
  });
}

function filter(obj){
  $(".fileFilter span").each(function(){
    $(this).removeClass('btn-primary').addClass('btn-default active');
  });
  $(obj).addClass('btn-primary').removeClass('btn-default active');
}
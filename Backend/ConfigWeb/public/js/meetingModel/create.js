/**
 * Created by kpin on 2015/5/19.
 */

$(function(){
  $('#DTChk').datetimepicker('remove');
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
    minView: 0,
    maxView: 1,
    forceParse: 0
    //pickerPosition:"style:'top:0'"
    //showMeridian: 1
  });
  $('#DTChk').on('show',function(ev){
    var rootSTop = document.body.scrollTop;
    console.log(rootSTop);
    var rootTop = parseFloat( $('.datetimepicker:visible').css('top'));
    console.log(rootTop);
    console.log(rootTop-rootSTop);
    $('.datetimepicker:visible').data('rootSTop', rootSTop);
    $('.datetimepicker:visible').data('rootTop', rootTop-rootSTop);


  });
  setGuidHeader('guideCreate');
  setMenu('meeting');
  //$("body").css('overflow','auto');
});

function save(type){
  $(".errorStatus").html("").hide();
  var time = $('#meetingtime').val();
  var name = $('#meetingname').val().trim();
  //var reporter = $('#meetingreporter').val().trim();
  if (type == '0'){
    var mid = ''
  } else {
    var mid = $("#meetingid").text();
  }
  if(name==="" || time ===""){
    return $(".errorStatus").errorShow("名称或时间不允许为空");
  }
  if(name.length>100){
    return $(".errorStatus").errorShow("会议名称不能超过100个字符");
  }
  $.ajax({
    data:{name:name,starttime:moment(time).format("YYYY-MM-DD HH:mm"),id:mid},
    url:'/meeting/create',
    type:'post',
    dataType:'json',
    async:false,
    success:function(data){
      if(data.code == 500){
        $(".errorStatus").errorShow("未知错误");
      }else if (data.code == 200) {
         forward('/meeting/member?mid='+data.id);
        //$(".errorStatus").errorShow("创建成功");
        //forward('/meeting/agenda?mid='+data.id);
//        forward('/agenda/add?meetingid='+data.mid);
      }else{
        $(".errorStatus").errorShow("会议名称已经存在");
      }
    }
  });
    setMenu('meeting');
}

function pre(type) {
  if (type == '0'){
    forward('/meeting/')
  } else {
    var mid = $("#meetingid").text();
    $.ajax({
      url: '/meeting/cache/' + mid,
      type: 'delete',
      dataType: 'json',
      async: false,
      success: function (data) {
        if (data == 200) {
          forward('/meeting/')
        }
      }
    })
  }
}
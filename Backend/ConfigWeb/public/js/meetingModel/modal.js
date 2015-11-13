/**
 * Created by tommy_2 on 2015/8/12.
 */
var bool = false,bool1 = false;
var today = new Date();
$(function(){
  $('#DTChk').datetimepicker({
    language:  'zh-CN',
    //startDate: today,
    format: 'yyyy-mm-dd',
    minView: "month",
    initialDate:new Date(),
    todayBtn:  1,
    autoclose: 1
  });
  $('#DTChk1').datetimepicker({
    language:  'zh-CN',
    //startDate: today,
    format: 'yyyy-mm-dd',
    minView: "month",
    initialDate:new Date(),
    todayBtn:  1,
    autoclose: 1
  });
  $('#DTCh').datetimepicker({
    language:  'zh-CN',
    startDate: today,
    format: 'yyyy-mm-dd',
    minView: "month",
    initialDate:new Date(),
    todayBtn:  1,
    autoclose: 1
  });
  $(".type-date").bind("click",function(){
    $(".type-date").removeClass("checked");
    $(this).addClass("checked");
    if($(this).attr("href") == "#day"){
      $(".calendar").addClass("dd");
      $(".calendar").removeClass("ww");
      $(".calendar").removeClass("mm");
    }else if($(this).attr("href") == "#week"){
      $(".calendar").addClass("ww");
      $(".calendar").removeClass("dd");
      $(".calendar").removeClass("mm");
      colorday();
    }else{
      $(".calendar").addClass("mm");
      $(".calendar").removeClass("dd");
      $(".calendar").removeClass("ww");
      var qq = new Date(StringToDate($(".turnDay-show").val()));
      mongthType(getMonthDay(qq.getFullYear(),qq.getMonth()));
      colorday();
    }
    dayType();
    show();
  });
  $(".type").click(function(){
    $(".type").removeClass("checked");
    $(this).addClass("checked");
  });
  $("#DTChk").val(changetype(today));
  $("#DTChk1").val(changetype(today));
  $(".turnDay-show").val(changetype(today));
  show();
  $("#select").click(function(){
    if($("#DTChk").val() == ""){
      $(".turnDay-show").val(changetype(today))
    }else {
      $(".turnDay-show").val($("#DTChk").val());
    }
    var qq = new Date(StringToDate($(".turnDay-show").val()));
    mongthType(getMonthDay(qq.getFullYear(),qq.getMonth()));
    show();
    colorday();
    selectModal();
    selectTable('currentTable');
  });
  $("#select1").click(function(){
    $(".turnDay-show").val($("#DTChk1").val());
    var qq = new Date(StringToDate($(".turnDay-show").val()));
    mongthType(getMonthDay(qq.getFullYear(),qq.getMonth()));
    selectTable('currentTable1');
  });
  $(".turnDay-back").click(function(){
    var tt = new Date(StringToDate($(".turnDay-show").val()));
    if($(".turnDay-show").val() == ""){
      $(".turnDay-show").val(changetype(today));
    }
    var change = new Date(StringToDate($(".turnDay-show").val())-1+1+changeDate(getMonthDay(tt.getFullYear(),tt.getMonth())));
    $(".turnDay-show").val(changetype(change));
    mongthType(getMonthDay(change.getFullYear(),change.getMonth()));
    $("#DTChk").val($(".turnDay-show").val());
    show();
    colorday();
  });
  $(".turnDay-front").click(function(){
    var tt = new Date(StringToDate($(".turnDay-show").val()));
    if($(".turnDay-show").val() == ""){
      $(".turnDay-show").val(changetype(today));
    }
    var change = new Date(StringToDate($(".turnDay-show").val())-changeDate(getMonthDay(tt.getFullYear(),tt.getMonth()-1)));
    $(".turnDay-show").val(changetype(change));
    mongthType(getMonthDay(change.getFullYear(),change.getMonth()));
    $("#DTChk").val($(".turnDay-show").val());
    show();
    colorday();
  });
  $("#DTCh").trigger("change");
  $("#DTCh").bind("change",function(){
    $("#DTChk").val($(".turnDay-show").val());
    colorday($(".turnDay-show").val());
    show();
  });
  $(".spanDown").click(function(){
    var table = document.getElementById("currentTable");
    var len = table.rows.length;
    if(bool == false) {
      for (var i = 2; i < len; i++) {
        for (var j = 1; j < i; j++) {
          var tt1 = table.rows[i].cells[2].innerText;
          var tt2 = table.rows[j].cells[2].innerText;
          var dd1 = new Date(tt1).getTime();
          var dd2 = new Date(tt2).getTime();
          if (dd1 < dd2) {
            var per = table.rows[i].innerHTML;
            table.rows[i].innerHTML = table.rows[j].innerHTML;
            table.rows[j].innerHTML = per;
          }
        }
      }
      $(".spanDown").css({"transform": "rotate(180deg)"});
      bool = true;
    }else{
      for (var ii = 2; ii < len; ii++) {
        for (var jj = 1; jj < ii; jj++) {
          var tt3 = table.rows[ii].cells[2].innerText;
          var tt4 = table.rows[jj].cells[2].innerText;
          var dd3 = new Date(tt3).getTime();
          var dd4 = new Date(tt4).getTime();
          if (dd3 > dd4) {
            var bar = table.rows[ii].innerHTML;
            table.rows[ii].innerHTML = table.rows[jj].innerHTML;
            table.rows[jj].innerHTML = bar;
          }
        }
      }
      $(".spanDown").css({"transform": "rotate(360deg)"});
      bool = false;
    }
  });
  $(".spanDown1").click(function(){
    var table = document.getElementById("currentTable1");
    var len = table.rows.length;
    if(bool1 == false) {
      for (var i = 2; i < len; i++) {
        for (var j = 1; j < i; j++) {
          var tt1 = table.rows[i].cells[2].innerText;
          var tt2 = table.rows[j].cells[2].innerText;
          var dd1 = new Date(tt1).getTime();
          var dd2 = new Date(tt2).getTime();
          if (dd1 < dd2) {
            var per = table.rows[i].innerHTML;
            table.rows[i].innerHTML = table.rows[j].innerHTML;
            table.rows[j].innerHTML = per;
          }
        }
      }
      $(".spanDown1").css({"transform": "rotate(180deg)"});
      bool1 = true;
    }else{
      for (var ii = 2; ii < len; ii++) {
        for (var jj = 1; jj < ii; jj++) {
          var tt3 = table.rows[ii].cells[2].innerText;
          var tt4 = table.rows[jj].cells[2].innerText;
          var dd3 = new Date(tt3).getTime();
          var dd4 = new Date(tt4).getTime();
          if (dd3 > dd4) {
            var bar = table.rows[ii].innerHTML;
            table.rows[ii].innerHTML = table.rows[jj].innerHTML;
            table.rows[jj].innerHTML = bar;
          }
        }
      }
      $(".spanDown1").css({"transform": "rotate(360deg)"});
      bool1 = false;
    }
  });

  $(".remove").click(function(){
    $("#DTChk").val("");
  });
  $(".remove1").click(function(){
    $("#DTChk1").val("");
  });
});
function show(){
  var table = document.getElementById("tableData");
  var len = table.rows.length;
  var tt = $("#DTChk").val();
  if(tt == ""){
    tt = changetype(today);
  }
  var week = getDayofWeek(tt);
  for(var i =1;i<len;i++) {
    $("#calend" + i).remove();
    $("#calenw" + i).remove();
    $("#calenm" + i).remove();
    if(table.rows[i].cells[1].innerText == "waiting") {
      var name = table.rows[i].cells[0].innerText;
      var startTime = table.rows[i].cells[2].innerText;
      var endTime = table.rows[i].cells[3].innerText;
      var itemId = table.rows[i].cells[4].innerText;
      var startHour = startTime.split(" ")[1].split(":")[0];
      var startMin = startTime.split(" ")[1].split(":")[1];
      var endHour = endTime.split(" ")[1].split(":")[0];
      var endMin = endTime.split(" ")[1].split(":")[1];
      var dleft = (startHour - 8 + startMin / 60) * 100;
      var dwid = (endHour - 8 + endMin / 60) * 100 - dleft;
      var wtop = dleft * 0.6;
      var whei = dwid * 0.6;
      var calendarDay = "<div class='appointDay' id='calend" + i + "' data-toggle='modal' data-target='#meetingModal' data-id='"+itemId+
        "', data-name='"+name+"', data-starttime='"+startTime+"', data-endtime='"+endTime+"'><p>" + name + "</p></div>";
      var calendarWeek = "<div class='appointWeek' id='calenw" + i + "' data-toggle='modal' data-target='#meetingModal' data-id='"+itemId+
        "', data-name='"+name+"', data-starttime='"+startTime+"', data-endtime='"+endTime+"'><p>" + name + "</p></div>";
      var calendarMon = "<div class='appointMon' id='calenm" + i + "' data-toggle='modal' data-target='#meetingModal' data-id='"+itemId+
        "', data-name='"+name+"', data-starttime='"+startTime+"', data-endtime='"+endTime+"'><p>" + name + "</p></div>";
      var ddd = $(".calendar").hasClass("dd");
      var www = $(".calendar").hasClass("ww");
      var mmm = $(".calendar").hasClass("mm");
      if (ddd == true) {
        if (tt == startTime.split(" ")[0]) {
          $(".mainDay").append(calendarDay);
          $("#calend" + i).css("left", dleft + "px");
          $("#calend" + i).css("width", dwid + "px");
        }
      }
      if (www == true) {
        for (var j = 1; j < 8; j++) {
          var weekSelect = new Date(StringToDate(tt) - 1000 * 60 * 60 * 24 * (week - j));
          var weekDay = weekSelect.getFullYear() + '-' + standard(weekSelect.getMonth() + 1) + '-' + standard(weekSelect.getDate());
          var wleft = 170 * j - 120;
          if (weekDay == startTime.split(" ")[0]) {
            $(".mainWeek").append(calendarWeek);
            $("#calenw" + i).css("top", wtop + "px");
            $("#calenw" + i).css("height", whei + "px");
            $("#calenw" + i).css("left", wleft + "px");
          }
        }
      } else if (mmm == true) {
        if (tt.split('-')[1] == startTime.split(" ")[0].split("-")[1]) {
          var startDay = startTime.split(" ")[0].split("-")[2];
          $(".mainMonth").append(calendarMon);
          $("#calenm" + i).css("top", wtop + "px");
          $("#calenm" + i).css("height", whei + "px");
          $("#calenm" + i).css("left", (startDay - 1) * 40 + 50 + "px");
        }
      }
    }
  }
}
function getDayofWeek(dayValue){
  var day = new Date(Date.parse(dayValue.replace(/-/g, '/')));
  var today = new Array(0,1,2,3,4,5,6);
  return today[day.getDay()];
}
function StringToDate(DateStr)
{

  var converted = Date.parse(DateStr);
  var myDate = new Date(converted);
  if (isNaN(myDate))
  {
    var arys= DateStr.split('-');
    myDate = new Date(arys[0],--arys[1],arys[2]);
  }
  return myDate;
}
function changeDate(str){
  var ddd = $(".calendar").hasClass("dd");
  var www = $(".calendar").hasClass("ww");
  var mmm = $(".calendar").hasClass("mm");
  if(ddd == true){
    return 1000*60*60*24;
  }if(www == true){
    return 1000*60*60*24*7;
  }else if(mmm == true){
    return 1000*60*60*24*str;
  }
}
function changetype(str){
  var year = str.getFullYear();
  var mon = standard(str.getMonth()+1);
  var day = standard(str.getDate());
  return year+'-'+mon+'-'+day;
}
function colorday(){
  var ss = $(".turnDay-show").val();
  var mon = ss.split("-")[1];
  var day = ss.split("-")[2];
  var year = ss.split("-")[0];
  var www = $(".calendar").hasClass("ww");
  var mmm = $(".calendar").hasClass("mm");
  var newMon = 1;
  var changeMon = mon-1;
  if(www == true){
    var week = getDayofWeek(ss);
    for(var i=1;i<8;i++){
      var dd = day - week +i;
      if(dd < 1){
        if(mon-1 < 1){
          var frontYear = year-1;
          var frontMonth = 11;
        }else{
          var frontYear = year-1+1;
          var frontMonth = mon-1;
        }
        var frontDay = getMonthDay(frontYear,frontMonth);
        var front = frontDay+dd;
        $("#week"+i+" h6").text(frontMonth+'/'+front);
      }else if(dd > getMonthDay(year-1+1,changeMon)){
        if(mon-1+1 == 12){
          $("#week"+i+" h6").text('01/'+newMon);
        }else{
          $("#week"+i+" h6").text(mon-1+2+'/'+newMon);
        }
        newMon++;
      }else{
        $("#week"+i+" h6").text(mon+'/'+dd);
      }
      if(i == week){
        $(".week").removeClass("thisday");
        $("#week"+i).addClass("thisday");
      }
    }
  }else if(mmm == true){
    for(var i =1;i<32;i++){
      if(i==day){
        $(".month").removeClass("thisday");
        $("#mon"+i).addClass("thisday");
      }
    }
  }
}
function getWeekStartDate() {
  var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
  return formatDate(weekStartDate);
}
function dayType(){
  var ddd = $(".calendar").hasClass("dd");
  var www = $(".calendar").hasClass("ww");
  var mmm = $(".calendar").hasClass("mm");
  if(ddd == true){
    $('.turnDay-front').text("前一天");
    $(".turnDay-back").text('后一天');
  }if(www == true){
    $('.turnDay-front').text("前一周");
    $(".turnDay-back").text('后一周');
  }else if(mmm == true){
    $('.turnDay-front').text("前一月");
    $(".turnDay-back").text('后一月');
  }
}
function getMonthDay(nowYear,myMonth){
  var monthStartDate = new Date(nowYear, myMonth, 1);
  var monthEndDate = new Date(nowYear, myMonth + 1, 1);
  var   days   =   (monthEndDate   -   monthStartDate)/(1000   *   60   *   60   *   24);
  return   days;
}
function mongthType(str){
  var mo = $(".turnDay-show").val().split("-")[1];
  var ff = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
  $(".month").remove();
  $(".ulMonth").remove();
  for(var i=1;i<=str;i++){
    var month = "<div class='month' id='mon"+i+"'><h5>"+i+"</h5></div>";
    $(".classifyMonth").append(month);
    $(".classifyMonth").css("width",70+str*40+"px");
    var li = "<li></li>";
    for(var j=1;j<12;j++){
      li = li+"<li></li>";
    }
    var ul = "<ul class='ulMonth'>"+li+"</ul>";
    $(".mainMonth").append(ul);
  }
  $(".mainMonth").css("width",70+str*40+"px");
  for(var ii = 1;ii<13;ii++){
    if(mo == ii){
      $(".monthShow").text(ff[ii-1]);
    }
  }
}
function selectModal(){
  $(".appointDay").each(function(){
    var name = $("#meetingName").val();
    if($("#meetingName").val() == ""){
      $(this).css("display","block")
    }else {
      var text = $(this).text();
      if(text.indexOf(name) == -1){
        $(this).css("display", "none");
      }else{
        $(this).css("display","block");
      }
    }
  })
}
function selectTable(str) {
  var table = document.getElementById(str);
  var len = table.rows.length;
  if (str == 'currentTable'){
    var currentTime = $("#DTChk").val();
    var currentName = $("#meetingName").val();
    if (currentTime == "" && currentName == "") {
      for (var i = 1; i < len; i++) {
        table.rows[i].style.display = ""
      }
    }else if(currentTime == ""){
      for (var i = 1; i < len; i++) {
        var name1 = table.rows[i].cells[1].innerText;
        if (name1.indexOf(currentName) == -1) {
          table.rows[i].style.display = "none"
        } else {
          table.rows[i].style.display = "";
        }
      }
    } else {
      for (var i = 1; i < len; i++) {
        var time = table.rows[i].cells[2].innerText.split(" ")[0];
        if (currentTime == time) {
          table.rows[i].style.display = "";
          var name = table.rows[i].cells[1].innerText;
          if(name.indexOf(currentName) == -1){
            table.rows[i].style.display = "none"
          }
        } else {
          table.rows[i].style.display = "none"
        }
      }
    }
  } else {
    var currentTime1 = $("#DTChk1").val();
    var currentName1 = $("#meetingName1").val();
    var currentReport = $("#meetingReport").val();
    var currentAgenda = $("#meetingAgenda").val();
    var data = [currentTime1,currentName1,currentReport,currentAgenda];
    var datas = ["time","name","report","agenda"];
    for(var i =3;i>=0;i--){
      if(data[i] == ""){
        data.splice(i,1);
        datas.splice(i,1);
      }
    }
    for(var aa = 1;aa<len;aa++) {
      var check = true;
      for (var j in datas) {
        switch (datas[j]) {
          case "time":
            if (data[j] != table.rows[aa].cells[2].innerText.split(" ")[0]) {
              check = false;
            }
            break;
          case "name":
            if (table.rows[aa].cells[1].innerText.indexOf(data[j]) == -1) {
              check = false;
            }
            break;
          case "report":
            var bool1 = false;
            var reporter = table.rows[aa].cells[4].innerHTML;
            var reLen = reporter.split("<p>").length;
            for(var c = 1;c<reLen;c++){
              if (reporter.split("<p>")[c].split("</p>")[0].indexOf(data[j]) > -1) {
                bool1 = true;
              }
            }
            if (bool1 == false) {
              check = false;
            }
            break;
          case "agenda":
            var bool2 = false;
            var agenda = table.rows[aa].cells[5].innerHTML;
            var agLen = agenda.split("<p>").length;
            for(var cc = 1;cc<agLen;cc++){
              if (agenda.split("<p>")[cc].split("</p>")[0].indexOf(data[j]) > -1) {
                bool2 = true;
              }
            }
            if (bool2 == false) {
              check = false;
            }
            break;
        }
      }
      if(check == true){
        table.rows[aa].style.display = "";
      }else{
        table.rows[aa].style.display = "none";
      }
    }
  }
}
function caseSelect(type,str){
  var table = document.getElementById("currentTable1");
  var len = table.rows.length;
  for(var i = 0;i<len;i++){
    if(type != table.rows[i].cells[str].innerText){
      table.rows[i].style.display = "none";
    }
  }
}
function checkName(obj1,obj2){
  var len = obj1.length;
  var tlen = obj2.length;
  for(var i = 0;i<tlen;i++){
    if(obj2[i] == obj1[0]){
      var tt = 1;
      for(var j=1;j<len;j++){
        if(obj2[i+j] == obj1[j]){
          tt++;
        }
      }
      if(tt == len){
        return true;
      }
    }
  }
}
function standard(str){
  if(str.toString().length == 1){
    return "0"+str;
  }
  else{
    return str;
  }
}
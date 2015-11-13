/**
 * Created by kpin on 2015/8/7.
 */

$(function () {
  var h = document.body.offsetHeight;
  $('#contain').css('height',h);
  $(window).resize(function(){
    $('#contain').css("height",$(this).height());
  });
  $('head').apend("<meta name='renderer' content='webkit' />");
});
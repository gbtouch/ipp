/**
 * Created by kpin on 2015/8/17.
 */
$(function(){
  setMenu('meeting');
  $("#voteResultModal").on('show.bs.modal',function(e) {
    var voteName = $(e.relatedTarget).data('name');
    var voteStr = $(e.relatedTarget).data('vote');
    $('#myModalLabel').text(voteName);
    var vote = JSON.parse(voteStr);
    if(vote.result == '0'){
      $('#voteresult').find('span').attr('class','label label-default label-success').text('通过');
    } else if (vote.result == '1'){
      $('#voteresult').find('span').attr('class','label label-default label-danger').text('未通过');
    } else if (vote.result == '2'){
      $('#voteresult').find('span').attr('class','label label-default label-primary').text('待定');
    } else {
      $('#voteresult').find('span').attr('class','label label-default label-default active').text('取消');
    }
    if(vote.result == '0' || vote.result == '1'){
      var agreeList = $('#agreeList').find('span');
      agreeList.forEach(function(item){
        return item.remove();
      });
      var refusalList = $('#refusalList').find('span');
      refusalList.forEach(function(item){
        return item.remove();
      });
      var abstainList = $('#abstainList').find('span');
      abstainList.forEach(function(item){
        return item.remove();
      });
      var agreeLen = 0,refusalLen = 0 ,abstainLen = 0;
      vote.tickets.forEach(function(item){
        if(item.type == '0'){
          $('#agreeList').append('<span>'+item.name+'</span>>');
          agreeLen++;
        } else if (item.type == '1'){
          $('#refusalList').append('<span>'+item.name+'</span>>');
          refusalLen++;
        } else {
          $('#abstainList').append('<span>'+item.name+'</span>>');
          abstainLen++;
        }
      });
      $('#agree').text('同意'+agreeLen+':');
      $('#refusal').text('反对'+refusalLen+':');
      $('#abstain').text('弃权'+abstainLen+':');
    }
  });
  $("#accordion").accordion({
    collapsible: true
  });
  $('[data-toggle="tooltip"]').tooltip();
  var currIp = getCurrIp();
  var aNginx = $('.message').find('a');
  console.log(aNginx);
  $(aNginx).each(function(item){
    var partUrl = $(this).attr('href');
    $(this).attr('href','http://' + currIp +partUrl)
  });
});
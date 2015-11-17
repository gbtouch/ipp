var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var client = requestClient.createClient('http://'+config.goServer+':'+config.meetingPort);
var clientFile = requestClient.createClient('http://'+config.fileServer+':'+config.filePort);
var clientVote = requestClient.createClient('http://'+config.goServer+':'+config.votePort);

router.get('/', function(req, res, next) {
  var tab = req.query.tab;
  client.get('/v1/meeting', function(err, resp, meetings) {
    if (err) {
      logger.info("读取会议信息错误:"+err);
      return res.status(500).json({"error":"读取会议信息错误"});
    }
    if(meetings){
      meetings = meetings.sort(function(a,b){
        return a.starttime < b.starttime;
      });
    }
    client.get('/v1/current', function(err, resp, current) {
      if (err) {
        logger.info("错误" + err);
        return res.status(500).json({"error": err});
      }
      var m = JSON.stringify(current);
      res.render('meeting', {
        models: meetings || [],
        model: current || [],
        m: m,
        tab: tab,
        agendas: current.agenda || [],
        devices:[],
        user: req.session.user
      });
    });
  });
});

router.get('/id',function(req, res){
  res.json(uuid.v4())
});


module.exports = router;

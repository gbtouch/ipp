var express = require('express');
var router = express.Router();
var M = require('../models/meeting');
var formidable = require('../utils/formidableUpload');
var filesize = require('filesize');
var uuid = require('uuid');
var Member = require('../models/attendees');
var client = requestClient.createClient('http://'+config.goServer+':'+config.meetingPort);
var clientFile = requestClient.createClient('http://'+config.fileServer+':'+config.filePort);
var clientVote = requestClient.createClient('http://'+config.goServer+':'+config.votePort);
//var clientFile = requestClient.createClient('http://127.0.0.1:10020');

//router.all('*', checkLogin);

//function checkLogin(req, res, next) {
//  if (!req.session.user){
//    res.redirect('/login')
//  } else {
//    next();
//  }
//}

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
//      if(req.session.user.role == 'attendees'){
//        meetings = _.filter(meetings, function(item){
//          if (_.find(item.member, function(each){ return each.id == req.session.user.id;})){
//            return true;
//          }else{
//            return false;
//          }
//        })
//      }
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

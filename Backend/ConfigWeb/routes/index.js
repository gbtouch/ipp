var express = require('express');
var Model = require('../models/attendees');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.redirect('/meeting');
});

//router.get('/login', function(req, res, next) {
//  req.session.user = null;
//  res.render('login', {
//    error: req.flash('error').toString()
//  });
//});
//
//router.post('/login', function(req, res, next) {
//  Model.get("/v1/member", function(err, resp ,users) {
//    if (err) {
//      return res.json({code: 500, error: "获取用户数据失败"});
//    }
//    if(!users){
//      users = [];
//    }
//    var admin = {
//        name:"用户管理员",unit:"用户管理员",position:"用户管理员",account:"admin",password:"admin",role:"用户管理员"
//    };
//    users.push(admin);
//    var user = _.find(users, function (item) {
//      return item.account == req.body.name
//    });
//    if (!user) {
//      req.flash('error', '用户不存在！');
//      return res.redirect('/login');
//    }
//    if (!req.body.password) {
//      req.flash('error', '密码不能为空！');
//      return res.redirect('/login');
//    }
//    if (user.password != req.body.password) {
//      req.flash('error', '密码错误！');
//      return res.redirect('/login');
//    }
//    req.session.user = user;
//    if(user.name == "用户管理员"){
//      res.redirect('/attendees');
//    } else {
//      res.redirect('/meeting');
//    }
//  });
//});


module.exports = router;

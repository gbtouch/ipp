/**
 *
 * Created by Joan on 2015/5/19.
 */
var uuid = require('uuid');

global.result = [];

var model = {
  builder : function(d){
    var meeting = {};
    meeting.id = uuid.v4();
    meeting.name = d.name;
    //meeting.reporter = d.reporter;
    meeting.starttime = d.starttime;
    meeting.status = "waiting";
    meeting.agenda = [];
    meeting.source = [];
    meeting.member = [];
    result.push(meeting);
    return meeting.id;
  },

  modify : function(id, d){
    var m = this.getMeeting(id);
    m.name = d.name;
    m.starttime = d.starttime;
    this.replace(id, m);
    return m;
  },

  load : function(m){
    var exist = _.find(result,function(each){
      return each.id == m.id;
    });
    if(!exist) {
      result.push(m);
    }
    return result;
  },

  removeMeeting : function(id){
    result.forEach(function(item){
      if (item.id == id) {
        result.splice(result.indexOf(item),1)
      }
    });
    return result;
  },

  replace : function(id, m){
    result.forEach(function(item){
      if (item.id == id) {
        result.splice(result.indexOf(item),1,m);
      }
    });
  },

  insertAgenda : function(id, a) {
    var m = this.getMeeting(id);
    m.agenda.push(a);
    m.agenda.sort(function(first, second){
      return (new Date(first.starttime)).getTime() - (new Date(second.starttime)).getTime();
    });
    m.agenda = this.checkAgendaTime(m.agenda);
    this.replace(id, m);
    return result;
    //var m = this.getMeeting(id);
    //var current = a.index;
    //var currentIndex = a.index;
    //var agendas = m.agenda;
    //m.agenda = _.map(agendas,function(each){
    //  if (each.index == currentIndex) {
    //    currentIndex++;
    //    each.index++;
    //  }
    //  return each;
    //});
    //m.agenda.push(a);
    //m.agenda.sort(function(first, second){
    //  return first.index-second.index;
    //});
    //m = this.checkAgendaTime(m, current);
    //this.replace(id, m);
    //return result;
  },

  checkAgendaTime : function(a) {
    for(var i in a){
      a[i].index = parseInt(i)+1;
      if(a[i-1]){
        var preEnd = (new Date(a[i-1].endtime)).getTime();
        var currStart = (new Date(a[i].starttime)).getTime();
        var currEnd = (new Date(a[i].endtime)).getTime();
        if(currStart < preEnd){
          var time = preEnd - currStart;
          currStart = preEnd;
          currEnd += time;
          a[i].starttime = moment(new Date(currStart)).format("YYYY-MM-DD HH:mm");
          a[i].endtime = moment(new Date(currEnd)).format("YYYY-MM-DD HH:mm");
        }
      }
    }
    return a;
    //var currA = _.find(m.agenda, function(item){ return item.index == current});
    //var preA = _.max(_.filter(m.agenda, function(item){ return item.index < current}), function(each){return each.index});
    //var laterAll = _.filter(m.agenda, function(item){ return item.index > current});
    //var nextA = _.min(laterAll, function(each){return each.index});
    //if(preA){
    //  var currStart = new Date(currA.starttime);
    //  var preEnd = new Date(preA.endtime);
    //  if (currStart.getTime() < preEnd.getTime()){
    //    var time1 = preEnd.getTime() - currStart.getTime();
    //    currA.starttime = preA.endtime;
    //    var a = (new Date(currA.endtime)).getTime() + time1;
    //    var date= new Date();
    //    a =date.setTime((new Date(currA.endtime)).getTime()+time1);
    //    a = new Date(a);
    //    currA.endtime = moment(a).format("YYYY-MM-DD HH:mm");
    //  }
    //}
    //m.agenda = _.map(m.agenda,function(each){
    //  if (each.id == currA.id) {
    //    each = currA;
    //  }
    //  return each;
    //});
    //if(nextA){
    //  var currEnd = new Date(currA.endtime);
    //  var nextStart = new Date(nextA.starttime);
    //  if(currEnd.getTime() > nextStart.getTime()){
    //    var time2 = currEnd.getTime() - nextStart.getTime();
    //    for(var i in laterAll){
    //      var st = (new Date(laterAll[i].starttime)).getTime() + time2;
    //      st = new Date(st);
    //      laterAll[i].starttime = moment(st).format("YYYY-MM-DD HH:mm");
    //      var et = (new Date(laterAll[i].endtime)).getTime() + time2;
    //      et = new Date(et);
    //      laterAll[i].endtime = moment(et).format("YYYY-MM-DD HH:mm");
    //      _.map(m.agenda,function(each){
    //        if (each.id == laterAll[i].id) {
    //          each = laterAll[i];
    //        }
    //        return each;
    //      });
    //    }
    //  }
    //}
    //return m;
  },

  updateAgenda : function(id, agenda) {
    this.removeAgenda(id, agenda.id);
    return this.insertAgenda(id, agenda);
  },

  insertSource : function(id, s) {
    var m = this.getMeeting(id);
    m.source.push(s);
    this.replace(id, m);
    return result;
  },

  insertMember : function(id, mem) {
    var m = this.getMeeting(id);
    m.member.push(mem);
    this.replace(id, m);
    return result;
  },

  removeMember : function(mid, memid) {
    var m = this.getMeeting(mid);
    m.member.forEach(function(item){
      if (item.id == memid) {
        m.member.splice(m.member.indexOf(item),1);
      }
    });
    return m;
  },

  allocationSource : function(mid, aid, s) {
    var m = this.getMeeting(mid);
    var a = this.getAgendaById(mid, aid);
    s.forEach(function(item){
      if (!a.source) {
        a.source = [item];
      } else {
        a.source.push(item);
      }
    });
    m.agenda.forEach(function(item){
      if (item.id == aid) {
        m.agenda.splice(m.agenda.indexOf(item),1,a)
      }
    });
    this.replace(mid, m);
    return result;
  },

  cancelAllocation : function(mid, aid, s) {
    var m =this.getMeeting(mid);
    var a = this.getAgendaById(mid, aid);
    s.forEach(function(item){
      a.source = _.filter(a.source, function(id){ return id !== item; });
    });
    m.agenda.forEach(function(item){
      if (item.id == aid) {
        m.agenda.splice(m.agenda.indexOf(item),1,a)
      }
    });
    this.replace(mid, m);
    return result;
  },

  getMeeting : function (id) {
    return _.find(result, function (item) {
      return item.id == id;
    });
  },

  getAgendaById : function(mid, aid) {
    var m = this.getMeeting(mid);
    return _.find(m.agenda, function(item) {
      return item.id == aid;
    });
  },

  getSourceById : function(mid, sid) {
    var m = this.getMeeting(mid);
    return _.find(m.source, function(item) {
      return item.id == sid;
    });
  },

  getMemberById : function(mid, memid) {
    var m = this.getMeeting(mid);
    return _.find(m.member, function(item) {
      return item.id == memid;
    });
  },

  removeAgenda : function(mid, aid) {
    var m = this.getMeeting(mid);
    m.agenda.forEach(function(item){
      if (item.id == aid) {
        m.agenda.splice(m.agenda.indexOf(item),1);
      }
    });
    this.checkAgendaTime(m.agenda);
    return m;
    //var m = this.getMeeting(mid);
    //var agendas= m.agenda;
    //var current = _.find(agendas,function(each){return each.id==aid });
    //var currentIndex = current.index;
    //agendas = _.reject(agendas,function(each){
    //  return each.id == aid;
    //});
    //agendas = _.map(agendas,function(each){
    //  var i = each.index;
    //  if(each.index>currentIndex){
    //    each.index = i-1;
    //  }
    //  return each;
    //});
    //m.agenda = agendas;
    //this.replace(mid, m);
    //return result;
  },

  removeSource : function(mid, sid) {
    var m = this.getMeeting(mid);
    m.source.forEach(function(item){
      if (item.id == sid) {
        m.source.splice(m.source.indexOf(item),1)
      }
    });
    m.agenda.forEach(function(item){
      item.source.forEach(function(each) {
        if (each == sid) {
          item.source.splice(item.source.indexOf(each), 1)
        }
      })
    });
    this.replace(mid, m);
  },

  downloadSource:function(client,mid) {
    client.get('/v1/meeting/' + mid, function (err, resp, meeting) {
      if (err) {
        logger.info("下载资料读取会议信息错误:" + err);
        return res.status(500).json({"error": "下载资料读取会议信息错误"});
      }
      var filenames = _.map(meeting.source,function(item){
        return item.id+"."+item.extension;
      });
      for(var i in filenames){
        var sourcePath = "http://"+config.uploadServer+":"+config.uploadPort+"/"+config.nginxDownload+"/"+mid+"/"+filenames[i];
        var savePath = path.join(config.ftpPath, mid);
        try {
          helper.httpRequestFiles(sourcePath, savePath, filenames[i]);
        }catch(err){
          logger.error("下载资料报错："+err);
        }
      }
    });
  }

};

exports = module.exports = model;
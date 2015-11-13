var io = require('socket.io');

var socket = {
  bind: function (server) {
    global.serverSocket = io.listen(server, {log: false});
    serverSocket.on('connection', function (s) {
      logger.info(s.handshake.address+" CONNECT TO SERVER");
//    s.emit('response',{hello:'world'});
      s.on('progresschange', function (d) {
        var data = JSON.parse(d);
//      console.log data.progress,'==='
        global.serverSocket.sockets.emit('progressupdate', data);
      });
      s.on('disconnect', function () {
        logger.info(s.handshake.address+" DISCONNECT TO SERVER");
      });
    });
  },

  notify: function (event, data, action) {
    if (action) {
      data.action = action;
    }
    logger.info(util.format("socket通知事件 event:'%s' data:%s",event,JSON.stringify(data)));
    if(global.serverSocket.sockets) {
      global.serverSocket.sockets.emit(event, data);
    }
  },

  test: function (action, data) {
    data.event = action;
    serverSocket.sockets.emit('test', data);
  }
};

exports = module.exports = socket;
const static = require('node-static');
const http = require('http');
const bcrypt = require('bcrypt');

var file = new(static.Server)('./public');

var server = http.createServer(function (req, res) {
  file.serve(req, res);
})

var io = require('socket.io')(server);

server.listen(8080);

var passwordHash = '$2b$10$Z.k8FXVhVdEkyLq.hKOYeepN9YUwBmJ7qI7ofZMibMeYNwwC8bCle';

var currentState = null;
io.on('connection', function(socket) {
  var master = false;

  socket.on('authenticate', function(data){
    var ok = bcrypt.compare(data.plaintext, passwordHash, function(err, result) {
      master = result;
    });
  });

  if (currentState) {
    io.sockets.emit('change-state', {
      state: currentState
    });
  }
  socket.on('state-changed', function(data) {
    if (master) {
      currentState = data.state;
      io.sockets.emit('change-state', {
        state: data.state
      });
    }
  });
});

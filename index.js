var express = require('express')  
, app = express()
, server = require('http').createServer(app)
, io = require("socket.io").listen(server)
//app.set('port', process.env.PORT || 3000);  
//app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");  
//... code to continue

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/Sinnan', function(req, res){
  //res.end('Hi there!::'+__dirname);
  res.sendFile(__dirname + '/lobby/lobby.html');
});

io.on('connection', function(socket){
    console.log('Client connected');
    socket.broadcast.emit('chat message', 'Someone connected.');
    socket.emit('chat message', 'You are connected.');
    
    socket.on('disconnect', function(){
        console.log('Client disconnected');
        socket.broadcast.emit('chat message', 'Someone disconnected.');
        socket.emit('chat message', 'You disconnected.');
    });
    
    socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

server.listen(process.env.PORT || 3000, function(){
  console.log('listening');
});

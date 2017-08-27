var express = require('express')
        , app = express()
        , server = require('http').createServer(app)
        , io = require("socket.io").listen(server)

        
// usernames which are currently connected to the chat
var usernames = {};
var numberofusers=0;

app.use('/views', express.static(__dirname + '/views'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/login', function (req, res) {
    //login controllers go here
    //trust me it will make sense in a few days
    //it already makes sense nigga ~nitrox
});

app.get('/lobby', function (req, res) {
    //lobby controllers may check session before the reponse header is sent
    res.sendFile(__dirname + '/views/lobby.html');
});

app.get('/decks', function (req, res) {
    res.sendFile(__dirname + '/views/decks.html');
});

app.get('/stats', function (req, res) {
    res.sendFile(__dirname + '/views/stats.html');
});

app.get('/duel', function (req, res) {
    res.sendFile(__dirname + '/views/duel.html');
});

io.on('connection', function (socket) {
    
    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(username){
        // we store the username in the socket session for this client
        socket.username = username;
        // add the client's username to the global list
        usernames[username] = username;

        // update the list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
        console.log('Client connected');
        
        socket.broadcast.emit('chat message', {msg: socket.username+ " joined the chat", user:socket.username});
        //socket.emit('chat message', 'You are connected.');
    });

    

    socket.on('disconnect', function () {
        // remove the username from global usernames list
        socket.broadcast.emit('chat message', {msg: socket.username+ " left the chat", user:socket.username});
        delete usernames[socket.username];
        // update list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);

        console.log('Client disconnected');
        
        //socket.emit('chat message', 'You disconnected.');
    });
    

    socket.on('chat message', function (data) {
        io.emit('chat message', {msg: data, user:socket.username});
    });
});
server.listen(process.env.PORT || 3000, function () {
    console.log('listening');
});

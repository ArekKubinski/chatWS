const { Socket } = require('dgram');

var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

var users = new Map();


app.use(express.static(path.join( __dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    var id = socket.id;
    console.log(id);
    socket.broadcast.emit('server message', 'user connected');
    socket.on('disconnect', ()=> {
        socket.broadcast.emit('server message', 'user disconnected');
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message' , users.get(socket.id) + ': ' + msg);
      });
    socket.on('name', (msg) => {
        console.log(msg);
        users.set(socket.id, msg);
        console.log(users.size);
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000')
});
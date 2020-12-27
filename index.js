const { Socket, createSocket } = require('dgram');

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
    users.set(id, 'Anon');
    socket.broadcast.emit('server message', 'user connected');
    io.emit('nrusers', users.size);
    socket.on('disconnect', ()=> {
        socket.broadcast.emit('server message', users.get(id) + ' disconnected');
        users.delete(id);
        io.emit('nrusers', users.size);
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message' , users.get(id), ': ' + msg);
    });
    socket.on('name', (msg) => {
        users.set(socket.id, msg);
        socket.emit('server message', msg + ' connected');
        console.log(users.size);
        io.emit('nrusers', users.size);
        console.log(users.get(id))
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000')
});
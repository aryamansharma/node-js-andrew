const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const PORT = process.env.PORT || 3000;

const app = express();
// socketio expects a raw HTTP server, that is why we are creating it line below and passing it in the socketio method as an arguement.
const server = http.createServer(app);
const io = socketio(server);

// this 'on' method listens for an event, 1st arguement is the event so in the below case its 'connection event and it will be triggered whenver we get a new connection
// and 2nd argument is the callback which will run when the event is triggered.
// IMP - we will only use io.on in the below case that is when a user gets connected. at other times we will just use socket.on to deal with individual connection
// for completing a connection we also need to load client side of socket library
io.on('connection', (socket) => {
    console.log('New websocket connection');

    // by using below line we emit a custom event which the client can listen on to with the same name
    // socket.emit will emit event for that particular connection
    socket.emit('message', 'Welcome');

    // this broadcast will emit an event for all the connections excep the one triggering it
    socket.broadcast.emit('message', 'A new user has joined');

    // by using below line we listen a custom event which the client has emitted
    socket.on('sendMessage', (text) => {
        // io.emit will emit event for all the connections
        io.emit('message', text);
    });

    // this way we can run some code when the user gets disconnected
    socket.on('disconnect', () => {
        // here we are using io.emit because the user has already left and we can just all the remaning connections of his disconnection
        io.emit('message', 'A user has left')
    });
});

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static('public'));

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
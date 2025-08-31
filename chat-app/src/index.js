const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words'); // this is a package we can use to check for any bad words
const { generateMessageObj, generateLocationMessage } = require('./utils/messages');
const { addUser, getUsersInRoom, getuser, removeUser } = require('./utils/users');

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
    // socket.emit('message', generateMessageObj('Welcome'));

    // this broadcast will emit an event for all the connections excep the one triggering it
    // socket.broadcast.emit('message', generateMessageObj('A new user has joined'));

    socket.on('join', ({ username, room }, callback) => {
        // socket.id will give a unique id for each connection
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }

        socket.join(user.room); // this join method allows a user to join a specific room

        socket.emit('message', generateMessageObj('Admin', 'Welcome'));

        // below event using the to method will emit for the specific room passed as the parameter , so it will send the message to all the members of the room.
        // io.to(room).emit('message', generateMessageObj('Welcome'));

        // below event using the to method will emit for the specific room passed as the parameter , so it will send the message to all the members of the room except himeself
        socket.broadcast.to(user.room).emit('message', generateMessageObj('Admin', `${user.username} has joined!`));

        callback();
    });

    // by using below line we listen a custom event which the client has emitted
    socket.on('sendMessage', (text, callback) => {
        const filter = new Filter();
        if (filter.isProfane(text) && typeof callback === 'function') {
            // this callback parameter is used to send acknowledgment to the sender, basically when we call this callback, it will run the 3rd arguement 
            // of the emitter
            return callback('No bad words are allowed');
        }
        // io.emit will emit event for all the connections
        const user = getuser(socket.id);
        io.to(user.room).emit('message', generateMessageObj(user.username, text));
        if (typeof callback === 'function') callback();
    });

    socket.on('sendLocation', (coords, callback) => {
        const user = getuser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    });

    // this way we can run some code when the user gets disconnected
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessageObj('Admin', `${user.username} has left`));
        }

        // here we are using io.emit because the user has already left and we can just all the remaning connections of his disconnection
        // io.emit('message', generateMessageObj('A user has left'));
    });
});

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static('public'));

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
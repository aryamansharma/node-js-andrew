const socket = io();

const inputField = document.querySelector('#inputField');
const sendBtn = document.querySelector('#sendBtn');

sendBtn.addEventListener('click', (event) => {
    event.preventDefault();

    // by using below line we emit a custom event which the server can listen on to with the same name
    socket.emit('sendMessage', inputField.value);
});

// by using below line we listen a custom event which the server has emitted
socket.on('message', (message) => {
    console.log(message);
});
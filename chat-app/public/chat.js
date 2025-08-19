const socket = io();

const inputField = document.querySelector('#inputField');
const sendBtn = document.querySelector('#sendBtn');
const sendLocationBtn = document.querySelector('#send-location');

sendBtn.addEventListener('click', (event) => {
    event.preventDefault();

    // by using below line we emit a custom event which the server can listen on to with the same name
    socket.emit('sendMessage', inputField.value);
});

sendLocationBtn.addEventListener('click', (e) => {

    // this navigiator.geolocation is an api which we can use to fetch the users location
    // in below line we are checking if the users browser supports for the navigator.geolocation browser, if not we are sending an alert.
    if (!navigator.geolocation) {
        return alert('Your browser does not support geolcation');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        socket.emit('sendLocation', { latitude, longitude });
    });
});

// by using below line we listen a custom event which the server has emitted
socket.on('message', (message) => {
    console.log(message);
});
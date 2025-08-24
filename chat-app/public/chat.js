const socket = io();

const inputField = document.querySelector('#inputField');
const sendBtn = document.querySelector('#sendBtn');
const sendLocationBtn = document.querySelector('#send-location');

sendBtn.addEventListener('click', (event) => {
    event.preventDefault();

    inputField.setAttribute('disabled', 'disabled');
    sendBtn.setAttribute('disabled', 'disabled');

    // by using below line we emit a custom event which the server can listen on to with the same name
    // 3rd arguement is the callback which will run when the server makes the acknowledgement of the event
    socket.emit('sendMessage', inputField.value, (err) => {
        inputField.removeAttribute('disabled');
        sendBtn.removeAttribute('disabled');
        inputField.value = '';
        inputField.focus();
        if (err) {
            return console.log(err);
        }
        console.log('Message delivered');
    });
});

sendLocationBtn.addEventListener('click', (e) => {

    // this navigiator.geolocation is an api which we can use to fetch the users location
    // in below line we are checking if the users browser supports for the navigator.geolocation browser, if not we are sending an alert.
    if (!navigator.geolocation) {
        return alert('Your browser does not support geolcation');
    }

    sendLocationBtn.setAttribute('disabled', 'disabled');

    // this 'getCurrentPosition' method performs an asynchronous operation
    navigator.geolocation.getCurrentPosition((position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        socket.emit('sendLocation', { latitude, longitude }, () => {
            sendLocationBtn.removeAttribute('disabled');
            console.log('Location shared');
        });
    });
});

// by using below line we listen a custom event which the server has emitted
socket.on('message', (message) => {
    console.log(message);
});
const socket = io();

// Elements
const inputField = document.querySelector('#inputField');
const sendBtn = document.querySelector('#sendBtn');
const sendLocationBtn = document.querySelector('#send-location');
const $message = document.querySelector('#message');

// Templates
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $locationMessageTemplate = document.querySelector('#location-msg-template').innerHTML;

// Options
// this QA is a library for parsing the query string from the URL into an object
// query string is available in 'location.search'
// this 'ignoreQueryPrefix' removes the '?' from the query string
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

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

    // setting the message in the template , 2nd option is object in which key will be keys we are using in the html, and their values will be the value we want to insert
    const html = Mustache.render($messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $message.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (urlObj) => {
    console.log(urlObj)
    const html = Mustache.render($locationMessageTemplate, {
        url: urlObj.url,
        createdAt: moment(urlObj.createdAt).format('h:mm a')
    });
    $message.insertAdjacentHTML('beforeend', html);
});

// sending event for joining a room
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});
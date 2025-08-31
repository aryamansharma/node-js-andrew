const users = [];

const addUser = ({ id, username, room }) => {

    // checking if we are getting username or room name
    if (!username || !room) {
        return {
            error: 'Username and Room name required!'
        }
    }

    // cleaning the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // checking for an existing user in a room
    const isExisting = users.find((user) => {
        return user.username === username && user.room === room;
    });

    if (isExisting) {
        return {
            error: 'Username is in use!'
        }
    }

    const user = { id, username, room };
    users.push(user);
    return { user }
}

const getuser = id => {
    return users.find(user => user.id === id);
}

const getUsersInRoom = room => {
    return users.filter(user => user.room === room);
}

const removeUser = id => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    return
}

module.exports = {
    addUser,
    removeUser,
    getuser,
    getUsersInRoom
}
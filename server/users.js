const {
    LRU
} = require("./utils")

// Mock DB
const typingLRU = new LRU();
const users = [];

const getUsers = () => users;

const addUser = ({
    id,
    name,
    room
}) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find(user => user.name === name && user.room === room);

    if (existingUser) {
        return {
            error: 'Username is taken for this room'
        };
    }

    const user = {
        id,
        name,
        room
    };

    users.push(user);

    return {
        user
    };
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => users.find(user => user.id == id);

const getUsersInRoom = (room) => users.filter(user => user.room == room).map(user => user.name);

const setTyping = (user) => {
    typingLRU.write(user.id, user);
}

const removeTyping = (id) => {
    typingLRU.remove(id);
}

const getTyping = () => {
    const mostRecent = typingLRU.peek();
    return mostRecent && mostRecent.value;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    setTyping,
    removeTyping,
    getTyping,
    getUsers
}
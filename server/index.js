const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    removeTyping,
    setTyping,
    getTyping,
    getUsers
} = require('./users');

app.use(router);

io.on('connection', (socket) => {
    console.log(`New Connection!!! SocketId: ${socket.id}`)

    socket.on('join', ({
        name,
        room
    }, callback) => {
        const {
            error,
            user
        } = addUser({
            id: socket.id,
            name,
            room
        });

        if (error) return callback(error);

        socket.join(user.room);

        socket.emit('message', {
            user: 'admin',
            text: `${user.name}, welcome to room ${user.room}!`
        });

        socket.broadcast.to(user.room).emit('message', {
            user: 'admin',
            text: `${user.name}, has entered the room.`
        })

        io.to(user.room).emit('chat-users', getUsersInRoom(user.room))
    })

    socket.on("delete-typing", () => {
        const user = getUser(socket.id);

        if (user) {
            removeTyping(socket.id);
            const mostRecentUserTyping = getTyping();

            io.to(user.room).emit('chat-typing', mostRecentUserTyping)
        }
    })

    socket.on('send-message', (message, callback) => {
        const user = getUser(socket.id);
        removeTyping(socket.id);
        const mostRecentUserTyping = getTyping();

        if (user) {
            io.to(user.room).emit('chat-typing', mostRecentUserTyping)

            io.to(user.room).emit('message', {
                user: user.name,
                text: message
            })
        }
    })

    socket.on('new-user-typing', () => {
        const user = getUser(socket.id);

        if (user) {
            setTyping(user);

            io.to(user.room).emit('chat-typing', user)
        }
    })

    socket.on('disconnect', () => {
        console.log("Client Left...")

        const user = removeUser(socket.id);
        removeTyping(socket.id);
        const mostRecentUserTyping = getTyping();


        if (user) {
            io.to(user.room).emit('chat-typing', mostRecentUserTyping);
            io.to(user.room).emit('message', {
                user: 'admin',
                text: `${user.name}, has left.`
            });
            io.to(user.room).emit('chat-users', getUsersInRoom(user.room))
        }
    })
})

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))
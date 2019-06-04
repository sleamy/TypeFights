const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const http = require('http')
const socketIO = require('socket.io')

const users = require('./routes/api/users')

const Room = require('./game/room')
const Player = require('./game/player')

const app = express()
const server = http.Server(app)
const io = socketIO(server)

const PORT = process.env.PORT || 5000

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(passport.initialize())

// Passport Config
require('./config/passport')(passport);

app.use('/api/users', users)

app.get('/', (req, res) => {
    res.send('Hello')
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

let rooms = {}
let roomCount = 1

let room = new Room('Genesis')
rooms[room.id] = room

io.on('connection', (socket) => {

    console.log('User connected: ' + socket.id)

    socket.on('playerConnected', (user) => {
        console.log(user)

        let player = new Player(socket.id, room.id, user)
        socket.join(room.id)
        room.players.push(player)

        if(room.players.length == 2) {
            console.log(room.id + " is filled with players: " + room.players)
            io.in(room.id).emit('allConnected', {room: rooms[room.id], players: rooms[room.id].player})

            room = new Room('Room_' + roomCount++);
            rooms[room.id] = room
        }
    })

    socket.on('test', () => console.log('Message recieved'))

    socket.on('disconnect', () => console.log('User disconnected'))
})
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const http = require('http')
const socketIO = require('socket.io')
const User = require('./db/user')

const users = require('./routes/api/users')

const Elo = require('./game/elo')
const Room = require('./game/room')
const Player = require('./game/player')
const Guest = require('./game/guest')

const wordsHelper = require('./game/helper')

const app = express()
const server = http.Server(app)
const io = socketIO(server)

const PORT = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }))
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
let rRooms = {}
let roomCount = 1
let rRoomCount = 1

let room = new Room('Genesis')
rooms[room.id] = room
let rRoom = new Room('R_Genesis')
rRooms[rRoom.id] = rRoom;


io.on('connection', (socket) => {

    socket.on('playerConnected', (user) => { 

        if (user === 'Guest') {
            
            let player = new Player(socket.id, room.id, Guest)

            socket.join(room.id)
            room.players.push(player)

                if (room.players.length == 2) {

                    io.in(room.id).emit('allConnected', { room: rooms[room.id], players: rooms[room.id].players })

                    room = new Room('Room_' + roomCount++);
                    rooms[room.id] = room
                }

        } else {
            let connectedUser = user;

            User.getUserStats(user.email, (stats) => {

                connectedUser.rating = stats.rating
                connectedUser.fights = stats.fights
                connectedUser.wins = stats.wins
                connectedUser.lossess = stats.losses

                let player = new Player(socket.id, room.id, connectedUser)

                socket.join(room.id)
                room.players.push(player)

                if (room.players.length == 2) {

                    io.in(room.id).emit('allConnected', { room: rooms[room.id], players: rooms[room.id].players })

                    room = new Room('Room_' + roomCount++);
                    rooms[room.id] = room
                }

            })
        }
         
    })

    socket.on('playerConnected_ranked', (user) => {

        let connectedUser = user;

        User.getUserStats(user.email, (stats) => {

            connectedUser.rating = stats.rating
            connectedUser.fights = stats.fights
            connectedUser.wins = stats.wins
            connectedUser.lossess = stats.losses

            let player = new Player(socket.id, rRoom.id, connectedUser)

            socket.join(rRoom.id)
            rRoom.players.push(player)

            if (rRoom.players.length == 2) {

                io.in(rRoom.id).emit('allConnected', { room: rRooms[rRoom.id], players: rRooms[rRoom.id].players })

                rRoom = new Room('Room_' + rRoomCount++);
                rRooms[rRoom.id] = rRoom
            }

        })
    })

    socket.on('rematch', data => {

        let id = data.room.id
        let playerNumber = data.playerNumber

        socket.to(data.room.id).emit('opponentRematch')

        rooms[id].rematch[playerNumber] = !rooms[id].rematch[playerNumber]

        if (rooms[id].rematch[0] && rooms[id].rematch[1]) {
            // Reset room
            rooms[id].health = 0
            rooms[id].ended = false
            rooms[id].winner = -1
            rooms[id].words = wordsHelper.getWords(400)
            rooms[id].rematch = [false, false]
            io.in(id).emit('rematch', rooms[id])
        }
    })

    socket.on('rematch_ranked', data => {

        let id = data.room.id
        let playerNumber = data.playerNumber

        socket.to(data.room.id).emit('opponentRematch')

        rRooms[id].rematch[playerNumber] = !rRooms[id].rematch[playerNumber]

        if (rRooms[id].rematch[0] && rRooms[id].rematch[1]) {
            // Reset room
            rRooms[id].health = 0
            rRooms[id].ended = false
            rRooms[id].winner = -1
            rRooms[id].words = wordsHelper.getWords(400)
            rRooms[id].rematch = [false, false]
            io.in(id).emit('rematch', rRooms[id])
        }
    })

    socket.on('wordTyped', data => {

        if (data.typed === data.wordToType) {

            if (data.playerId === rooms[data.roomName].players[0].id) {
                // Player 1
                rooms[data.roomName].health += data.wordToType.length
                //rooms[data.roomName].health += 50
                if (rooms[data.roomName].health >= 50) {
                    rooms[data.roomName].health = 50
                    rooms[data.roomName].ended = true
                    rooms[data.roomName].winner = 0
                }

            } else {
                // Player 2
                rooms[data.roomName].health -= data.wordToType.length
                //rooms[data.roomName].health -= 50
                if (rooms[data.roomName].health <= -50) {
                    rooms[data.roomName].health = -50
                    rooms[data.roomName].ended = true
                    rooms[data.roomName].winner = 1
                }
            }

            // Game has ended
            if (rooms[data.roomName].ended) {

            }

            io.in(data.roomName).emit('updateRoom', { room: rooms[data.roomName] })
        }
    })

    socket.on('wordTyped_ranked', data => {

        if (data.typed === data.wordToType) {

            if (data.playerId === rRooms[data.roomName].players[0].id) {
                // Player 1
                rRooms[data.roomName].health += data.wordToType.length
                //rRooms[data.roomName].health += 50
                if (rRooms[data.roomName].health >= 50) {
                    rRooms[data.roomName].health = 50
                    rRooms[data.roomName].ended = true
                    rRooms[data.roomName].winner = 0
                }

            } else {
                // Player 2
                rRooms[data.roomName].health -= data.wordToType.length
                //rRooms[data.roomName].health -= 50
                if (rRooms[data.roomName].health <= -50) {
                    rRooms[data.roomName].health = -50
                    rRooms[data.roomName].ended = true
                    rRooms[data.roomName].winner = 1
                }
            }

            // Game has ended
            if (rRooms[data.roomName].ended) {
                let winner, loser;

                if (rRooms[data.roomName].winner == 0) {
                    winner = rRooms[data.roomName].players[0].user
                    loser = rRooms[data.roomName].players[1].user
                } else {
                    winner = rRooms[data.roomName].players[1].user
                    loser = rRooms[data.roomName].players[0].user
                }

                if (rRooms[data.roomName].ranked = true) {

                    // TODO: Update elo
                    let winnerElo = Elo.getNewRating(winner.rating, loser.rating, 1)
                    let loserElo = Elo.getNewRating(loser.rating, winner.rating, 0)

                    // TODO: Show how much rating each player lost
                    if (rRooms[data.roomName].winner == 0) {
                        rRooms[data.roomName].players[0].recentElo = winnerElo - rRooms[data.roomName].players[0].user.rating;
                        rRooms[data.roomName].players[1].recentElo = loserElo - rRooms[data.roomName].players[1].user.rating;
                        rRooms[data.roomName].players[0].user.rating = winnerElo
                        rRooms[data.roomName].players[1].user.rating = loserElo
                    } else {
                        rRooms[data.roomName].players[1].recentElo = winnerElo - rRooms[data.roomName].players[1].user.rating;
                        rRooms[data.roomName].players[0].recentElo = loserElo - rRooms[data.roomName].players[0].user.rating;
                        rRooms[data.roomName].players[1].user.rating = winnerElo
                        rRooms[data.roomName].players[0].user.rating = loserElo
                    }

                    User.updateStats(winner.email, winnerElo, winner.fights + 1, winner.wins + 1, winner.losses)
                    User.updateStats(loser.email, loserElo, loser.fights + 1, loser.wins, loser.losses + 1)
                }
            }

            io.in(data.roomName).emit('updateRoom_ranked', { room: rRooms[data.roomName] })
        }
    })

    socket.on('disconnect', () => {
        // Nothing yet
    })
})
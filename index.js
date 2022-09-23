// imports
const http = require('http')
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { Server } = require('socket.io')


// constants
dotenv.config()
const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())

const server = http.createServer(app)


// sockets
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})
io.on('connect', socket => {
    // console.log(`User connected: ${socket.id}`)

    socket.on('join_room', data => {
        socket.join(data)
        console.log(`User with ID ${socket.id} joined room ${data}`)
    })

    socket.on('send_message', data => {
        socket.to(data.room).emit('recieve_message', data)
    })

    socket.on('disconnect', () => {
        // console.log(`User disconnected: ${socket.id}`)
    })
})


// servers
server.listen(PORT, () => console.log(`${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} | [SERVER] Listening at ${PORT}`))
app.get('/', (req, res) => res.end(`${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} | [SERVER] Listening at ${PORT}`))

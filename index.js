// imports
const http = require('http')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')


// constants
const PORT = 4000
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


// server
server.listen(PORT, () => console.log(`Server started at ${PORT}`))
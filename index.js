const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
// const {v4: uuidV4} = require('uuid')

app.use(express.static(path.join(__dirname, 'public')));

// const listIdPeer = [];

io.on("connection", (socket) => {
    console.log('have some one connected')
    socket.on('createRoomAndUser', function (data) {
        socket.join(data.room)
        socket.room = data.room
        socket.name = data.userName
        socket.idPeer = data.idPeer
        // listIdPeer.push(data.idPeer)
        // socket.emit('sendListUser', listUser)
        socket.emit("serverSendInfoRoom", data.room)
        socket.to(data.room).emit("sendIdPeer", data.idPeer)
        console.log(socket.idPeer)
    })

    


    socket.on("sendChat", function (data) {
        io.sockets.in(socket.room).emit("sendChatFromServer", { user: socket.name, msg: data })
    })




});


app.get('/', (req, res) => {
    // res.redirect(`/${uuidV4(10)}`)
})

const port = 5555

http.listen(port, err => {
    if (err) {
        console.log("ERROR: " + err)
    } else {
        console.log('open server with port: ' + port)
    }
})


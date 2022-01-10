var app = require('express')();
var http = require('http').createServer(app);
const path = require('path');

const cors = require('cors')

app.use(cors())
var io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./display.html"))
})

io.on('connection', (socket) => {

    socket.on("join-message", (roomId) => {
        socket.join(roomId);
        console.log("User joined in a room : " + roomId);
    })

    socket.on("screen-data", function (data) {
        data = JSON.parse(data);
        var room = data.room;
        var imgStr = data.image;
        socket.broadcast.to(room).emit('screen-data', imgStr);
    })
})

var server_port = process.env.PORT || 5000;
http.listen(server_port, () => {
    console.log("Started on : " + server_port);
})
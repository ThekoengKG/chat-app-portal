var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Chat = require('./models/chatModels');
var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.connect('mongodb://localhost:27017/chatappdb',
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {console.log("You are connected to Database")})
    .catch((error) => {console.log(error)});



//Socket
let socketConnected = new Set();
var users = 0;

io.on('connection', (socket) => {
    console.log("Socket is connected");
   


    socketConnected.add(socket.id);

    io.emit('users-connected', socketConnected.size);

    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id)
        socketConnected.delete(socket.id);
        io.emit('users-connected', socketConnected.size);
    });


});


//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname));

//Posting chats to DB
app.post('/chats', (req,res) => {
    console.log(req.body);
    Chat.create(req.body, (err) => {
        if(err) throw err;
        io.emit('chat', req.body);
        console.log("Chat saved successfully");
    })
});

//Getting chats from DB
app.get('/chats', (req,res) => {
    Chat.find((err, chats) => {
        if(err) throw err;
        res.send(chats);
    })
})




http.listen(3000, () => {
    console.log("Server is running at port 3000!");
})
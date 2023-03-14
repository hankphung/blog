const { createServer } = require("http");
const Server = require("socket.io");
const express = require("express");
// const httpServer = new createServer();

const app = express();
const httpServer = createServer(app);
const io = Server(httpServer,{
  cors: {
    origin: process.env.CORS,
    // methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    // credentials: true
  }
});

app.use(express.static(__dirname + "/public"));

app.get('/',function(req,res){
  res.redirect('host.html');
});

console.log("accept: ", process.env.CORS)

io.on('connection', socket => {
  console.log('A user connected');

  socket.on('join', room => {
    console.log(`User joined room ${room}`);
    socket.join(room);
  });

  socket.on('offer', (data, room) => {
    console.log(`Received offer from client in room ${room}`);
    socket.to(room).emit('offer', data);
  });

  socket.on('answer', (data, room) => {
    console.log(`Received answer from client in room ${room}`);
    socket.to(room).emit('answer', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

httpServer.listen(3000);
console.log('listening to 3000')
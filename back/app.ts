import express from 'express'
import path from 'path'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "localhost",
    methods: ["GET", "POST"]
  }
});

app.use('/api/field-datas', express.static('../assets/field-datas'));
app.use(express.static('../front/'));

io.on('connection', (socket) => {
  console.log('socket.io connected.');

  socket.on('AgentAction', (actionData) => {
    socket.broadcast.emit('AgentAction', actionData);
  });

  socket.on('disconnect', () => {
    console.log('A player disconnected');
  });
});

app.listen(3000, () => {
  console.log('procon2023 game is running on port 3000!');
})
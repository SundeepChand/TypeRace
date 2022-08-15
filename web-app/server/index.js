const express = require('express')
const { createServer } = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

const app = express()

const corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.static('../client/dist'))

let curPlayerCount = 0
let curRoomId = uuidv4()

app.get('/api/get-room', (req, res) => {
  if (curPlayerCount === 0) {
    curPlayerCount++;
    return res.json({
      roomId: curRoomId,
      name: 'player-1',
    })
  }
  const payload = {
    roomId: curRoomId,
    name: 'player-2',
  }
  curPlayerCount--;
  curRoomId = uuidv4();
  res.json(payload)
})

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
})

io.on('connection', (socket) => {
  console.log('Client connected')
  socket.on('join-room', (data) => {
    const roomId = data.roomId
    io.emit(`joined-room-${roomId}`, data)

    socket.on(`room-${roomId}-player-moved`, (data) => {
      io.emit(`room-${roomId}-player-moved`, data)
    })
  })
})

httpServer.listen(process.env.PORT || 3001)

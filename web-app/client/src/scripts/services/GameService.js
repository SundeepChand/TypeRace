import axios from 'axios'
import { SERVER_URL } from '../constants'
import { io } from 'socket.io-client'

class GameService {
  socket = io(SERVER_URL)

  constructor(gameView) {
    this.gameView = gameView
  }

  joinNewRoom = async () => {
    const response = await axios.get(`${SERVER_URL}/api/get-room`)
    // console.log(response.data)
    this.playerId = response.data.name
    this.roomId = response.data.roomId


    this.socket.emit(`join-room`, response.data)
    this.initSockets()

    return {
      playerId: this.playerId,
      roomId: this.roomId
    }
  }

  initSockets = () => {
    this.socket.on(`joined-room-${this.roomId}`, (data) => {
      if (data.name !== this.playerId) {
        if (this.playerId === 'player-1') {
          this.gameView.createOpponentCar("ferrari", -0.5)
        } else if (this.playerId === 'player-2') {
          this.gameView.createOpponentCar("lamborghini", 0.5)
        }
      }
    })

    this.socket.on(`room-${this.roomId}-player-moved`, (data) => {
      if (this.playerId !== data.name) {
        this.gameView.other.moveForward()
      }
    })
  }

  emitPlayerMoved = () => {
    this.socket.emit(`room-${this.roomId}-player-moved`, {
      name: this.playerId,
    })
  }
}

export default GameService

import GameView from './views/GameView/GameView'
import DOMView from './views/DOMView/DOMView'
import GameService from './services/GameService'

class GameController {
  constructor() {
    this.gameView = new GameView()
    this.domView = new DOMView()
    this.gameService = new GameService(this.gameView)


    this.registerEventListeners()

    this.gameView.run()
  }

  registerEventListeners = () => {
    window.addEventListener('keydown', this.handleUserTyped)
    document.querySelector('#btn-start').addEventListener('click', this.startGame)
  }

  handleUserTyped = (event) => {
    if (this.domView.textArea.isCorrectKeyPressed(event.key)) {
      this.domView.textArea.handleCorrectKeyPressed(event.key)
      this.gameView.player.moveForward()
      this.gameService.emitPlayerMoved()
    }
  }

  startGame = async () => {
    const { playerId } = await this.gameService.joinNewRoom()

    if (playerId === 'player-1') {
      this.gameView.createPlayerCar("lamborghini", 0.5)
    } else if (playerId === 'player-2') {
      this.gameView.createPlayerCar("ferrari", -0.5)
    }
    if (playerId === 'player-2') {
      this.gameView.createOpponentCar("lamborghini", 0.5)
    }

    document.querySelector('#btn-start').style.display = 'none' // TODO: Improve this part
  }
}

new GameController()

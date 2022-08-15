import GameView from './views/GameView/GameView'
import DOMView from './views/DOMView/DOMView'
import GameService from './services/GameService'
import Model from './models/models'

class GameController {
  constructor() {
    this.gameView = new GameView()
    this.domView = new DOMView()
    this.gameService = new GameService(this.gameView)
    this.dataStore = new Model()

    this.registerEventListeners()

    this.gameView.run()
  }

  registerEventListeners = () => {
    document.querySelector('#btn-start').addEventListener('click', this.startGame)
    document.querySelector('#btn-restart').addEventListener('click', this.resetGame)
  }

  isOnlyASingleCharacter = (char) => {
    return char.length === 1
  }

  handleUserTyped = (event) => {
    if (this.isOnlyASingleCharacter(event.key)) {
      if (this.domView.textArea.isCorrectKeyPressed(event.key)) {
        this.domView.textArea.handleCorrectKeyPressed(event.key)
        this.gameView.player.moveForward()
        this.gameService.emitPlayerMoved()
        this.dataStore.typingMetrics.incrementCorrectCharactersTyped()
      }
      this.dataStore.typingMetrics.incrementTotalCharactersTyped()
    }
  }

  startRecordingUserTypingSpeed = () => {
    this.dataStore.typingMetrics.startRecordingUserTypingSpeed()
    window.addEventListener('keydown', this.handleUserTyped)
  }

  stopRecordingUserTypingSpeed = () => {
    this.dataStore.typingMetrics.stopRecordingUserTypingSpeed()
    window.removeEventListener('keydown', this.handleUserTyped)
  }

  handleGameOver = () => {
    this.stopRecordingUserTypingSpeed()
    this.domView.textArea.hide()
    this.domView.gameOverMenu.plotTypingMetricsChartWithData(
      this.dataStore.typingMetrics.formatMetricsIntoArray()
    )
    this.domView.gameOverMenu.show()
  }

  startRacing = () => {
    this.domView.waitingForOpponentText.hide()
    this.domView.textArea.show()
    this.startRecordingUserTypingSpeed()
  }

  onPlayerJoined = (player, curPlayerId) => {
    if (player.name !== curPlayerId) {
      if (curPlayerId === 'player-1') {
        this.gameView.createOpponentCar("ferrari", -0.5)
      } else if (curPlayerId === 'player-2') {
        this.gameView.createOpponentCar("lamborghini", 0.5)
      }
      this.startRacing()
    }
  }

  startGame = async () => {
    const { playerId } = await this.gameService.joinNewRoom()
    this.gameService.onPlayerJoined(this.onPlayerJoined)

    if (playerId === 'player-1') {
      this.gameView.createPlayerCar("lamborghini", 0.5)
      this.domView.waitingForOpponentText.show()
    } else if (playerId === 'player-2') {
      this.gameView.createPlayerCar("ferrari", -0.5)
    }
    if (playerId === 'player-2') {
      this.gameView.createOpponentCar("lamborghini", 0.5)
      this.startRacing()
    }

    this.domView.startMenu.hide()
    this.gameView.addPlayerReachedFinishLineCallback(this.handleGameOver)
  }

  resetGame = () => {
    this.gameView.reset()
    this.dataStore.resetTypingMetrics()
    this.domView.resetTextArea()
    this.domView.gameOverMenu.hide()
    this.domView.startMenu.show()
  }
}

new GameController()

import GameView from './views/GameView/GameView'
import DOMView from './views/DOMView/DOMView'

class GameController {
  constructor() {
    this.gameView = new GameView()
    this.domView = new DOMView()

    this.registerEventListeners()

    this.gameView.run()
  }

  registerEventListeners = () => {
    window.addEventListener('keydown', this.handleUserTyped)
  }

  handleUserTyped = (event) => {
    if (this.domView.textArea.isCorrectKeyPressed(event.key)) {
      this.domView.textArea.handleCorrectKeyPressed(event.key)
      this.gameView.car2.moveForward()
    }
  }
}

new GameController()

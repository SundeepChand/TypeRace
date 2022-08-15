import Chart from 'chart.js/auto'

class TextArea {
  punctuations = ['.', ',', '-', ';', ':', '?', '/', '>', '<', '\'', '"']
  typedText = ''

  constructor() {
    this.untypedText = this.getText()
    this.root = document.querySelector('#typing-text-area')
    this.typedDom = document.querySelector('#typed')
    this.untypedDom = document.querySelector('#untyped')

    this.init()
  }

  init = () => {
    this.updateTextInDOM()
    console.log(this.root.style.display)
    this.hide()
  }

  show = () => {
    this.root.style.display = ''
  }

  hide = () => {
    this.root.style.display = 'none'
  }

  updateTextInDOM = () => {
    this.typedDom.innerHTML = this.untypedDom.innerHTML = ''
    this.typedDom.style.padding = this.untypedDom.style.padding = '0px'

    const paddingSize = '6.5px'

    this.typedDom.innerHTML = this.typedText
    if (this.typedText.endsWith(' ')) {
      this.typedDom.style.paddingRight = paddingSize
    }
    if (this.untypedText.startsWith(' ')) {
      this.untypedDom.style.paddingLeft = paddingSize
    }
    this.untypedDom.innerHTML += this.untypedText
  }

  isCorrectKeyPressed = (key) => {
    return key === this.untypedText[0]
  }

  handleCorrectKeyPressed = (key) => {
    this.typedText += key
    if (this.punctuations.indexOf(key) !== -1) {
      this.typedText += '&lrm;'
    }
    this.untypedText = this.untypedText.substring(1)
    this.updateTextInDOM()
  }

  getText = () => {
    return `A Python dictionary with Redis as the storage back-end. Redis is a great database for all kinds of environments; from simple to complex. redis-dict tries to make using Redis as simple as using a dictionary. redis-dict stores data in Redis with key-values, this is according to Redis best practices. This also allows other non-Python programs to access the data stored in Redis.`
    // return 'A Python dictionary with Redis as the storage back-end.'
  }
}

class WaitingText {
  constructor() {
    this.root = document.querySelector('#waiting-text')
    this.hide()
  }

  hide = () => {
    this.root.style.display = 'none'
  }

  show = () => {
    this.root.style.display = ''
  }
}

class StartMenu {
  constructor() {
    this.root = document.querySelector('#start-menu')
  }

  hide = () => {
    this.root.style.display = 'none'
  }

  show = () => {
    this.root.style.display = ''
  }
}

class GameOverMenu {
  chartConfig = {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Words Per Minute (WPM)',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [],
      }, {
        label: 'Accuracy',
        backgroundColor: 'rgb(66, 135, 245)',
        borderColor: 'rgb(66, 135, 245)',
        data: [],
      }]
    },
    options: {}
  }

  constructor() {
    this.root = document.querySelector('#game-over-menu')
    this.typingMetricsPlot = document.querySelector('#typing-speed-chart')
    this.chart = new Chart(this.typingMetricsPlot, this.chartConfig)
    this.hide()
  }

  hide = () => {
    this.root.style.display = 'none'
  }

  show = () => {
    this.root.style.display = ''
  }

  plotTypingMetricsChartWithData = (data) => {
    this.chartConfig.data.labels = data.timestamps
    this.chartConfig.data.datasets[0].data = data.wpm
    this.chartConfig.data.datasets[1].data = data.accuracy
    this.chart.update()
  }
}

class DOMView {
  constructor() {
    this.textArea = new TextArea()
    this.waitingForOpponentText = new WaitingText()
    this.startMenu = new StartMenu()
    this.gameOverMenu = new GameOverMenu()
  }
}

export default DOMView

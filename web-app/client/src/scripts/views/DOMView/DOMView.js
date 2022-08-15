import Chart from 'chart.js/auto'
import TextArea from './TextArea'

Chart.defaults.font.size = 18
Chart.defaults.font.weight = 500

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
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Your Typing Speed and Accuracy',
          position: 'top',
          align: 'center',
          color: 'black',
        }
      }
    }
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

  resetTextArea = () => {
    this.textArea = new TextArea()
  }
}

export default DOMView

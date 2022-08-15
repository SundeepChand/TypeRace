class TypingMetricsDataPoint {
  constructor(timeElapsedInSeconds, wpm, accuracy) {
    this.timeElapsedInSeconds = timeElapsedInSeconds
    this.wpm = wpm
    this.accuracy = accuracy
  }
}

class TypingMetricsModel {
  timeElapsedInSeconds = 0
  totalCharactersTyped = 0
  correctCharactersTyped = 0
  userTypingSpeed = []

  startRecordingUserTypingSpeed = () => {
    this.recordingInterval = setInterval(() => {

      this.timeElapsedInSeconds += 2
      this.userTypingSpeed.push(new TypingMetricsDataPoint(
        this.timeElapsedInSeconds,
        this.getWordsPerMinute(),
        this.getUserTypingAccuracyPercentage(),
      ))
    }, 2000)
  }

  stopRecordingUserTypingSpeed = () => {
    clearInterval(this.recordingInterval)
  }

  getWordsPerMinute = () => {
    return (this.correctCharactersTyped * 12) / (this.timeElapsedInSeconds)
  }

  incrementCorrectCharactersTyped = () => {
    (this.correctCharactersTyped)++
  }

  incrementTotalCharactersTyped = () => {
    (this.totalCharactersTyped)++
  }

  getUserTypingAccuracyPercentage = () => {
    if (this.totalCharactersTyped === 0)
      return 100
    return (this.correctCharactersTyped / this.totalCharactersTyped) * 100
  }

  formatMetricsIntoArray = () => {
    const typingMetrics = {
      timestamps: [],
      wpm: [],
      accuracy: [],
    }

    this.userTypingSpeed.forEach(dataPoint => {
      typingMetrics.timestamps.push(dataPoint.timeElapsedInSeconds)
      typingMetrics.wpm.push(Number.parseFloat(dataPoint.wpm).toFixed(2))
      typingMetrics.accuracy.push(Number.parseFloat(dataPoint.accuracy).toFixed(2))
    })

    return typingMetrics
  }
}

class Model {
  constructor() {
    this.typingMetrics = new TypingMetricsModel()
  }

  resetTypingMetrics = () => {
    this.typingMetrics = new TypingMetricsModel()
  }
}

export default Model

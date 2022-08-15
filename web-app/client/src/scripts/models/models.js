class TypingMetricsModel {
  typingMetrics = {
    timeElapsedInSeconds: 0,
    charactersTyped: 0,
    userTypingSpeed: [{
      time: 0,
      wpm: 0
    }]
  }

  startRecordingUserTypingSpeed = () => {
    this.recordingInterval = setInterval(() => {

      this.typingMetrics.timeElapsedInSeconds += 2
      this.typingMetrics.userTypingSpeed.push({
        time: this.typingMetrics.timeElapsedInSeconds,
        wpm: this.getWordsPerMinute()
      })

      console.log(this.typingMetrics)

    }, 2000)
  }

  stopRecordingUserTypingSpeed = () => {
    clearInterval(this.recordingInterval)
  }

  getWordsPerMinute = () => {
    return (this.typingMetrics.charactersTyped * 12) / (this.typingMetrics.timeElapsedInSeconds)
  }

  incrementCharactersTyped = () => {
    (this.typingMetrics.charactersTyped)++
  }
}

class Model {
  constructor() {
    this.typingMetrics = new TypingMetricsModel()
  }
}

export default Model

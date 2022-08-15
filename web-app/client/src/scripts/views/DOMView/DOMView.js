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

class DOMView {
  constructor() {
    this.textArea = new TextArea()
    this.waitingForOpponentText = new WaitingText()
  }
}

export default DOMView

class TextArea {
  constructor() {
    this.typedText = ''
    this.untypedText = this.getText()

    this.typedDom = document.querySelector('#typed')
    this.untypedDom = document.querySelector('#untyped')

    this.init()
  }

  init() {
    this.updateTextInDOM()
    window.addEventListener('keydown', this.handleUserTyped)
  }

  updateTextInDOM() {
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

  handleUserTyped = (event) => {
    console.log(event.key)
    if (event.key === this.untypedText[0]) {
      this.typedText += event.key
      this.untypedText = this.untypedText.substring(1)
    }

    if (this.untypedText.length === 0) {
      this.typedText = ''
      this.untypedText = this.getText()
    }

    this.updateTextInDOM()
  }

  getText() {
    // return `A Python dictionary with Redis as the storage back-end. Redis is a great database for all kinds of
    // environments; from simple to complex. redis-dict tries to make using Redis as simple as using a
    // dictionary. redis-dict stores data in Redis with key-values, this is according to Redis best
    // practices. This also allows other non-Python programs to access the data stored in Redis.`
    return 'A Python dictionary with Redis as the storage back-end.'
  }
}

class DOMView {
  constructor() {
    this.textArea = new TextArea()
  }
}

export default DOMView

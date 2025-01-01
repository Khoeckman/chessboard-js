// Copyright (c) 2022–2024 Kyle Hoeckman, MIT License
// https://github.com/Khoeckman/canvasParticles/blob/main/LICENSE

class ChessBoard {
  static version = '0.0.1'

  /**
   * Creates a new ChessBoard instance.
   * @param {string} [selector] - The CSS selector for the chessboard element.
   * @param {Object} [options={}] - Object structure: link
   */
  constructor(selector, options = {}) {
    // Find and initialize canvas
    if (typeof selector !== 'string') throw new TypeError('selector is not a string')

    this.el = document.querySelector(selector)
    if (!(this.el instanceof HTMLDivElement)) throw new Error('selector does not point to a div')

    this.formatOptions(options)

    // Event handling
    window.addEventListener('resize', this.resize)
    this.resize()

    window.addEventListener('mousemove', this.updateMousePos)
  }

  formatOptions = options => {
    // TODO
  }

  handleMouseClick = event => {
    if (event instanceof MouseEvent) {
      this.clientX = event.clientX
      this.clientY = event.clientY
    }

    const { left, top } = this.el.getBoundingClientRect()
    this.mouseX = this.clientX - left
    this.mouseY = this.clientY - top

    console.log(this.mouseX, this.mouseY)
  }

  resize = () => {
    // TODO

    this.display()
  }

  display = () => {

  }
}

try {
  if (typeof module !== undefined) module.exports = ChessBoard
} catch (err) {
  globalThis.ChessBoard = ChessBoard
}

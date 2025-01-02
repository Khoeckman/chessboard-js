// Copyright (c) 2022–2024 Kyle Hoeckman, MIT License
// https://github.com/Khoeckman/canvasParticles/blob/main/LICENSE

import { Chess } from 'chess.js'

export default class ChessBoard {
  static version = '1.0.0-alpha.0'

  /**
   * Creates a new ChessBoard instance.
   * @param {string} [selector] - The CSS selector for the canvas element.
   * @param {Object} [options={}] - Object structure: link
   */
  constructor(selector, options = {}) {
    // Find and initialize canvas element
    if (typeof selector !== 'string') throw new TypeError('selector is not a string')

    this.canvas = document.querySelector(selector)
    if (!(this.canvas instanceof HTMLCanvasElement)) throw new Error('selector does not point to a canvas')

    this.formatOptions(options)
    this.setup()

    // Event handling
    window.addEventListener('resize', this.resize)
    this.resize()

    window.addEventListener('click', this.handleMouseClick)
  }

  formatOptions = options => {
    this.options = {
      white: options.white ?? '#eeeed2',
      black: options.black ?? '#769656',
    }

    if (typeof this.options.white !== 'string') this.options.white = '#eeeed2'
    if (typeof this.options.black !== 'string') this.options.black = '#769656'
  }

  handleMouseClick = event => {
    if (event instanceof MouseEvent) {
      this.clientX = event.clientX
      this.clientY = event.clientY
    }

    const { left, top } = this.el.getBoundingClientRect()
    this.mouseX = this.clientX - left
    this.mouseY = this.clientY - top

    // TODO: Check if click is inside the chessboard

    // console.log(this.mouseX, this.mouseY)
  }

  resize = () => {
    this.cellSize = ~~(Math.min(this.canvas.offsetWidth, this.canvas.offsetHeight) / 8)
    this.canvas.width = this.canvas.height = this.boardSize = this.cellSize * 8

    this.display()
  }

  /**
   * Setup 2d drawing functions
   */
  setup = () => {
    this.chess = new Chess()

    console.log(this.chess.pgn())

    this.ctx = this.canvas.getContext('2d')

    // Set font
    const fontSize = this.cellSize / 4.75
    this.ctx.font = `600 ${fontSize}px Segoe UI`
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    this.flipped = false
  }

  display = () => {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        // Calculate the logical position of a square based on whether the board is flipped.
        // When flipped, the logical position reverses the x and y coordinates (mirrors the board).
        let logical = {
          x: this.flipped ? 7 - x : x,
          y: this.flipped ? 7 - y : y,
        }

        // Draw Squares
        this.ctx.fillStyle = x % 2 ^ y % 2 ? this.options.black : this.options.white
        this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)

        // Draw legal moves
        this.ctx.fillStyle = 'rgba(0, 0, 0, .1)'

        if (pieceFrom?.color == this.chess.turn()) {
          for (let i of legalMovesCoords) {
            if (i[0] == moveFrom.x && i[1] == moveFrom.y && i[2] == logical.x && i[3] == logical.y) {
              this.ctx.beginPath()

              if (this.chess.board()[logical.y][logical.x] === null) {
                this.ctx.arc((x + 0.5) * this.cellSize, (y + 0.5) * this.cellSize, this.cellSize / 6, 0, 2 * Math.PI)
              } else {
                this.ctx.arc((x + 0.5) * this.cellSize, (y + 0.5) * this.cellSize, this.cellSize / 2, 0, 2 * Math.PI)
                this.ctx.arc((x + 0.5) * this.cellSize, (y + 0.5) * this.cellSize, (0.75 * this.cellSize) / 2, 0, 2 * Math.PI, true)
              }
              this.ctx.fill()
              break
            }
          }
        }

        // Draw red highlight
        this.ctx.fillStyle = 'rgba(235, 97, 80, 0.8)'
        let piece = this.chess.board()[logical.y][logical.x]

        if (piece != null && piece.type == 'k' && 0) {
          this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
        }

        if (moves[movesIndex] != undefined || moveFrom.x != null) {
          if (moves[movesIndex] != undefined) {
            let lastMove = coords(moves[movesIndex])
          }

          // Draw yellow highlight
          if (
            (logical.x == moveFrom.x && logical.y == moveFrom.y) ||
            (typeof lastMove != 'undefined' &&
              ((logical.x == lastMove[0] && logical.y == lastMove[1]) || (logical.x == lastMove[2] && logical.y == lastMove[3])))
          ) {
            this.ctx.fillStyle = 'rgba(255, 255, 0, .5)'
            this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
          }
        }

        // Draw coordinates
        this.ctx.fillStyle = x % 2 ^ y % 2 ? this.options.white : this.options.black
        if (x == 0) ctx.fillText(8 - logical.y, x * this.cellSize + this.cellSize / 9.15, y * this.cellSize + this.cellSize / 6.17)
        if (y == 7)
          ctx.fillText(
            String.fromCharCode(97 + logical.x),
            x * this.cellSize + this.cellSize / 1.15,
            y * this.cellSize + this.cellSize / 1.17
          )

        // Draw pieces
        if (piece !== null && !(mouse.down[0] && moveFrom.x == logical.x && moveFrom.y == logical.y)) {
          this.ctx.drawImage(window[+(piece.color == 'b') + piece.type], x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
        }
      }
    }

    if (mouse.down[0] && moveFrom.x != null) {
      let piece = this.chess.board()[moveFrom.y][moveFrom.x]
      this.ctx.drawImage(
        window[+(piece.color == 'b') + piece.type],
        Math.min(Math.max(clientX, 0), canvas.width) - this.cellSize / 2,
        Math.min(Math.max(clientY, 0), canvas.height) - this.cellSize / 2,
        this.cellSize,
        this.cellSize
      )
    }

    if (this.chess.game_over()) {
      this.ctx.font = this.cellSize + 'px Segoe UI'
      this.ctx.shadowColor = 'black'
      this.ctx.shadowBlur = this.cellSize / 16
      this.ctx.fillStyle = this.chess.turn() == 'b' ? '#ced1d4' : '#312e2b'

      if (this.chess.in_draw()) {
        this.ctx.fillText('DRAW', canvas.width / 2, canvas.height / 2)
      } else if (this.chess.turn() == 'b') {
        this.ctx.fillText('WHITE WINS', canvas.width / 2, canvas.height / 2)
      } else {
        this.ctx.fillText('BLACK WINS', canvas.width / 2, canvas.height / 2)
      }
    }
  }
}

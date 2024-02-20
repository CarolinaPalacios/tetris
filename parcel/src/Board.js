class Board {
  constructor() {
    this.columns = 10
    this.rows = 20
    this.cell_side = 25
    this.width = this.columns * this.cell_side
    this.height = this.rows * this.cell_side
    this.position = createVector(
      BOARD_MARGIN,
      BOARD_MARGIN + 2 * this.cell_side
    )

    /* memory will be responsible for representing the stored minoes */
    this.storedMinoes = []
    for (let row = 0; row < this.rows; row++) {
      this.storedMinoes[row] = []
      for (let column = 0; column < this.columns; column++) {
        this.storedMinoes[row].push('')
      }
    }
  }

  set storeMino(tetromino) {
    let gameOver = false
    for (const pmino of tetromino.boardMap) {
      if (pmino.y < 0) {
        // Game over
        gameOver = true
        break
      }
      this.storedMinoes[pmino.x][pmino.y] = tetromino.name
    }
    if (gameOver) {
      alert('GAME OVER')
      this.resetGame()
    }
    this.findHorizontalLinesToClear()
  }

  resetGame() {
    this.storedMinoes = Array.from({ length: this.rows }, () =>
      Array(this.columns).fill('')
    )
    console.log('reset game', this.storedMinoes)
    done_lines = 0
    tetromino = new Tetromino()
    current_level = 1
    fall_interval = 1000

    clearInterval(fallIntervalId)
    fallIntervalId = setInterval(() => {
      if (millis() - fall_regulator < fall_interval) {
        return
      }
      fall_regulator = millis()
      tetromino.moveDown()
    }, fall_interval)
  }

  findHorizontalLinesToClear() {
    const lines = []
    for (let row = 0; row < this.rows; row++) {
      let isLineComplete = true
      for (let column = 0; column < this.columns; column++) {
        if (!this.storedMinoes[column][row]) {
          isLineComplete = false
          break
        }
      }
      if (isLineComplete) {
        const stageClearAudio = new Audio('public/stage-clear.mp3')
        stageClearAudio.volume = 0.05
        stageClearAudio.play()
        lines.push(row)
      }
    }
    this.clearLines(lines)
  }

  clearLines(lines) {
    done_lines += lines.length
    for (const line of lines) {
      for (let r = line; r > 0; r--) {
        for (let column = 0; column < this.columns; column++) {
          this.storedMinoes[column][r] = this.storedMinoes[column][r - 1]
        }
      }
      for (let column = 0; column < this.columns; column++) {
        this.storedMinoes[column][0] = ''
      }
    }
  }

  /* coordinate is a non-linear transformation where a scaling (multiplication) is applied to adjust the measurements and a translation (sum) to adjust the position. */
  coordinate(x, y) {
    return createVector(x, y).mult(this.cell_side).add(this.position)
  }

  /*
   This will be in charge of the logical processingfor the drawing of this element.
  */

  draw() {
    push()
    noStroke()
    for (let column = 0; column < this.columns; column++) {
      for (let row = 0; row < this.rows; row++) {
        ;(column + row) % 2 === 0 ? fill('black') : fill('#003')
        const c = this.coordinate(column, row)
        rect(c.x, c.y, this.cell_side)
      }
    }
    pop()
    this.drawStoredMinoes()
  }

  drawStoredMinoes() {
    push()
    for (let column = 0; column < this.columns; column++) {
      for (let row = 0; row < this.rows; row++) {
        const minoName = this.storedMinoes[column][row]
        if (minoName) {
          fill(baseTetrominoes[minoName].color)
          Tetromino.drawMino(this.coordinate(column, row))
        }
      }
    }

    pop()
  }
}

class Tetromino {
  constructor(name = random(Object.keys(baseTetrominoes))) {
    this.name = name
    const base = baseTetrominoes[name]
    this.color = base.color
    this.map = []
    for (const pmino of base.map) {
      this.map.push(pmino.copy())
    }
    this.position = createVector(int(board.columns / 2), -1)
  }

  moveRight() {
    this.position.x++
    if (this.collision) this.moveLeft()
  }

  moveLeft() {
    this.position.x--
    if (this.collision) this.moveRight()
  }

  moveDown() {
    this.position.y++
    if (this.collision) {
      this.moveUp()
      if (tetromino === this) {
        board.storeMino = this
        tetromino = new Tetromino()
      }
      return false
    }
    return true
  }

  moveUp() {
    this.position.y--
  }

  putInTheBackground() {
    this.position = this.spectrum.position
    this.moveDown()
  }

  turn() {
    for (const pmino of this.map) {
      pmino.set(pmino.y, -pmino.x)
    }
    if (this.collision) this.unturn()
  }

  unturn() {
    for (const pmino of this.map) {
      pmino.set(-pmino.y, pmino.x)
    }
  }

  get checkCollision() {
    for (const pmino of this.boardMap) {
      if (pmino.x < 0) return false
      if (pmino.x >= board.columns) return false
      if (pmino.y >= board.rows) return false
    }
    return true
  }

  get collisionWithStoredMinoes() {
    for (const pmino of this.boardMap) {
      if (board.storedMinoes[pmino.x][pmino.y]) {
        return true
      }
    }
    return false
  }

  get collision() {
    return !this.checkCollision || this.collisionWithStoredMinoes
  }

  get canvasMap() {
    const returnMap = []
    for (const pmino of this.map) {
      const copy = pmino.copy().add(this.position)
      returnMap.push(board.coordinate(copy.x, copy.y))
    }
    return returnMap
  }

  get boardMap() {
    const returnMap = []
    for (const pmino of this.map) {
      const copy = pmino.copy().add(this.position)
      returnMap.push(copy)
    }
    return returnMap
  }

  draw() {
    push()
    fill(this.color)
    for (const pmino of this.canvasMap) {
      Tetromino.drawMino(pmino)
    }
    pop()
    if (tetromino === this) this.drawSpectrum()
  }

  drawSpectrum() {
    this.spectrum = new Tetromino(this.name)
    this.spectrum.position = this.position.copy()
    for (let i = 0; i < this.map.length; i++) {
      this.spectrum.map[i] = this.map[i].copy()
    }
    while (this.spectrum.moveDown());
    push()
    drawingContext.globalAlpha = 0.3
    this.spectrum.draw()
    pop()
  }

  static drawMino(pmino) {
    rect(pmino.x, pmino.y, board.cell_side)
    push()
    noStroke()
    fill(255, 255, 255, 80)
    beginShape()
    vertex(pmino.x, pmino.y)
    vertex(pmino.x + board.cell_side, pmino.y)
    vertex(pmino.x + board.cell_side, pmino.y + board.cell_side)
    endShape(CLOSE)
    beginShape()
    fill(0, 0, 0, 80)
    vertex(pmino.x, pmino.y)
    vertex(pmino.x, pmino.y + board.cell_side)
    vertex(pmino.x + board.cell_side, pmino.y + board.cell_side)
    endShape(CLOSE)
    pop()
  }
}

function createTetrominoBaseMapping() {
  baseTetrominoes = {
    Z: {
      color: 'red',
      map: [
        createVector(),
        createVector(-1, -1),
        createVector(0, -1),
        createVector(1, 0),
      ],
    },
    S: {
      color: 'green',
      map: [
        createVector(),
        createVector(1, -1),
        createVector(0, -1),
        createVector(-1, 0),
      ],
    },
    J: {
      color: 'orange',
      map: [
        createVector(),
        createVector(-1, 0),
        createVector(-1, -1),
        createVector(1, 0),
      ],
    },
    L: {
      color: 'dodgerblue',
      map: [
        createVector(),
        createVector(-1, 0),
        createVector(1, -1),
        createVector(1, 0),
      ],
    },
    T: {
      color: 'magenta',
      map: [
        createVector(),
        createVector(-1, 0),
        createVector(1, 0),
        createVector(0, -1),
      ],
    },
    O: {
      color: 'yellow',
      map: [
        createVector(),
        createVector(0, -1),
        createVector(1, 0),
        createVector(1, -1),
      ],
    },
    I: {
      color: 'cyan',
      map: [
        createVector(),
        createVector(-1, 0),
        createVector(1, 0),
        createVector(2, 0),
      ],
    },
  }
}

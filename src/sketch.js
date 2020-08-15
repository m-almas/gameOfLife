let grid
let nextState
let width = 400
let height = 400
let resolution = 10
let running = false
let widthFactor = 1
let heightFactor = 0.8
let speed = 5

// Patterns Modal
let isModalOpen = false
const outerModal = document.querySelector('.outer-modal')
const innerModal = outerModal.querySelector('.inner-modal')
const closeModalBtn = innerModal.querySelector('#close-modal')

// init patterns inside modal
const patternsList = innerModal.querySelector('.patterns-list')
const patternBtnHTML = pattern => `
<div class="patterns-list-item">
  <img src="./assets/${pattern}.gif" alt="${pattern} pattern" />
  <button class="btn-pattern" data-pattern="${pattern}">
    ${pattern}
  </button>
</div>
`
patternsList.innerHTML = Object.keys(patternsMap).reduce(
    (list, pattern) => `${list} ${patternBtnHTML(pattern)}`,
    ''
)

// when pattern is chosen:
const patternBtns = innerModal.querySelectorAll('.btn-pattern')
patternBtns.forEach(btn =>
    btn.addEventListener('click', e => {
        console.log('what')
        const pattern = e.target.dataset['pattern'] // get pattern name
        setInitialState(grid, patternsMap[pattern]) // get pattern by name from patterns map
        draw()
        closeModal()
    })
)

function closeModal() {
    isModalOpen = false
    outerModal.classList.remove('open')
}
closeModalBtn.addEventListener('click', closeModal)
// close modal when clicked outside of modal
outerModal.addEventListener('click', e => {
    const isOutside = !e.target.closest('.inner-modal')
    if (isOutside) {
        closeModal()
    }
})

// Play button icons
const startSvg = `<svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M8 5v14l11-7z" />
        </svg>`
const stopSvg = `<svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M6 6h12v12H6z" />
        </svg>`

function setup() {
    width = Math.floor(windowWidth * widthFactor)
    height = Math.floor(windowHeight * heightFactor)
    const canvas = createCanvas(width, height) // this is hard coded
    canvas.parent('canvas')

    grid = createCellGrid(
        Math.floor(width / resolution),
        Math.floor(height / resolution),
        resolution
    )
    nextState = createCellGrid(
        Math.floor(width / resolution),
        Math.floor(height / resolution),
        resolution
    )

    frameRate(speed)

    // Add listeners to buttons
    buttonPlay = select('#play')

    function stopGame() {
        running = false
        noLoop()
        buttonPlay.html(startSvg)
        buttonPlay.removeClass('active')
    }

    buttonPlay.mousePressed(() => {
        if (running) {
            stopGame()
        } else {
            running = true
            loop()
            buttonPlay.html(stopSvg)
            buttonPlay.addClass('active')
        }
    })

    buttonStep = select('#step')
    buttonStep.mousePressed(() => {
        if (!running) {
            step()
        }
    })

    buttonSpeedUp = select('#speed-up')
    buttonSpeedUp.mousePressed(() => {
        speed *= 2
        frameRate(speed)
        if (speed >= 80) {
            buttonSpeedUp.attribute('disabled', '')
        } else {
            buttonSpeedDown.removeAttribute('disabled')
        }
    })

    buttonSpeedDown = select('#speed-down')
    buttonSpeedDown.mousePressed(() => {
        speed /= 2
        frameRate(speed)
        if (speed <= 0.8) {
            buttonSpeedDown.attribute('disabled', '')
        } else {
            buttonSpeedUp.removeAttribute('disabled')
        }
    })

    buttonChoosePattern = select('#patterns')
    buttonChoosePattern.mousePressed(() => {
        stopGame()
        isModalOpen = true
        outerModal.classList.add('open')
    })

    buttonRandomPattern = select('#random-pattern')
    buttonRandomPattern.mousePressed(() => {
        randomizeGrid(grid)
    })

    buttonEraseCanvas = select('#erase-canvas')
    buttonEraseCanvas.mousePressed(() => {
        stopGame()
        clearGrid()
    })

    noLoop()
    redraw()
}

function draw() {
    background(0)
    grid.forEach(row => {
        row.forEach(cell => {
            cell.show()
        })
    })
    if (running) {
        step()
    }
}

function step() {
    computeNextState(grid, nextState)
    temp = grid
    grid = nextState
    nextState = temp
    redraw()
}

function computeNextState(grid, next) {
    let rows = grid.length
    let cols = grid[0].length
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let count = countNeighbor(i, j, grid)
            if (grid[i][j].isAlive == 1) {
                if (count < 2) {
                    next[i][j].setLife(0)
                } else if (count < 4) {
                    next[i][j].setLife(1)
                } else {
                    next[i][j].setLife(0)
                }
            } else {
                if (count == 3) {
                    next[i][j].setLife(1)
                } else {
                    next[i][j].setLife(0)
                }
            }
        }
    }
}

function countNeighbor(i, j, grid) {
    let rows = grid.length
    let cols = grid[0].length
    let x_dir = [0, -1, -1, 0, 1, 1, -1, 1]
    let y_dir = [-1, 0, -1, 1, 0, 1, 1, -1]
    let result = 0
    for (let k = 0; k < 8; k++) {
        let x = i + x_dir[k]
        let y = j + y_dir[k]
        x = (x + rows) % rows
        y = (y + cols) % cols
        result += grid[x][y].isAlive
    }
    return result
}

function createCellGrid(rows, cols, dim) {
    let result = new Array(rows)

    for (let i = 0; i < rows; i++) {
        result[i] = new Array(cols)
    }

    //setting up empty objects
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            result[i][j] = new Cell(0, { x: i * dim, y: j * dim }, dim)
        }
    }
    return result
}

function mousePressed() {
    if (running || isModalOpen) return
    grid.forEach(row => {
        row.forEach(cell => {
            cell.clicked(mouseX, mouseY)
        })
    })
    redraw()
}

function mouseDragged() {
    if (running || isModalOpen) return
    grid.forEach(row => {
        row.forEach(cell => {
            cell.dragged(mouseX, mouseY)
        })
    })
    redraw()
}

function windowResized() {
    resizeCanvas(windowWidth * widthFactor, windowHeight * heightFactor)
}

function clearGrid() {
    grid.forEach(row => {
        row.forEach(cell => {
            cell.setLife(0)
        })
    })
}

function setInitialState(grid, state) {
    clearGrid()
    let stateRow = state.length
    let stateCol = state[0].length
    let gridRowStart = Math.floor(grid.length / 2 - stateRow / 2)
    let gridColStart = Math.floor(grid[0].length / 2 - stateCol / 2)
    for (let i = 0; i < stateRow; i++) {
        for (let j = 0; j < stateCol; j++) {
            grid[gridRowStart + i][gridColStart + j].setLife(state[i][j])
        }
    }
}

function randomizeGrid(grid) {
    grid.forEach(row => {
        row.forEach(cell => {
            cell.setLife(Math.floor(Math.random() * 2)) //random between 1, 0
        })
    })
}

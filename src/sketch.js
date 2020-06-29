


let grid;
let width = 400;
let height = 400;
let resolution = 40;
let running = false;

function setup() {
    createCanvas(width, height); // this is hard coded
    grid = createCellGrid(width / resolution, height / resolution, resolution);
    buttonStart = createButton('start');
    buttonStart.mousePressed(() => {
        running = true;
        loop();
    })
    buttonStop = createButton('stop');
    buttonStop.mousePressed(() => {
        running = false;
        noLoop();
    })
    noLoop();
    redraw();
}

function draw() {
    background(0);
    grid.forEach(row => {
        row.forEach(cell => {
            cell.show();
        })
    });
}

function createCellGrid(rows, cols, dim) {
    let result = new Array(rows);
    for (let i = 0; i < rows; i++) {
        result[i] = new Array(cols);
    }
    //setting up empty objects
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            result[i][j] = new Cell(0, { x: i * dim, y: j * dim }, dim);
        }
    }
    return result;
}

function mouseClicked() {
    if (running) return;
    grid.forEach(row => {
        row.forEach(cell => {
            cell.clicked(mouseX, mouseY);
        })
    })
    redraw()
}

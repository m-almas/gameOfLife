class Cell {
    constructor(isAlive, topLeft, dim) {
        this.isAlive = isAlive
        this.topLeft = topLeft
        this.dim = dim
    }

    setLife(isAlive) {
        this.isAlive = isAlive
    }

    toggleLife() {
        if (this.isAlive == 1) {
            this.isAlive = 0
        } else {
            this.isAlive = 1
        }
    }

    show() {
        if (this.isAlive == 1) {
            fill(255)
        } else {
            fill(0)
        }
        rect(this.topLeft.x, this.topLeft.y, this.dim, this.dim)
    }

    clicked(x, y) {
        if (this.isInside(x, y)) {
            this.toggleLife()
        }
    }

    dragged(x, y) {
        if (this.isInside(x, y)) {
            this.setLife(1)
        }
    }

    isInside(x, y) {
        let startX = this.topLeft.x
        let startY = this.topLeft.y
        let result = true
        result = result && startX < x && x < startX + this.dim
        result = result && startY < y && y < startY + this.dim
        return result
    }
}

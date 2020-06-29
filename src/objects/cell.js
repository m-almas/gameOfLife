class Cell {

    constructor(isAlive, topLeft, dim) {
        this.isAlive = isAlive;
        this.topLeft = topLeft;
        this.dim = dim;
    }

    setLife(isAlive) {
        this.isAlive = isAlive;
    }

    toggleLife() {
        if (this.isAlive == 1) {
            this.isAlive = 0;
        } else {
            this.isAlive = 1;
        }
    }

    show() {
        if (this.isAlive == 1) {
            fill(255);
        } else {
            fill(0);
        }
        rect(this.topLeft.x, this.topLeft.y, this.dim, this.dim);
    }

    clicked(x, y) {
        let startX = this.topLeft.x;
        let startY = this.topLeft.y;
        let isInHor = (startX < x) && (x < startX + this.dim);
        let isInVer = (startY < y) && (y < startY + this.dim);
        if (isInHor && isInVer) {
            this.toggleLife()
        }
    }
}

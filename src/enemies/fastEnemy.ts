class FastEnemy extends Enemy {
    constructor(x: number, y: number, gridSize: number) {
        // NormalEnemy with standard speed, health, and size
        super(1.5, x, y, 50, gridSize/2, gridSize); // speed, x, y, health, size, gridSize
    }
}
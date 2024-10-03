class NormalEnemy extends Enemy {
    constructor(x: number, y: number, gridSize: number) {
        // NormalEnemy with standard speed, health, and size
        super(0.5, x, y, 100, gridSize/2, gridSize); // speed, x, y, health, size, gridSize
    }
}
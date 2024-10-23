class marksmanBullet extends bullet {
    constructor(damage: number, towerX: number, towerY: number, enemyX: number, enemyY: number, towerSize: number, enemySize: number, towerUpgrade: number, pierce: number, speed: number, towerOfOrigin: Tower) {
        // Call the parent class constructor
        super(damage, towerX, towerY, enemyX, enemyY, towerSize, enemySize, towerUpgrade, pierce, speed, towerOfOrigin);
    }


    public override render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'black'; // Set fill style for the bullet
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();

        // Draw the border around the bullet
        ctx.strokeStyle = 'white'; // Set color for the border
        ctx.lineWidth = 2; // Set line width for the border
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.stroke();

        const smallSquareSize = 2;
        const smallSquareX = this.x - smallSquareSize / 2;
        const smallSquareY = this.y - smallSquareSize / 2;

        if (this.towerUpgrade == 1) {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'white';
        }
        ctx.fillRect(smallSquareX, smallSquareY, smallSquareSize, smallSquareSize);
    }
}
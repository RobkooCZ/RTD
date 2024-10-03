class BasicBullet {
    public damage: number;
    public x: number; // Current position of the bullet
    public y: number; // Current position of the bullet
    public targetX: number; // Target position (center of the enemy)
    public targetY: number; // Target position (center of the enemy)
    private towerSize: number;
    private enemySize: number;
    public towerUpgrade: number;
    public pierce: number;
    private size: number = 12.5; // Size of the bullet

    constructor(damage: number, towerX: number, towerY: number, enemyX: number, enemyY: number, towerSize: number, enemySize: number, towerUpgrade: number, pierce: number) {
        this.damage = damage;
        this.towerSize = towerSize;
        this.enemySize = enemySize;
        this.x = towerX + (this.towerSize - 10) / 2; // Center the bullet in the tower
        this.y = towerY + (this.towerSize - 10) / 2; 
        this.targetX = enemyX + (this.enemySize - 10) / 2; // Center the bullet in the enemy
        this.targetY = enemyY + (this.enemySize - 10) / 2;
        this.towerUpgrade = towerUpgrade;
        this.pierce = pierce;
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    // Method to render the bullet on the canvas
    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'black'; // Set fill style for the bullet
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();

        // Draw the border around the tower
        ctx.strokeStyle = 'white'; // Set color for the border
        ctx.lineWidth = 2; // Set line width for the border

        const borderOffset = 4; // Offset for the border
        ctx.beginPath();
        ctx.rect(
            this.x,
            this.y,
            this.size,   
            this.size  
        );
        ctx.stroke();

        // Draw a small white square in the center of the fill
        const smallSquareSize = 2; // Size of the small white square
        const smallSquareX = this.x + (this.size - smallSquareSize) / 2; // Centered x position
        const smallSquareY = this.y + (this.size - smallSquareSize) / 2; // Centered y position

        if (this.towerUpgrade == 1){
            ctx.fillStyle = 'red';
        }
        else {
            ctx.fillStyle = 'white'; // Set color for the small square
        }
        ctx.fillRect(smallSquareX, smallSquareY, smallSquareSize, smallSquareSize); // Draw the small square
    }

    public move(enemies: BasicEnemy[], ctx: CanvasRenderingContext2D): void {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        
        if (magnitude === 0) {
            return; // Already at target position, exit the function
        }

        const speed = 10;
        
        // Calculate normalized direction vector
        const directionX = dx / magnitude;
        const directionY = dy / magnitude;
        
        // Update position
        this.x += directionX * speed;
        this.y += directionY * speed;

        // Check for overshooting and snap to target if necessary
        const distToTarget = Math.sqrt((this.targetX - this.x) ** 2 + (this.targetY - this.y) ** 2);
        if (distToTarget < speed) {
            this.x = this.targetX;
            this.y = this.targetY;
        }

        // Check for collision with enemies
        enemies.forEach((enemy, index) => {
            const enemyCenterX = enemy.x + (this.enemySize - 10) / 2; // Center of the enemy
            const enemyCenterY = enemy.y + (this.enemySize - 10) / 2; // Center of the enemy
            if (this.x >= enemyCenterX - 12.5 && this.x <= enemyCenterX + 12.5 &&
                this.y >= enemyCenterY - 12.5 && this.y <= enemyCenterY + 12.5) {
                // Collision detected
                enemy.takeDamage(this.damage); // Apply damage to the enemy
                this.x = -100; // Move bullet off screen or similar (could also remove from array)
            }
        });

        this.render(ctx);
    }

    public isOutOfBounds(canvasWidth: number, canvasHeight: number): boolean {
        return this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight;
    }
}
class BasicBullet {
    public damage: number;
    public x: number; // Current position of the bullet
    public y: number; // Current position of the bullet
    public targetX: number; // Target position (center of the enemy)
    public targetY: number; // Target position (center of the enemy)
    private towerSize: number;
    private enemySize: number;

    constructor(damage: number, towerX: number, towerY: number, enemyX: number, enemyY: number, towerSize: number, enemySize: number) {
        this.damage = damage;
        this.towerSize = towerSize;
        this.enemySize = enemySize;
        this.x = towerX + (this.towerSize - 10) / 2; // Center the bullet in the tower
        this.y = towerY + (this.towerSize - 10) / 2; 
        this.targetX = enemyX + (this.enemySize - 10) / 2; // Center the bullet in the enemy
        this.targetY = enemyY + (this.enemySize - 10) / 2;
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    // Method to render the bullet on the canvas
    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'black'; // Set the color of the bullet
        ctx.beginPath();
        ctx.rect(this.x, this.y, 10, 10); // Bullet size
        ctx.fill();
    }

    public move(enemies: BasicEnemy[], ctx: CanvasRenderingContext2D): void {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        
        if (magnitude === 0) {
            return; // Already at target position, exit the function
        }

        const speed = 2;
        
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
                // Remove bullet after hitting the enemy
                this.x = -10; // Move bullet off screen or similar (could also remove from array)
            }
        });

        this.render(ctx);
    }
}
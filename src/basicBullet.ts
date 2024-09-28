class BasicBullet {
    private damage: number;
    x: number; // Current position of the bullet
    y: number; // Current position of the bullet
    targetX: number; // Target position (center of the enemy)
    targetY: number; // Target position (center of the enemy)

    constructor(damage: number, towerX: number, towerY: number, enemyX: number, enemyY: number) {
        this.damage = damage;

        // Center the bullet at the tower's position
        this.x = towerX + (50 - 10) / 2;
        this.y = towerY + (50 - 10) / 2;

        // Center the target at the enemy's position 
        this.targetX = enemyX + (50 - 10) / 2;
        this.targetY = enemyY + (50 - 10) / 2;
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

    public move(ctx: CanvasRenderingContext2D): void {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        
        if (magnitude === 0) {
            return; // Already at target position, exit the function
        }

        const speed = 5;
        
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

        // Render bullet
        this.render(ctx);
    }
}

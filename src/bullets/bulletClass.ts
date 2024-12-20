abstract class bullet {
    public damage: number;
    public towerOfOrigin: Tower; // Tower that fired the bullet
    public x: number; // Current position of the bullet
    public y: number; // Current position of the bullet
    public targetX: number; // Target position (center of the enemy)
    public targetY: number; // Target position (center of the enemy)
    private towerSize: number;
    private enemySize: number;
    public towerUpgrade: number;
    public pierce: number;
    public size: number = 12.5; // Size of the bullet   
    private hitEnemies: Set<Enemy>; // Set to store enemies that have been hit by the bullet
    private lastX: number; // To detect if the bullet is stuck
    private lastY: number; // To detect if the bullet is stuck
    public bulletFired: number = 0;
    public bulletRender: boolean = true;
    public speed: number;
    public armorPiercing: boolean;

    constructor(damage: number, towerX: number, towerY: number, enemyX: number, enemyY: number, towerSize: number, enemySize: number, towerUpgrade: number, pierce: number, speed: number, towerOfOrigin: Tower, armorPiercing: boolean) {
        this.damage = damage;
        this.towerSize = towerSize;
        this.hitEnemies = new Set();
        this.enemySize = enemySize;
        this.x = towerX + (this.towerSize - 10) / 2; // Center the bullet in the tower
        this.y = towerY + (this.towerSize - 10) / 2; 
        this.targetX = enemyX + (this.enemySize - 10) / 2; // Center the bullet in the enemy
        this.targetY = enemyY + (this.enemySize - 10) / 2;
        this.towerUpgrade = towerUpgrade;
        this.pierce = pierce;
        this.lastX = this.x;  // Initial position   
        this.lastY = this.y;
        this.speed = speed;
        this.towerOfOrigin = towerOfOrigin;
        this.armorPiercing = armorPiercing;
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

        // Draw the border around the bullet
        ctx.strokeStyle = 'white'; // Set color for the border
        ctx.lineWidth = 2; // Set line width for the border
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.stroke();

        // Draw a small white square in the center of the fill
        const smallSquareSize = 2; // Size of the small white square
        const smallSquareX = this.x + (this.size - smallSquareSize) / 2; // Centered x position
        const smallSquareY = this.y + (this.size - smallSquareSize) / 2; // Centered y position

        if (this.towerUpgrade == 1) {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'white'; // Set color for the small square
        }
        ctx.fillRect(smallSquareX, smallSquareY, smallSquareSize, smallSquareSize); // Draw the small square
    }

    public move(enemies: Enemy[], ctx: CanvasRenderingContext2D): void {
        const speed = this.speed; // Speed of the bullet
    
        // Move the bullet in its current direction
        let dx = this.targetX - this.x;
        let dy = this.targetY - this.y;
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        let hpOverflow: number | undefined;
    
        if (magnitude !== 0) {
            // Normalize the direction vector and move the bullet
            const directionX = dx / magnitude;
            const directionY = dy / magnitude;
            this.x += directionX * speed;
            this.y += directionY * speed;
        }
        
        // Track the previous position to detect if the bullet is stuck
        // const hasMoved = this.lastX !== this.x || this.lastY !== this.y;
        this.lastX = this.x;
        this.lastY = this.y;
    
        // Check if bullet has hit an enemy and hasn't hit it before
        enemies.forEach((enemy) => {
            const enemyCenterX = enemy.x + (this.enemySize - 10) / 2;
            const enemyCenterY = enemy.y + (this.enemySize - 10) / 2;

            if (this.x >= enemyCenterX - 12.5 && this.x <= enemyCenterX + 12.5 &&
                this.y >= enemyCenterY - 12.5 && this.y <= enemyCenterY + 12.5 &&
                !this.hitEnemies.has(enemy)) { // Only hit if not already hit

                // Collision detected, apply damage, and add it to the total damage dealt by the tower
                if (!(this.towerOfOrigin.armorPiercing === false && enemy.fortified === true)) {
                    const hpOverflow = enemy.takeDamage(this.damage);
                    console.log("hpOverflow: " + hpOverflow);
                    if (hpOverflow != null) {
                        if (hpOverflow <= 0) {
                            console.log("damage + kill")
                            this.towerOfOrigin.addDamageDealt(hpOverflow);
                            if (!this.hitEnemies.has(enemy)) {
                                this.towerOfOrigin.addEnemyKilled();
                            }
                        } else {
                            console.log("damage");
                            this.towerOfOrigin.addDamageDealt(0);
                        }
                    }

                    this.hitEnemies.add(enemy);  // Mark enemy as hit

                    // Decrease pierce count
                    this.pierce--;
                } else {
                    this.pierce = 0;
                }
    
                if (this.pierce > 0) {
                    // Continue moving in the same direction, but further out
                    
                    const pierceDistance = 50;  // Travel a bit beyond the enemy
                    this.targetX += (dx / magnitude) * pierceDistance; // Adjust target position
                    this.targetY += (dy / magnitude) * pierceDistance;                   
                } else {
                    // If no pierce left, mark as off-screen to be removed
                    this.x = -100;
                    this.y = -100;
                }   
            }
        });
    
        // Render the bullet
        this.render(ctx);
    }
    
    
    public isOutOfBounds(canvasWidth: number, canvasHeight: number): boolean {
        return this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight;
    }
}

class BasicEnemy {
    public x: number;
    public y: number;
    public speed: number;
    public health: number;
    private size: number; // Size of the enemy
    private gridSize: number;

    constructor(speed: number, x: number, y: number, health: number, size: number, gridSize: number) {
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.health = health; // Initialize health
        this.size = size; // Initialize size
        this.gridSize = gridSize;
    }

    // Method to apply damage to the enemy
    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0; // Prevent negative health
            // Additional logic for enemy death can go here
        }
    }

    // Method to render the enemy on the canvas"
    public render(ctx: CanvasRenderingContext2D, health: number): void {
        if (health > 85 && health <= 100) {
            ctx.fillStyle = 'white'; // Very healthy: white color
        } else if (health > 65 && health <= 85) {
            ctx.fillStyle = 'lightgreen'; // Healthy: light green color
        } else if (health > 45 && health <= 65) {
            ctx.fillStyle = 'yellow'; // Moderately healthy: yellow color
        } else if (health > 32 && health <= 45) {
            ctx.fillStyle = 'orange'; // Wounded: orange color
        } else if (health > 16 && health <= 32) {
            ctx.fillStyle = 'pink'; // Seriously wounded: pink color
        } else if (health > 0 && health <= 16) {
            ctx.fillStyle = 'red'; // Critical condition: red color
        }

        ctx.beginPath();
        
        // Center the enemy in the grid cell
        const centeredX = this.x + (this.gridSize - this.size) / 2; // Center it horizontally
        const centeredY = this.y + (this.gridSize - this.size) / 2; // Center it vertically

        ctx.rect(centeredX, centeredY, this.size, this.size); // Draw the enemy
        ctx.fill();
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

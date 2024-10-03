abstract class Enemy {
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

    // Method to render the enemy on the canvas
    public render(ctx: CanvasRenderingContext2D): void {
        // Calculate the color based on health
        const healthPercentage = Math.max(0, Math.min(100, this.health));
        const red = Math.floor(255 * (1 - healthPercentage / 100));   // R component from 0 (black) to 255 (white)
        const green = Math.floor(255 * (1 - healthPercentage / 100)); // G component from 0 (black) to 255 (white)
        const blue = Math.floor(255 * (1 - healthPercentage / 100));  // B component from 0 (black) to 255 (white)

        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`; // Set fill style based on health

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
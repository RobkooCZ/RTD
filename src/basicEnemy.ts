class BasicEnemy {
    private speed: number;
    x: number;
    y: number;
    private size: number; // Size of the enemy

    constructor(speed: number, x: number, y: number) {
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.size = 25; // Define the size of the enemy
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    // Method to render the enemy on the canvas
    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'white'; // Set the color of the enemy
        ctx.beginPath();
        
        // Center the enemy in the grid cell
        const centeredX = this.x + (50 - this.size) / 2; // Assuming each grid cell is 50x50
        const centeredY = this.y + (50 - this.size) / 2; // Center it vertically

        ctx.rect(centeredX, centeredY, this.size, this.size); // Draw the enemy
        ctx.fill();
    }

    // Method to erase the enemy (draws over its previous position)
    public erase(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'brown'; // Assuming the background is brown
        const centeredX = this.x + (50 - this.size) / 2; // Centered X
        const centeredY = this.y + (50 - this.size) / 2; // Centered Y
        
        ctx.fillRect(centeredX, centeredY, this.size, this.size); // Draw over to "erase"
    }
}
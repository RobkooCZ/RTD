class NormalEnemy extends Enemy {
    constructor(x: number, y: number, gridSize: number) {
        // NormalEnemy with standard speed, health, and size
        super(0.5, x, y, 100, gridSize/2, gridSize, false, 50); // speed, x, y, health, size, gridSize, fortified
    }

    public override render(ctx: CanvasRenderingContext2D, size: number): void {
        // Calculate the color based on health
        const colorsArray: number[] = this.calculateHealthColor(this.health, this.maxHealth);
        const red: number = colorsArray[0];
        const green: number = colorsArray[1];
        const blue: number = colorsArray[2];
        this.size = size; // Set the size of the enemy
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`; // Set fill style based on health

        ctx.beginPath();

        // Center the enemy in the grid cell
        const centeredX = this.x + (this.gridSize - this.size) / 2; // Center it horizontally
        const centeredY = this.y + (this.gridSize - this.size) / 2; // Center it vertically

        ctx.rect(centeredX, centeredY, this.size, this.size); // Draw the enemy
        ctx.fill();
    }
}
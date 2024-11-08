/// <reference path="enemyClass.ts"/> 

class ArmoredEnemy extends Enemy {
    constructor(x: number, y: number, gridSize: number) {
        // NormalEnemy with standard speed, health, and size
        super(0.25, x, y, 200, gridSize/1.5, gridSize, true, 200); // speed, x, y, health, size, gridSize, fortified
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
        let centeredX = this.x + (this.gridSize - this.size) / 2; // Center it horizontally
        let centeredY = this.y + (this.gridSize - this.size) / 2; // Center it vertically

        ctx.rect(centeredX, centeredY, this.size, this.size); // Draw the enemy
        ctx.fill();

        ctx.strokeStyle = 'black';

        ctx.beginPath();

        centeredX = (this.x + (this.gridSize - this.size) / 2) - (this.size / 100) * 25;
        centeredY = (this.y + (this.gridSize - this.size) / 2) - (this.size / 100) * 25;

        ctx.rect(centeredX, centeredY, this.size * 1.5, this.size * 1.5); // Draw the enemy
        ctx.stroke();
    }
}
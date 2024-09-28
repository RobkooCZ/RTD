class BasicTower {
    range: number;
    damage: number;
    fireRate: number;
    x: number;
    y: number;

    constructor(range: number, damage: number, fireRate: number, x: number, y: number) {
        this.range = range;
        this.damage = damage;
        this.fireRate = fireRate;
        this.x = x;
        this.y = y;
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    // Method to render the tower on the canvas
    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'blue'; // Set the color of the tower
        ctx.beginPath();
        ctx.rect(this.x, this.y, 50, 50);
        ctx.fill();

        // Draw the range of the tower
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y + 25, this.range, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

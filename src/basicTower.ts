class BasicTower {
    public range: number;
    public damage: number;
    public fireRate: number;
    public lastFired: number = 0;
    public x: number;
    public y: number;
    public cost: number;
    public size: number;

    constructor(range: number, damage: number, fireRate: number, x: number, y: number, cost: number, size: number) {
        this.range = range;
        this.damage = damage;
        this.fireRate = fireRate;
        this.x = x;
        this.y = y;
        this.cost = cost;
        this.size = size;
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    // Method to render the tower on the canvas
    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'blue'; // Set the color of the tower
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size); // Draw the tower
        ctx.fill();

        // Draw the range of the tower
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.range, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

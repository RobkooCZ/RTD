class BasicTower {
    private range: number;
    private damage: number;
    private fireRate: number;
    private x: number;
    private y: number;

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
    }
}

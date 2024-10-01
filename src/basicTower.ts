class BasicTower {
    public range: number;
    public damage: number;
    public fireRate: number;
    public lastFired: number = 0;
    public x: number;
    public y: number;
    public cost: number;
    public size: number;
    public isClicked: boolean;
    public path1Upgrades: number = 0;
    public path2Upgrades: number = 0;
    private towerColor: string = 'blue';
    private towerColorWhenClicked: string = 'lightblue';

    constructor(range: number, damage: number, fireRate: number, x: number, y: number, cost: number, size: number, isClicked: boolean) {
        this.range = range;
        this.damage = damage;
        this.fireRate = fireRate;
        this.x = x;
        this.y = y;
        this.cost = cost;
        this.size = size;
        this.isClicked = isClicked;
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    public upgradePath1(): void {
        if (this.path1Upgrades === 0) {
            this.path1Upgrades++;
            this.fireRate *= 2;

            if (this.path1Upgrades === 1) {
                this.towerColor = 'red';
                this.towerColorWhenClicked = 'pink';
            }
        }
    }

    public upgradePath2(): void {
        if (this.path2Upgrades === 0) {
            this.path2Upgrades++;
            this.damage *= 2;
        }
    }

    // Method to render the tower on the canvas
    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.isClicked ? this.towerColorWhenClicked : this.towerColor;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size); // Draw the tower
        ctx.fill();

        // Draw the range of the tower
        ctx.strokeStyle = this.isClicked ? this.towerColorWhenClicked : this.towerColor;
        ctx.beginPath();
        ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.range, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

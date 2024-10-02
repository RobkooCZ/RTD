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
    private towerColor: string = 'black';
    private towerColorWhenClicked: string = 'gray';

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
        // Draw the base color (entire area)
        ctx.fillStyle = this.towerColor; // Use the normal tower color
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();
    
        // Draw the border around the tower
        ctx.strokeStyle = (this.path1Upgrades === 1) ? 'red' : 'white'; // Set color for the border
        ctx.lineWidth = 2; // Set line width for the border
    
        const borderOffset = 4; // Offset for the border
        ctx.beginPath();
        ctx.rect(
            this.x + borderOffset / 2, // Draw border starting x
            this.y + borderOffset / 2, // Draw border starting y
            this.size - borderOffset,   // Adjust width for the border
            this.size - borderOffset    
        );
        ctx.stroke();
    
        // Draw the clicked area precisely within the border
        if (this.isClicked) {
            ctx.fillStyle = this.towerColorWhenClicked; // Use the clicked color
            ctx.beginPath();
            ctx.rect(
                this.x + 2, // Start filling exactly at the inner edge of the border
                this.y + 2, // Start filling exactly at the inner edge of the border
                this.size - 4,   // Fill area should be the same size as the inner border
                this.size - 4    // Fill area should be the same size as the inner border
            );
            ctx.fill(); // Fill the area precisely aligned with the border
        }
    
        // Draw a small white square in the center of the fill
        const smallSquareSize = 5; // Size of the small white square
        const smallSquareX = this.x + (this.size - smallSquareSize) / 2; // Centered x position
        const smallSquareY = this.y + (this.size - smallSquareSize) / 2; // Centered y position
    
        ctx.fillStyle = (this.path2Upgrades === 1) ? 'red' : 'white'; // Set color for the small square
        ctx.fillRect(smallSquareX, smallSquareY, smallSquareSize, smallSquareSize); // Draw the small square
    
        // Draw the range of the tower with filling
        if (this.isClicked) {
            // Set the range color based on upgrades
            const rangeColor = (this.path1Upgrades === 1) ? 'red' : 'lightgray'; // Default to lightgray, red if upgraded
            ctx.fillStyle = rangeColor; // Set the fill style to the range color
            
            ctx.beginPath();
            ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.range, 0, 2 * Math.PI);
            ctx.globalAlpha = 0.3; // Set opacity for the filling
            ctx.fill(); // Fill the range area with the semi-transparent color
    
            ctx.globalAlpha = 1; // Reset opacity for further drawings
            ctx.strokeStyle = rangeColor; // Use the same color for the border
            ctx.beginPath();
            ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.range, 0, 2 * Math.PI);
            ctx.stroke(); // Draw the range outline
        }
    }
}
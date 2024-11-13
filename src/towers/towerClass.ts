abstract class Tower {
    public range: number;
    public damage: number;
    public fireRate: number;
    public lastFired: number = 0;
    public x: number;
    public y: number;
    public gridX: number;  // Add gridX to store tower's position in the grid
    public gridY: number;  // Add gridY to store tower's position in the grid
    public cost: number;
    public size: number;
    public isClicked: boolean;
    public path1Upgrades: number = 0;
    public path2Upgrades: number = 0;
    protected towerColor: string = 'black';
    protected towerColorWhenClicked: string = 'gray';
    public pierce = 1;
    public name: string = 'Tower'; // Name of the tower
    public UPGRADE_COSTS = {
        PATH1: [10, 100, 1000, 10000], // Default costs for Path 1
        PATH2: [15, 300, 1500, 15000]  // Default costs for Path 2
    };
    public sellValue: number = 1;
    public totalCost: number = 0;
    public damageDealt: number = 0;
    public enemiesKilled: number = 0;
    public armorPiercing: boolean = false;
    public towerOwner: string = 'Player';

    constructor(
        range: number, 
        damage: number, 
        fireRate: number, 
        x: number, 
        y: number, 
        cost: number, 
        size: number, 
        isClicked: boolean, 
        pierce: number, 
        name: string,
        UPGRADE_COSTS: { PATH1: number[], PATH2: number[] },
        sellValue: number = cost,
        totalCost: number = cost
    ) {
        this.range = range;
        this.damage = damage;
        this.fireRate = fireRate;
        this.x = x;
        this.y = y;
        this.gridX = -1;  // Set gridX from constructor
        this.gridY = -1;  // Set gridY from constructor
        this.cost = cost;
        this.size = size;
        this.isClicked = isClicked;
        this.pierce = pierce;
        this.name = name;
        this.UPGRADE_COSTS = UPGRADE_COSTS;
        this.sellValue = sellValue;
        this.totalCost = totalCost;
    }

    public setPositionInGrid(x: number, y: number, gridSize: number): void {
        this.gridX = Math.floor(x / gridSize); // Set the gridX coordinate
        this.gridY = Math.floor(y / gridSize); // Set the gridY coordinate
    }

    // Upgrade methods
    public upgradePath1(): void {
        this.path1Upgrades++;
    }

    public upgradePath2(): void {
        this.path2Upgrades++;
    }

    public calculateSellValue(){
        this.sellValue = Math.floor(this.totalCost * 0.85);
    }

    public modifyTotalCost(cost: number): void {
        this.totalCost += cost;
        this.calculateSellValue();
    }

    public sellTower(gameCash: number, tower: Tower, towerArray: Tower[], sellValue: number): number {
        gameCash += sellValue;
        towerArray.splice(towerArray.indexOf(tower), 1);
        return gameCash;
    }

    // Method to render the tower on the canvas
    public render(ctx: CanvasRenderingContext2D, size: number, x: number, y: number): void {
        this.size = size; // Set the size of the tower
        this.x = x;
        this.y = y;

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
    }

    public renderRange(ctx: CanvasRenderingContext2D): void {
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

    public returnCost(index: number, path: number) {
        if (path == 1){
            return this.UPGRADE_COSTS.PATH1[index];
        }
        else{
            return this.UPGRADE_COSTS.PATH2[index];
        }
    }

    public addDamageDealt(substract: number): void {
        this.damageDealt += this.damage - substract;
    }
    
    public addEnemyKilled(): void {
        this.enemiesKilled++;
    }
}
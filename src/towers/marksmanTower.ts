/**
 * Represents a Single Shot Tower in the game.
 * 
 * @extends Tower
 * 
 * @param {number} x - The x-coordinate of the tower's position.
 * @param {number} y - The y-coordinate of the tower's position.
 * @param {boolean} isClicked - Indicates whether the tower is clicked.
 * @param {number} gridSize - The size of the grid the tower resides in.
 * @param {number} pierce - The pierce value for this tower.
 * @param {number} gridX - The grid X-coordinate of the tower.
 * @param {number} gridY - The grid Y-coordinate of the tower.
 * 
*/

/// <reference path="towerClass.ts"/>

class MarksmanTower extends Tower {
    constructor(
        x: number, 
        y: number, 
        isClicked: boolean, 
        gridSize: number, 
        pierce: number,
        name: string,
        UPGRADE_COSTS = {
            PATH1: [100, 500, 1000, 10000], // Costs for Path 1
            PATH2: [150, 450, 750, 12500]  // Costs for Path 2
        },
        sellValue: number = 0,
        totalCost: number = 100,
        armorPiercing: boolean = false,
    ) {
        // Call the parent constructor with correctly ordered values
        super(150, 5, 1, x, y, 100, gridSize, isClicked, pierce, name, UPGRADE_COSTS, sellValue, totalCost);
    }

    public override upgradePath1(): void {
        if (this.path1Upgrades === 0) {
            this.damage += 3;
            this.pierce += 1;
        }
        else if (this.path1Upgrades === 1) {
            this.damage += 2;
            this.pierce += 1;
            this.armorPiercing = true;
        }
        else if (this.path1Upgrades === 2) {
            this.damage += 10;
            this.pierce += 2;
        }
        else if (this.path1Upgrades === 3) {
            this.damage += 15;
            this.pierce += 2;
        }

        this.path1Upgrades++;
    }

    public override upgradePath2(): void {
        if (this.path2Upgrades === 0) {
            this.fireRate += 0.5;
            this.range += 50;
        }
        else if (this.path2Upgrades === 1) {
            this.fireRate += 0.5;
            this.range += 50;
        }
        else if (this.path2Upgrades === 2) {
            this.fireRate += 3;
        }
        else if (this.path2Upgrades === 3) {
            this.fireRate += 5;
        }

        this.path2Upgrades++;
    }

    public override render(ctx: CanvasRenderingContext2D, size: number, x: number, y: number): void {
        this.size = size; // Set the size of the tower
        this.x = x;
        this.y = y;

        // Draw the base color (entire area)
        ctx.fillStyle = this.towerColor; // Use the normal tower color
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();

        // Draw the border around the tower
        if (this.path1Upgrades === 1) {
            ctx.strokeStyle = 'red'; // Set color for the border
        }else if (this.path1Upgrades === 2) {
            ctx.strokeStyle = 'purple'; // Set color for the border
        }else if (this.path1Upgrades === 3) {
            ctx.strokeStyle = 'blue'; // Set color for the border
        }else if (this.path1Upgrades === 4) {
            ctx.strokeStyle = 'green'; // Set color for the border
        }else {
            ctx.strokeStyle = 'white'; // Set color for the border
        }
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

        if (this.path2Upgrades === 1) {
            ctx.fillStyle = 'red'; // Set color
        }else if (this.path2Upgrades === 2) {
            ctx.fillStyle = 'purple'; // Set color
        }else if (this.path2Upgrades === 3) {
            ctx.fillStyle = 'blue'; // Set color
        }else if (this.path2Upgrades === 4) {
            ctx.fillStyle = 'green'; // Set color
        }else {
            ctx.fillStyle = 'white'; // Set color
        }
        ctx.fillRect(smallSquareX, smallSquareY, smallSquareSize, smallSquareSize); // Draw the small square
    }

    public renderRange(ctx: CanvasRenderingContext2D): void {
        // Draw the range of the tower with filling
        if (this.isClicked) {
            // Set the range color based on upgrades
            let rangeColor: string;

            if (this.path1Upgrades === 1) {
                rangeColor = 'pink'; // Set color for the border
            }else if (this.path1Upgrades === 2) {
                rangeColor = 'violet'; // Set color for the border
            }else if (this.path1Upgrades === 3) {
                rangeColor = 'lightblue'; // Set color for the border
            }else if (this.path1Upgrades === 4) {
                rangeColor = 'lightgreen'; // Set color for the border
            }else {
                rangeColor = 'white'; // Set color for the border
            }

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

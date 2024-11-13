/**
 * Represents a Minigun Tower in the game.
 * 
 * @extends Tower
 * 
 * @param {number} x - The x-coordinate of the tower's position.
 * @param {number} y - The y-coordinate of the tower's position.
 * @param {boolean} isClicked - Indicates whether the tower is clicked.
 * 
 * 
 * @reference path="towerClass.ts"
 */
/// <reference path="towerClass.ts"/>

class minigunTower extends Tower {
    constructor(
        x: number, 
        y: number, 
        isClicked: boolean, 
        gridSize: number, 
        pierce: number,
        name: string,
        UPGRADE_COSTS = {
            PATH1: [150, 750, 1500, 7500], // Costs for Path 1
            PATH2: [100, 1000, 5000, 10000]  // Costs for Path 2
        },
        sellValue: number = 0,
        totalCost: number = 125,
        armorPiercing: boolean = false
    ) {
        // Call the parent constructor with specific values for MinigunTower
        super(100, 2, 10, x, y, 100, gridSize, isClicked, pierce, name, UPGRADE_COSTS, sellValue, totalCost);
    }

    public override render(ctx: CanvasRenderingContext2D, size: number): void {
        // Draw the base color (entire area)
        this.size = size;
        ctx.fillStyle = this.towerColor; // Use the normal tower color
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();

        // Draw the border around the tower
        switch (this.path1Upgrades) {
            case 1:
                ctx.strokeStyle = this.towerOwner === getSocketID() ? 'rgba(255, 0, 0, 1)' : 'rgba(255, 0, 0, 0.3)'; // Red color
                break;
            case 2:
                ctx.strokeStyle = this.towerOwner === getSocketID() ? 'rgba(128, 0, 128, 1)' : 'rgba(128, 0, 128, 0.3)'; // Purple color
                break;
            case 3:
                ctx.strokeStyle = this.towerOwner === getSocketID() ? 'rgba(0, 0, 255, 1)' : 'rgba(0, 0, 255, 0.3)'; // Blue color
                break;
            case 4:
                ctx.strokeStyle = this.towerOwner === getSocketID() ? 'rgba(0, 128, 0, 1)' : 'rgba(0, 128, 0, 0.3)'; // Green color
                break;
            default:
                ctx.strokeStyle = this.towerOwner === getSocketID() ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.3)'; // White color
                break;
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
        const smallSquareSize = 10; // Size of the small white square
        const smallSquareX = this.x + (this.size - smallSquareSize) / 2; // Centered x position
        const smallSquareY = this.y + (this.size - smallSquareSize) / 2; // Centered y position

        switch (this.path2Upgrades) {
            case 1:
                ctx.fillStyle = this.towerOwner === getSocketID() ? 'rgba(255, 0, 0, 1)' : 'rgba(255, 0, 0, 0.3)'; // Red color
                break;
            case 2:
                ctx.fillStyle = this.towerOwner === getSocketID() ? 'rgba(128, 0, 128, 1)' : 'rgba(128, 0, 128, 0.3)'; // Purple color
                break;
            case 3:
                ctx.fillStyle = this.towerOwner === getSocketID() ? 'rgba(0, 0, 255, 1)' : 'rgba(0, 0, 255, 0.3)'; // Blue color
                break;
            case 4:
                ctx.fillStyle = this.towerOwner === getSocketID() ? 'rgba(0, 128, 0, 1)' : 'rgba(0, 128, 0, 0.3)'; // Green color
                break;
            default:
                ctx.fillStyle = this.towerOwner === getSocketID() ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.3)'; // White color
                break;
        }

        ctx.fillRect(smallSquareX, smallSquareY, smallSquareSize, smallSquareSize); // Draw the small square
    }

    public override renderRange(ctx: CanvasRenderingContext2D): void {
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

    public override upgradePath1(): void {
        if (this.path1Upgrades === 0) {
            this.damage += 3;
            this.pierce += 1;
        }
        else if (this.path1Upgrades === 1) {
            this.damage += 2;
            this.pierce += 1;
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
}
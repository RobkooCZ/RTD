"use strict";
class BasicEnemy {
    speed;
    x;
    y;
    size; // Size of the enemy
    constructor(speed, x, y) {
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.size = 25; // Define the size of the enemy
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    // Method to render the enemy on the canvas
    render(ctx) {
        ctx.fillStyle = 'white'; // Set the color of the enemy
        ctx.beginPath();
        // Center the enemy in the grid cell
        const centeredX = this.x + (50 - this.size) / 2; // Assuming each grid cell is 50x50
        const centeredY = this.y + (50 - this.size) / 2; // Center it vertically
        ctx.rect(centeredX, centeredY, this.size, this.size); // Draw the enemy
        ctx.fill();
    }
    // Method to erase the enemy (draws over its previous position)
    erase(ctx) {
        ctx.fillStyle = 'brown'; // Assuming the background is brown
        const centeredX = this.x + (50 - this.size) / 2; // Centered X
        const centeredY = this.y + (50 - this.size) / 2; // Centered Y
        ctx.fillRect(centeredX, centeredY, this.size, this.size); // Draw over to "erase"
    }
}
class BasicTower {
    range;
    damage;
    fireRate;
    x;
    y;
    constructor(range, damage, fireRate, x, y) {
        this.range = range;
        this.damage = damage;
        this.fireRate = fireRate;
        this.x = x;
        this.y = y;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    // Method to render the tower on the canvas
    render(ctx) {
        ctx.fillStyle = 'blue'; // Set the color of the tower
        ctx.beginPath();
        ctx.rect(this.x, this.y, 50, 50);
        ctx.fill();
    }
}
const message = 'Basic map and tower render';
document.body.innerHTML = `<h1>${message}</h1>`;
/// <reference path="basicTower.ts" />
/// <reference path="basicEnemy.ts" />
document.addEventListener('DOMContentLoaded', () => {
    const map = [
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
    ];
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    let cursorX = 0;
    let cursorY = 0;
    const rectSize = 50; // Size of each grid cell
    document.addEventListener('mousemove', (event) => {
        cursorX = event.clientX - 32; // Adjust cursor position
        cursorY = event.clientY - 100; // Adjust cursor position
    });
    // Function to snap coordinates to the nearest grid point
    function snapToGrid(value) {
        return Math.round(value / rectSize) * rectSize;
    }
    document.addEventListener('keydown', (event) => {
        if (event.key === 'e') {
            // Snap cursor coordinates to the grid
            const snappedX = snapToGrid(cursorX);
            const snappedY = snapToGrid(cursorY);
            // Determine the grid position based on snapped coordinates
            const gridX = snappedX / rectSize; // Column index
            const gridY = snappedY / rectSize; // Row index
            // Check if the position is valid for tower placement
            if (gridY >= 0 && gridY < map.length && gridX >= 0 && gridX < map[0].length) {
                if (map[gridY][gridX] === 0) { // Valid placement check (0 means free)
                    const tower = new BasicTower(50, 10, 1, snappedX, snappedY);
                    if (ctx) {
                        tower.render(ctx); // Render the tower
                    }
                    console.log(`Tower placed at (${snappedX}, ${snappedY})`); // Debugging statement
                }
                else {
                    console.log('Tower not placed: Invalid position (path)');
                }
            }
            else {
                console.log('Tower not placed: Out of map bounds');
            }
        }
    });
    // Create and render the enemy
    const basicEnemy = new BasicEnemy(1, 350, 450); // Example enemy initialization
    // Render the map and then the enemy
    if (ctx) {
        // Render the map first
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                ctx.fillStyle = map[i][j] === 1 ? 'brown' : 'green';
                ctx.fillRect(j * rectSize, i * rectSize, rectSize, rectSize);
            }
        }
        // Then render the enemy
        basicEnemy.render(ctx);
        let enemyPositionX = basicEnemy.x;
        let enemyPositionY = basicEnemy.y;
        let gridX = enemyPositionX / rectSize;
        let gridY = enemyPositionY / rectSize;
        let lastGridX = -1; // Initialize last grid position
        let lastGridY = -1; // Initialize last grid position
        setInterval(() => {
            // Calculate the grid position based on the current enemy position
            const gridX = Math.floor(enemyPositionX / rectSize);
            const gridY = Math.floor(enemyPositionY / rectSize);
            // Check if the enemy can move right
            if (gridY >= 0 && gridY < map.length &&
                gridX + 1 >= 0 && gridX + 1 < map[gridY].length &&
                map[gridY][gridX + 1] === 1 && (lastGridX !== gridX + 1 || lastGridY !== gridY)) {
                basicEnemy.erase(ctx);
                enemyPositionX += rectSize; // Move right
                basicEnemy.setPosition(enemyPositionX, enemyPositionY);
                basicEnemy.render(ctx);
                // Update the last position
                lastGridX = gridX;
                lastGridY = gridY;
            }
            // Check if the enemy can move left
            else if (gridY >= 0 && gridY < map.length &&
                gridX - 1 >= 0 && gridX - 1 < map[gridY].length &&
                map[gridY][gridX - 1] === 1 && (lastGridX !== gridX - 1 || lastGridY !== gridY)) {
                basicEnemy.erase(ctx);
                enemyPositionX -= rectSize; // Move left
                basicEnemy.setPosition(enemyPositionX, enemyPositionY);
                basicEnemy.render(ctx);
                // Update the last position
                lastGridX = gridX;
                lastGridY = gridY;
            }
            // Check if the enemy can move down
            else if (gridY + 1 < map.length &&
                gridX >= 0 && gridX < map[gridY + 1].length &&
                map[gridY + 1][gridX] === 1 && (lastGridX !== gridX || lastGridY !== gridY + 1)) {
                basicEnemy.erase(ctx);
                enemyPositionY += rectSize; // Move down
                basicEnemy.setPosition(enemyPositionX, enemyPositionY);
                basicEnemy.render(ctx);
                // Update the last position
                lastGridX = gridX;
                lastGridY = gridY;
            }
            // Check if the enemy can move up
            else if (gridY - 1 >= 0 &&
                gridX >= 0 && gridX < map[gridY - 1].length &&
                map[gridY - 1][gridX] === 1 && (lastGridX !== gridX || lastGridY !== gridY - 1)) {
                basicEnemy.erase(ctx);
                enemyPositionY -= rectSize; // Move up
                basicEnemy.setPosition(enemyPositionX, enemyPositionY);
                basicEnemy.render(ctx);
                // Update the last position
                lastGridX = gridX;
                lastGridY = gridY;
            }
        }, 1000);
    }
    else {
        console.error("Canvas context is not available");
    }
});

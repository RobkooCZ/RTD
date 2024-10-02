"use strict";
class BasicBullet {
    damage;
    x; // Current position of the bullet
    y; // Current position of the bullet
    targetX; // Target position (center of the enemy)
    targetY; // Target position (center of the enemy)
    towerSize;
    enemySize;
    towerUpgrade;
    pierce;
    size = 12.5; // Size of the bullet
    constructor(damage, towerX, towerY, enemyX, enemyY, towerSize, enemySize, towerUpgrade, pierce) {
        this.damage = damage;
        this.towerSize = towerSize;
        this.enemySize = enemySize;
        this.x = towerX + (this.towerSize - 10) / 2; // Center the bullet in the tower
        this.y = towerY + (this.towerSize - 10) / 2;
        this.targetX = enemyX + (this.enemySize - 10) / 2; // Center the bullet in the enemy
        this.targetY = enemyY + (this.enemySize - 10) / 2;
        this.towerUpgrade = towerUpgrade;
        this.pierce = pierce;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    // Method to render the bullet on the canvas
    render(ctx) {
        ctx.fillStyle = 'black'; // Set fill style for the bullet
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();
        // Draw the border around the tower
        ctx.strokeStyle = 'white'; // Set color for the border
        ctx.lineWidth = 2; // Set line width for the border
        const borderOffset = 4; // Offset for the border
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.stroke();
        // Draw a small white square in the center of the fill
        const smallSquareSize = 2; // Size of the small white square
        const smallSquareX = this.x + (this.size - smallSquareSize) / 2; // Centered x position
        const smallSquareY = this.y + (this.size - smallSquareSize) / 2; // Centered y position
        if (this.towerUpgrade == 1) {
            ctx.fillStyle = 'red';
        }
        else {
            ctx.fillStyle = 'white'; // Set color for the small square
        }
        ctx.fillRect(smallSquareX, smallSquareY, smallSquareSize, smallSquareSize); // Draw the small square
    }
    move(enemies, ctx) {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        if (magnitude === 0) {
            return; // Already at target position, exit the function
        }
        const speed = 10;
        // Calculate normalized direction vector
        const directionX = dx / magnitude;
        const directionY = dy / magnitude;
        // Update position
        this.x += directionX * speed;
        this.y += directionY * speed;
        // Check for overshooting and snap to target if necessary
        const distToTarget = Math.sqrt((this.targetX - this.x) ** 2 + (this.targetY - this.y) ** 2);
        if (distToTarget < speed) {
            this.x = this.targetX;
            this.y = this.targetY;
        }
        // Check for collision with enemies
        enemies.forEach((enemy, index) => {
            const enemyCenterX = enemy.x + (this.enemySize - 10) / 2; // Center of the enemy
            const enemyCenterY = enemy.y + (this.enemySize - 10) / 2; // Center of the enemy
            if (this.x >= enemyCenterX - 12.5 && this.x <= enemyCenterX + 12.5 &&
                this.y >= enemyCenterY - 12.5 && this.y <= enemyCenterY + 12.5) {
                // Collision detected
                enemy.takeDamage(this.damage); // Apply damage to the enemy
                this.x = -10; // Move bullet off screen or similar (could also remove from array)
            }
        });
        this.render(ctx);
    }
    isOutOfBounds(canvasWidth, canvasHeight) {
        return this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight;
    }
}
class BasicEnemy {
    x;
    y;
    speed;
    health;
    size; // Size of the enemy
    gridSize;
    constructor(speed, x, y, health, size, gridSize) {
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.health = health; // Initialize health
        this.size = size; // Initialize size
        this.gridSize = gridSize;
    }
    // Method to apply damage to the enemy
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0; // Prevent negative health
            // Additional logic for enemy death can go here
        }
    }
    // Method to render the enemy on the canvas
    render(ctx) {
        // Calculate the color based on health
        const healthPercentage = Math.max(0, Math.min(100, this.health));
        const red = Math.floor(255 * (1 - healthPercentage / 100)); // R component from 0 (black) to 255 (white)
        const green = Math.floor(255 * (1 - healthPercentage / 100)); // G component from 0 (black) to 255 (white)
        const blue = Math.floor(255 * (1 - healthPercentage / 100)); // B component from 0 (black) to 255 (white)
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`; // Set fill style based on health
        ctx.beginPath();
        // Center the enemy in the grid cell
        const centeredX = this.x + (this.gridSize - this.size) / 2; // Center it horizontally
        const centeredY = this.y + (this.gridSize - this.size) / 2; // Center it vertically
        ctx.rect(centeredX, centeredY, this.size, this.size); // Draw the enemy
        ctx.fill();
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}
class BasicTower {
    range;
    damage;
    fireRate;
    lastFired = 0;
    x;
    y;
    cost;
    size;
    isClicked;
    path1Upgrades = 0;
    path2Upgrades = 0;
    towerColor = 'black';
    towerColorWhenClicked = 'gray';
    constructor(range, damage, fireRate, x, y, cost, size, isClicked) {
        this.range = range;
        this.damage = damage;
        this.fireRate = fireRate;
        this.x = x;
        this.y = y;
        this.cost = cost;
        this.size = size;
        this.isClicked = isClicked;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    upgradePath1() {
        if (this.path1Upgrades === 0) {
            this.path1Upgrades++;
            this.fireRate *= 2;
        }
    }
    upgradePath2() {
        if (this.path2Upgrades === 0) {
            this.path2Upgrades++;
            this.damage *= 2;
        }
    }
    // Method to render the tower on the canvas
    render(ctx) {
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
        ctx.rect(this.x + borderOffset / 2, // Draw border starting x
        this.y + borderOffset / 2, // Draw border starting y
        this.size - borderOffset, // Adjust width for the border
        this.size - borderOffset);
        ctx.stroke();
        // Draw the clicked area precisely within the border
        if (this.isClicked) {
            ctx.fillStyle = this.towerColorWhenClicked; // Use the clicked color
            ctx.beginPath();
            ctx.rect(this.x + 2, // Start filling exactly at the inner edge of the border
            this.y + 2, // Start filling exactly at the inner edge of the border
            this.size - 4, // Fill area should be the same size as the inner border
            this.size - 4 // Fill area should be the same size as the inner border
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
const enemyWaves = [
    { waveNumber: 1, enemyCount: 10, timeBetweenEnemies: 2, waveSent: false },
    { waveNumber: 2, enemyCount: 20, timeBetweenEnemies: 2, waveSent: false },
    { waveNumber: 3, enemyCount: 25, timeBetweenEnemies: 1, waveSent: false },
    { waveNumber: 4, enemyCount: 30, timeBetweenEnemies: 0.5, waveSent: false },
    { waveNumber: 5, enemyCount: 60, timeBetweenEnemies: 1, waveSent: false },
    { waveNumber: 6, enemyCount: 20, timeBetweenEnemies: 0.25, waveSent: false },
    { waveNumber: 7, enemyCount: 100, timeBetweenEnemies: 0.75, waveSent: false },
    { waveNumber: 8, enemyCount: 80, timeBetweenEnemies: 0.75, waveSent: false },
    { waveNumber: 9, enemyCount: 100, timeBetweenEnemies: 0.5, waveSent: false },
    { waveNumber: 10, enemyCount: 100, timeBetweenEnemies: 0.25, waveSent: false },
];
class gameMap {
    map; // 2D array to store the map
    enemyPath; // Array to store the path the enemies will take
    name;
    constructor(map, enemyPath, name) {
        this.map = map;
        this.enemyPath = enemyPath;
        this.name = name;
    }
}
/// <reference path="gameMap.ts" />
const basicMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
];
const basicMapPath = [
    { x: 50, y: 300 }, //first straight 
    { x: 100, y: 300 },
    { x: 150, y: 300 },
    { x: 200, y: 300 },
    { x: 250, y: 300 },
    { x: 300, y: 300 },
    { x: 350, y: 300 },
    { x: 400, y: 300 },
    { x: 450, y: 300 },
    { x: 450, y: 250 }, //straight up
    { x: 450, y: 200 },
    { x: 450, y: 150 },
    { x: 450, y: 100 },
    { x: 450, y: 50 },
    { x: 400, y: 50 }, // straight left
    { x: 350, y: 50 },
    { x: 300, y: 50 },
    { x: 250, y: 50 },
    { x: 200, y: 50 },
    { x: 200, y: 100 }, // straight down
    { x: 200, y: 150 },
    { x: 200, y: 200 },
    { x: 200, y: 250 },
    { x: 200, y: 300 },
    { x: 200, y: 350 },
    { x: 200, y: 400 },
    { x: 200, y: 450 },
    { x: 200, y: 500 },
    { x: 200, y: 550 },
    { x: 200, y: 600 },
    { x: 200, y: 650 },
    { x: 200, y: 700 },
    { x: 200, y: 750 },
    { x: 150, y: 750 }, // straight left
    { x: 100, y: 750 },
    { x: 50, y: 750 },
    { x: 50, y: 700 }, // straight up
    { x: 50, y: 650 },
    { x: 50, y: 600 },
    { x: 50, y: 550 },
    { x: 100, y: 550 }, // straight right
    { x: 150, y: 550 },
    { x: 200, y: 550 },
    { x: 250, y: 550 },
    { x: 300, y: 550 },
    { x: 350, y: 550 },
    { x: 400, y: 550 },
    { x: 450, y: 550 },
    { x: 500, y: 550 },
    { x: 550, y: 550 },
    { x: 600, y: 550 },
    { x: 650, y: 550 },
    { x: 700, y: 550 },
    { x: 750, y: 550 },
    { x: 800, y: 550 },
    { x: 850, y: 550 },
    { x: 900, y: 550 },
    { x: 950, y: 550 },
    { x: 950, y: 500 }, // straight up
    { x: 950, y: 450 },
    { x: 950, y: 400 },
    { x: 950, y: 350 },
    { x: 950, y: 300 },
    { x: 950, y: 250 },
    { x: 1000, y: 250 }, // straight right
    { x: 1050, y: 250 },
    { x: 1100, y: 250 },
    { x: 1150, y: 250 },
    { x: 1150, y: 300 }, // straight down
    { x: 1150, y: 350 },
    { x: 1150, y: 400 },
    { x: 1150, y: 450 },
    { x: 1150, y: 500 },
    { x: 1150, y: 550 },
    { x: 1150, y: 600 },
    { x: 1150, y: 650 },
    { x: 1150, y: 700 },
    { x: 1150, y: 750 },
    { x: 1150, y: 800 },
    { x: 1150, y: 850 },
];
const easyMap = [
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
];
const easyMapPath = [
    { x: 350, y: 450 },
    { x: 350, y: 400 },
    { x: 350, y: 350 },
    { x: 350, y: 300 },
    { x: 350, y: 250 },
    { x: 350, y: 200 },
    { x: 300, y: 200 },
    { x: 250, y: 200 },
    { x: 200, y: 200 },
    { x: 150, y: 200 },
    { x: 100, y: 200 },
    { x: 100, y: 250 },
    { x: 100, y: 300 },
    { x: 100, y: 350 },
    { x: 150, y: 350 },
    { x: 200, y: 350 },
    { x: 250, y: 350 },
    { x: 250, y: 300 },
    { x: 250, y: 250 },
    { x: 250, y: 200 },
    { x: 250, y: 150 },
    { x: 250, y: 100 },
    { x: 250, y: 50 },
    { x: 250, y: 0 },
];
/// <reference path="basicTower.ts" />
/// <reference path="basicEnemy.ts" />
/// <reference path="basicBullet.ts" />
/// <reference path="waves.ts" />
/// <reference path="maps/maps.ts" />
// Create the master container for game stats
const gameStats = document.createElement('div');
gameStats.id = "gameStats";
const bottomContainer = document.getElementById('bottomContainer');
const rightContainer = document.getElementById('rightContainer');
// Create the first H2 element with a red outline around each letter
const h2Red = document.createElement('h2');
h2Red.id = 'h2Red';
// Create the second H2 element with a green outline around each letter
const h2Green = document.createElement('h2');
h2Green.id = 'h2Green';
// Create a third H2 element with a blue outline around each letter
const h2Blue = document.createElement('h2');
h2Blue.id = 'h2Blue';
h2Blue.innerText = `Press E to start!`;
// Append the H2 elements to the gameStats container
gameStats.appendChild(h2Red);
gameStats.appendChild(h2Green);
gameStats.appendChild(h2Blue);
// Append gameStats to the rightContainer
if (rightContainer) {
    rightContainer.appendChild(gameStats);
}
// Append the two H2 elements to the gameStats container
gameStats.appendChild(h2Red);
gameStats.appendChild(h2Green);
gameStats.appendChild(h2Blue);
// Append the gameStats container to the document body
if (rightContainer)
    rightContainer.appendChild(gameStats);
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mapCanvas');
    let rectSize = 50; // Size of each grid cell, this is the default
    let towerSize = 50; // Size of each tower, this is the default
    let enemySize = 25; // Size of each enemy, this is the default
    /**
     * Rounds a given value to the nearest multiple of the specified average.
     *
     * @param value - The number to be rounded.
     * @param average - The average or multiple to which the value should be rounded.
     * @returns The value rounded to the nearest multiple of the average.
     */
    function averageToNumber(value, average) {
        return Math.round(value / average) * average;
    }
    // Set initial canvas size and grid cell size
    canvas.width = averageToNumber((window.innerWidth / 100) * 78.125, 10);
    canvas.height = averageToNumber((window.innerHeight / 100) * 83.333, 10);
    rectSize = canvas.width / 30; // Update the size of each grid cell
    towerSize = rectSize; // Update the size of each tower
    enemySize = rectSize / 2; // Update the size of each enemy
    window.addEventListener('resize', () => {
        canvas.width = averageToNumber((window.innerWidth / 100) * 78.125, 10);
        canvas.height = averageToNumber((window.innerHeight / 100) * 83.333, 10);
        rectSize = canvas.width / 30; // Update the size of each grid cell
        towerSize = rectSize; // Update the size of each tower
        enemySize = rectSize / 2; // Update the size of each enemy
    });
    const ctx = canvas.getContext('2d');
    let towerArray = []; // Array to store the towers
    let bullets = []; // Array to store bullets
    let enemies = []; // Array to store enemies
    let currentPathIndex = []; // Array to track path indices for multiple enemies
    let damage = 10;
    let fireRate = 2;
    let health = 100;
    let GameHealth = 100;
    let gameCash = 1000;
    let towerCost = 100;
    let gameLost = false;
    let currentMapIndex = 0; // Index to track selected map
    let maps = []; // Array to store multiple maps
    let currentMap = []; // Currently selected map grid
    let currentMapPath = []; // Currently selected map path
    let selectedMap = localStorage.getItem('selectedMap'); // Get the selected map from the main menu
    let selectedGamemode = localStorage.getItem('selectedGamemode'); //  Get the selected gamemode from the main menu
    let wavesStart = false;
    let enemyPaths = []; // Array to store enemy paths
    let towerSelected = false;
    let activeEnemiesCount = 0; // Track the number of active enemies
    if (selectedGamemode == "sandbox")
        h2Blue.innerText = `Press E to spawn enemies!`;
    h2Blue.style.fontSize = '3vh';
    enemyPaths.push(basicMapPath); // add all enemy paths to an array for easy coding later
    enemyPaths.push(easyMapPath);
    enemyPaths.forEach(path => {
        path.forEach(point => {
            point.x = point.x / 50 * rectSize;
            point.y = point.y / 50 * rectSize;
        });
    });
    // Add maps to the array
    maps.push(new gameMap(basicMap, basicMapPath, 'Basic Map'));
    maps.push(new gameMap(easyMap, easyMapPath, 'Easy Map'));
    if (selectedMap === 'basicMap') {
        currentMapIndex = 0;
    }
    else if (selectedMap === 'easyMap') {
        currentMapIndex = 1;
    }
    currentMap = maps[currentMapIndex].map;
    currentMapPath = maps[currentMapIndex].enemyPath;
    function updateStatistics() {
        h2Red.innerText = `Health: ${GameHealth}`;
        h2Green.innerText = `Cash: $${gameCash}`;
    }
    updateStatistics(); // show the initial statistics
    let cursorX = 0; // Initialize cursorX
    let cursorY = 0; // Initialize cursorY
    // Mouse movement for cursor position
    document.addEventListener('mousemove', (event) => {
        cursorX = event.clientX - 24; // Adjust cursor position
        cursorY = event.clientY - 25; // Adjust cursor position
    });
    // Function to snap coordinates to the nearest grid point
    function snapToGrid(value) {
        return Math.round(value / rectSize) * rectSize;
    }
    // toggle to spawn a tower
    document.addEventListener('keydown', (event) => {
        if (event.key === 't' || event.key === 'T') {
            const snappedX = snapToGrid(cursorX);
            const snappedY = snapToGrid(cursorY);
            const gridX = snappedX / rectSize; // Column index
            const gridY = snappedY / rectSize; // Row index
            console.log(`Tower trying to be placed at: X: ${gridX}, Y: ${gridY}`);
            if (gameCash >= towerCost) {
                // Check if the position is valid for tower placement
                if (gridY >= 0 && gridY < currentMap.length && gridX >= 0 && gridX < currentMap[0].length) {
                    if (currentMap[gridY][gridX] === 0) { // Valid placement check (0 means free)
                        // Check if a tower already exists at this grid position
                        if (!towerArray.some(tower => tower.x === snappedX && tower.y === snappedY)) {
                            gameCash -= towerCost; // Deduct the tower cost from the cash
                            updateStatistics();
                            const tower = new BasicTower(125, damage, fireRate, snappedX, snappedY, towerCost, towerSize, false);
                            towerArray.push(tower); // Add the tower to the array
                            if (ctx) {
                                tower.render(ctx); // Render the tower
                            }
                        }
                        else {
                            console.log('Tower not placed: A tower already exists at this position.');
                        }
                    }
                    else {
                        console.log('Tower not placed: Invalid position (path)');
                    }
                }
                else {
                    console.log('Tower not placed: Out of map bounds');
                }
            }
        }
    });
    // toggle to reset the game
    document.addEventListener('keydown', (event) => {
        if (event.key === 'r' || event.key === 'R') {
            towerArray = []; // Reset the tower array
            bullets = []; // Reset the bullets array
            enemies = []; // Reset the enemies array
            currentPathIndex = []; // Reset the path index for enemies
            GameHealth = 100; // Reset the game health
            gameCash = 1000; // Reset the game cash
            gameLost = false; // Reset the game lost flag
            wavesStart = false;
            updateStatistics();
            h2Blue.innerText = `Press E to Start!`;
        }
    });
    // toggle to let the enemy move
    document.addEventListener('keydown', (event) => {
        if (event.key === 'e' || event.key === 'E') {
            if (selectedGamemode == "waves") {
                wavesStart = true;
            }
            else if (selectedGamemode == "sandbox") {
                spawnEnemy(); // Spawn a new enemy
            }
        }
    });
    const upgradeContainer = document.createElement('div');
    upgradeContainer.id = 'upgradeContainer';
    // Create the first button
    const upgradeButtonPath1 = document.createElement('button');
    upgradeButtonPath1.innerText = `Please select a tower to upgrade it.`;
    upgradeButtonPath1.id = 'upgradeButtonPath1';
    // Create the second button
    const upgradeButtonPath2 = document.createElement('button');
    upgradeButtonPath2.innerText = `Please select a tower to upgrade it.`;
    upgradeButtonPath2.id = 'upgradeButtonPath2';
    // Add both buttons to the container
    upgradeContainer.appendChild(upgradeButtonPath1);
    upgradeContainer.appendChild(upgradeButtonPath2);
    // Append the container to the body
    if (bottomContainer)
        bottomContainer.appendChild(upgradeContainer);
    let currentSelectedTower = null;
    canvas.addEventListener('mousedown', (event) => {
        let rect = canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;
        let isTowerClicked = false;
        // Deselect previously selected tower
        if (currentSelectedTower) {
            currentSelectedTower.isClicked = false;
            towerSelected = false;
            currentSelectedTower = null;
        }
        // Loop through towers to check which one is clicked
        for (let index = 0; index < towerArray.length; index++) {
            const tower = towerArray[index];
            if (mouseX >= tower.x && mouseX <= tower.x + towerSize &&
                mouseY >= tower.y && mouseY <= tower.y + towerSize) {
                // Set this tower as selected
                tower.isClicked = true;
                towerSelected = true;
                currentSelectedTower = tower;
                isTowerClicked = true;
                // Update the upgrade buttons
                const updateButton = (button, pathUpgrades, upgradeText) => {
                    if (pathUpgrades === 1) {
                        button.innerText = "FULLY UPGRADED";
                    }
                    else {
                        button.innerText = upgradeText;
                    }
                };
                updateButton(upgradeButtonPath1, currentSelectedTower.path1Upgrades, 'Upgrade Firerate ($75)');
                updateButton(upgradeButtonPath2, currentSelectedTower.path2Upgrades, 'Upgrade Damage ($100)');
                if (ctx)
                    tower.render(ctx);
            }
        }
        // If no tower is clicked, reset the upgrade buttons
        if (!isTowerClicked) {
            upgradeButtonPath1.innerText = `Please select a tower to upgrade it.`;
            upgradeButtonPath2.innerText = `Please select a tower to upgrade it.`;
            currentSelectedTower = null;
        }
    });
    // Event listener for upgrading the tower (add this only once)
    upgradeButtonPath1.addEventListener('click', () => {
        if (gameCash > 75) {
            if (currentSelectedTower && currentSelectedTower.path1Upgrades !== 1) {
                gameCash -= 75;
                updateStatistics();
                currentSelectedTower.upgradePath1();
                upgradeButtonPath1.innerText = "FULLY UPGRADED";
            }
        }
        else {
            upgradeButtonPath1.innerText = "NOT ENOUGH MONEY";
            setTimeout(() => {
                upgradeButtonPath1.innerText = "Upgrade Firerate";
            }, 1500);
        }
    });
    upgradeButtonPath2.addEventListener('click', () => {
        if (gameCash > 100) {
            if (currentSelectedTower && currentSelectedTower.path2Upgrades !== 1) {
                gameCash -= 100;
                updateStatistics();
                currentSelectedTower.upgradePath2();
                upgradeButtonPath2.innerText = "FULLY UPGRADED";
            }
        }
        else {
            upgradeButtonPath2.innerText = "NOT ENOUGH MONEY";
            setTimeout(() => {
                upgradeButtonPath2.innerText = "Upgrade Damage";
            }, 1500);
        }
    });
    // Initial rendering of the map
    function renderMap() {
        if (ctx) {
            for (let i = 0; i < currentMap.length; i++) {
                for (let j = 0; j < currentMap[i].length; j++) {
                    ctx.fillStyle = currentMap[i][j] === 1 ? 'white' : 'black';
                    ctx.fillRect(j * rectSize, i * rectSize, rectSize, rectSize);
                }
            }
        }
    }
    function spawnEnemy() {
        // Create a new enemy at the start position and push it into the enemies array
        if (selectedMap === 'basicMap') {
            const newEnemy = new BasicEnemy(0.5, 0, 300 / 50 * rectSize, health, enemySize, rectSize);
            enemies.push(newEnemy);
        }
        else if (selectedMap === 'easyMap') {
            const newEnemy = new BasicEnemy(0.5, 350 / 50 * rectSize, 500 / 50 * rectSize, health, enemySize, rectSize);
            enemies.push(newEnemy);
        }
        currentPathIndex.push(0); // Start at the beginning of the path for this enemy
    }
    // Start rendering and movement
    function gameLoop(timestamp) {
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            renderMap(); // Render the map
            if (wavesStart) {
                let enemyWavesIndex = 0; // First wave
                const spawnNextWave = () => {
                    if (enemyWavesIndex < enemyWaves.length) {
                        let gameWaves = enemyWaves[enemyWavesIndex];
                        if (gameWaves != null && !gameWaves.waveSent) {
                            console.log(`Wave: ${gameWaves.waveNumber}`);
                            h2Blue.innerText = `Wave: ${gameWaves.waveNumber}/${enemyWaves.length}`;
                            activeEnemiesCount = gameWaves.enemyCount;
                            for (let enemyIndex = 0; enemyIndex < gameWaves.enemyCount; enemyIndex++) {
                                (function (index) {
                                    setTimeout(() => {
                                        spawnEnemy(); // Spawn enemy logic
                                        console.log(`Spawned enemy ${index + 1} of Wave ${gameWaves.waveNumber}`);
                                    }, index * gameWaves.timeBetweenEnemies * 1000); // Schedule enemy spawn
                                })(enemyIndex);
                            }
                            // Mark wave as sent after scheduling all enemy spawns
                            gameWaves.waveSent = true;
                            // Monitor when all enemies are defeated
                            const checkEnemies = setInterval(() => {
                                if (activeEnemiesCount === 0) {
                                    clearInterval(checkEnemies); // Stop checking once all enemies are defeated
                                    enemyWavesIndex++; // Move to the next wave
                                    console.log(enemyWavesIndex);
                                    gameCash += 100 + enemyWavesIndex; // Add money after beating a round
                                    updateStatistics();
                                    spawnNextWave(); // Spawn next wave
                                    if (enemyWavesIndex === enemyWaves.length && activeEnemiesCount === 0) {
                                        h2Blue.innerText = `YOU WON!`;
                                    }
                                }
                            }, 500); // Check every 500ms for active enemies
                        }
                    }
                };
                spawnNextWave(); // Start the first wave
            }
            // Render all towers
            towerArray.forEach(tower => {
                tower.render(ctx);
            });
            // Move and render bullets
            bullets.forEach((bullet, index) => {
                bullet.move(enemies, ctx); // Move the bullet and check for collisions with enemies
                // Check if the bullet is off-screen or has hit a target
                if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
                    bullets.splice(index, 1); // Remove bullet if it goes off-screen
                }
            });
            // Move all enemies
            if (enemies.length > 0) {
                moveEnemies();
            }
        }
        requestAnimationFrame(gameLoop); // Call gameLoop again for the next frame
    }
    function moveEnemies() {
        enemies.forEach((enemy, enemyIndex) => {
            if (ctx && currentPathIndex[enemyIndex] < currentMapPath.length) {
                const target = currentMapPath[currentPathIndex[enemyIndex]];
                let enemyPositionX = enemy.x;
                let enemyPositionY = enemy.y;
                const dx = target.x - enemyPositionX;
                const dy = target.y - enemyPositionY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const speed = enemy.speed;
                if (distance < speed) {
                    // Snap to the target position if close enough
                    enemy.setPosition(target.x, target.y);
                    currentPathIndex[enemyIndex]++; // Move to the next point in the path for this enemy
                }
                else {
                    // Move towards the target position
                    enemyPositionX += (dx / distance) * speed;
                    enemyPositionY += (dy / distance) * speed;
                    enemy.setPosition(enemyPositionX, enemyPositionY);
                    enemy.render(ctx);
                }
                if (!gameLost) { // if the game is lost, towers dont attack
                    // Check if the enemy can attack towers
                    towerArray.forEach(tower => {
                        const distanceToTower = Math.sqrt(Math.pow(tower.x - enemyPositionX, 2) + Math.pow(tower.y - enemyPositionY, 2));
                        if (distanceToTower <= tower.range) {
                            const currentTime = performance.now(); // Get the current time in milliseconds
                            // Check if enough time has passed since the last shot
                            if (currentTime - tower.lastFired >= (1000 / tower.fireRate)) {
                                const bullet = new BasicBullet(tower.damage, tower.x, tower.y, enemyPositionX, enemyPositionY, towerSize, enemySize, tower.path2Upgrades, 2);
                                bullets.push(bullet); // Store bullet in the bullets array
                                tower.lastFired = currentTime; // Update the last fired time
                            }
                        }
                    });
                }
            }
            // If the enemy has reached the end of the path
            else if (ctx) {
                if (GameHealth > 0) {
                    GameHealth -= 1; // Deduct health for reaching the end
                    updateStatistics();
                }
                if (GameHealth <= 0) {
                    gameLost = true;
                    updateStatistics();
                }
                enemies.splice(enemyIndex, 1); // Remove enemy from the array
                currentPathIndex.splice(enemyIndex, 1); // Remove path index for the enemy
            }
            // Remove enemy if health is zero or below
            if (enemy.health <= 0) {
                enemies.splice(enemyIndex, 1); // Remove enemy from the array
                currentPathIndex.splice(enemyIndex, 1); // Remove path index for the enemy
                activeEnemiesCount -= 1; // remove the enemy
                gameCash += 10; // Add cash for killing an enemy
                updateStatistics();
            }
        });
    }
    // Start the game loop
    renderMap();
    requestAnimationFrame(gameLoop); // Start the animation
});

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
        if (this.towerUpgrade == 1) {
            ctx.fillStyle = 'red';
        }
        else {
            ctx.fillStyle = 'black';
        }
        ctx.beginPath();
        ctx.rect(this.x, this.y, 10, 10); // Bullet size
        ctx.fill();
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
    // Method to render the enemy on the canvas"
    render(ctx, health) {
        if (health > 85 && health <= 100) {
            ctx.fillStyle = 'white'; // Very healthy: white color
        }
        else if (health > 65 && health <= 85) {
            ctx.fillStyle = 'lightgreen'; // Healthy: light green color
        }
        else if (health > 45 && health <= 65) {
            ctx.fillStyle = 'yellow'; // Moderately healthy: yellow color
        }
        else if (health > 32 && health <= 45) {
            ctx.fillStyle = 'orange'; // Wounded: orange color
        }
        else if (health > 16 && health <= 32) {
            ctx.fillStyle = 'pink'; // Seriously wounded: pink color
        }
        else if (health > 0 && health <= 16) {
            ctx.fillStyle = 'red'; // Critical condition: red color
        }
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
    towerColor = 'blue';
    towerColorWhenClicked = 'lightblue';
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
            if (this.path1Upgrades === 1) {
                this.towerColor = 'red';
                this.towerColorWhenClicked = 'pink';
            }
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
        ctx.fillStyle = this.isClicked ? this.towerColorWhenClicked : this.towerColor;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size); // Draw the tower
        ctx.fill();
        if (this.isClicked) {
            // Draw the range of the tower
            ctx.strokeStyle = this.isClicked ? this.towerColorWhenClicked : this.towerColor;
            ctx.beginPath();
            ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.range, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}
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
/// <reference path="basicTower.ts" />
/// <reference path="basicEnemy.ts" />
/// <reference path="basicBullet.ts" />
/// <reference path="maps/gameMap.ts" />
/// <reference path="waves.ts" />
// Create the master container for game stats
const gameStats = document.createElement('div');
// Global styles
document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.style.boxSizing = "border-box";
document.documentElement.style.margin = "0";
document.documentElement.style.padding = "0";
document.documentElement.style.boxSizing = "border-box";
// Body and html styles
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.display = "flex";
document.body.style.flexDirection = "column";
document.body.style.backgroundColor = "#1a1a1a";
document.documentElement.style.width = "100%";
document.documentElement.style.height = "100%";
document.documentElement.style.display = "flex";
document.documentElement.style.flexDirection = "column";
document.documentElement.style.backgroundColor = "#1a1a1a";
// Main content
const mainContent = document.getElementById('mainContent');
if (mainContent) {
    mainContent.style.flex = "1";
    mainContent.style.display = "flex";
    mainContent.style.width = "100%";
}
// Canvas container
const canvasContainer = document.getElementById('canvasContainer');
if (canvasContainer) {
    canvasContainer.style.flex = "1";
    canvasContainer.style.display = "flex";
    canvasContainer.style.justifyContent = "center";
    canvasContainer.style.alignItems = "center";
    canvasContainer.style.backgroundColor = "#444";
}
// Right container
const rightContainer = document.getElementById('rightContainer');
if (rightContainer) {
    rightContainer.style.position = "relative"; // Ensure it can contain positioned elements
    rightContainer.style.width = "420px";
    rightContainer.style.backgroundColor = "black";
    rightContainer.style.border = "1px solid white";
    rightContainer.style.padding = "10px"; // Add padding for a cleaner look
    rightContainer.style.overflowY = "auto"; // Allow vertical scrolling if needed
}
// Bottom container
const bottomContainer = document.getElementById('bottomContainer');
if (bottomContainer) {
    bottomContainer.style.height = "180px";
    bottomContainer.style.backgroundColor = "black";
    bottomContainer.style.border = "1px solid white";
    bottomContainer.style.position = "relative";
    bottomContainer.style.overflow = "hidden";
}
// Canvas styles
const canvas = document.querySelector('canvas');
if (canvas) {
    canvas.style.backgroundColor = "#555";
}
// Style the gameStats container
gameStats.style.color = 'white';
gameStats.style.fontFamily = "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif";
gameStats.style.fontSize = '5vh'; // Adjust font size to fit better within the container
gameStats.style.textAlign = 'center'; // Center the text
gameStats.style.display = 'flex';
gameStats.style.flexDirection = 'column'; // Stack the H2s vertically
gameStats.style.gap = '0'; // Remove gap between elements
gameStats.style.borderBottom = '1px solid white';
// Create the first H2 element with a red outline around each letter
const h2Red = document.createElement('h2');
h2Red.innerText = 'Red Bordered Text';
h2Red.style.color = 'white'; // Maintain white text color
h2Red.style.fontSize = 'inherit'; // Keep the same font size as the container
h2Red.style.fontFamily = 'inherit'; // Keep the same font family
h2Red.style.textAlign = 'inherit'; // Keep the same text alignment
h2Red.style.letterSpacing = '0.1vw'; // Adjust spacing between letters if needed
h2Red.style.margin = '0'; // Remove default margins
// Add red outline to each letter
h2Red.style.webkitTextStroke = '0.2px red'; // Outline each individual letter in red
h2Red.style.webkitTextFillColor = 'white'; // Ensure the text inside the outline stays white
// Create the second H2 element with a green border around the text (whole H2)
const h2Green = document.createElement('h2');
h2Green.innerText = 'Green Bordered Text';
h2Green.style.color = 'white'; // Maintain white text color
h2Green.style.fontSize = 'inherit'; // Keep the same font size as the container
h2Green.style.fontFamily = 'inherit'; // Keep the same font family
h2Green.style.textAlign = 'inherit'; // Keep the same text alignment
h2Green.style.margin = '0'; // Remove default margins
h2Green.style.webkitTextStroke = '0.2px green'; // Outline each individual letter in green
h2Green.style.webkitTextFillColor = 'white'; // Ensure the text inside the outline stays white
// Create a third H2 element with a blue border around the text
const h2Blue = document.createElement('h2');
h2Blue.innerText = `Press E to start!`;
h2Blue.style.color = 'white'; // Maintain white text color
h2Blue.style.fontSize = 'inherit'; // Keep the same font size as the container
h2Blue.style.fontFamily = 'inherit'; // Keep the same font family
h2Blue.style.textAlign = 'inherit'; // Keep the same text alignment
h2Blue.style.margin = '0'; // Remove default margins
h2Blue.style.webkitTextStroke = '0.2px blue'; // Outline each individual letter in blue
h2Blue.style.webkitTextFillColor = 'white'; // Ensure the text inside the outline stays white
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
    console.log(enemyWaves);
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
    const canvas = document.getElementById('mapCanvas');
    let rectSize = 50; // Size of each grid cell, this is the default
    let towerSize = 50; // Size of each tower, this is the default
    let enemySize = 25; // Size of each enemy, this is the default
    // Function to average a number to prevent bad numbers
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
    if (selectedGamemode == "sandbox") {
        h2Blue.innerText = `Press E to spawn enemies!`;
        h2Blue.style.fontSize = '3vh';
    }
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
    h2Red.innerText = `Health: ${GameHealth}`;
    h2Green.innerText = `Cash: $${gameCash}`;
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
                            h2Red.innerText = `Health: ${GameHealth}`;
                            h2Green.innerText = `Cash: $${gameCash}`;
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
            h2Red.innerText = `Health: ${GameHealth}`;
            h2Green.innerText = `Cash: $${gameCash}`;
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
    upgradeContainer.style.position = 'absolute';
    upgradeContainer.style.bottom = '50%';
    upgradeContainer.style.left = '50%';
    upgradeContainer.style.transform = 'translate(-50%, 50%)'; // Center horizontally and vertically within bottomContainer
    upgradeContainer.style.display = 'flex'; // Flexbox for side-by-side buttons
    upgradeContainer.style.gap = '2vw'; // Add gap between the buttons
    upgradeContainer.style.alignItems = 'center'; // Center buttons vertically within this area
    upgradeContainer.style.height = '10%'; // Container height to vertically center the buttons
    upgradeContainer.style.justifyContent = 'center';
    // Create the first button
    const upgradeButtonPath1 = document.createElement('button');
    upgradeButtonPath1.innerText = `Please select a tower to upgrade it.`;
    // Style the first button
    upgradeButtonPath1.style.padding = '1vw 3vw'; // Adds space inside the button (top-bottom, left-right)
    upgradeButtonPath1.style.fontSize = '1.5vw'; // Adjusts button text size
    upgradeButtonPath1.style.width = 'auto'; // Auto width to fit content
    upgradeButtonPath1.style.height = 'auto'; // Auto height to fit content
    upgradeButtonPath1.style.whiteSpace = 'nowrap'; // Prevent text wrapping
    upgradeButtonPath1.style.textAlign = 'center'; // Center the text
    upgradeButtonPath1.style.border = '1px solid white'; // Optional styling for better appearance
    upgradeButtonPath1.style.backgroundColor = 'black';
    upgradeButtonPath1.style.color = 'white';
    upgradeButtonPath1.style.borderRadius = '0.5vh';
    upgradeButtonPath1.style.boxShadow = '0 0 0.5vh 0.5vh rgba(255, 255, 255, 0.5)'; // White shading all around
    // Add hover effect for the first button
    upgradeButtonPath1.addEventListener('mouseover', () => {
        upgradeButtonPath1.style.backgroundColor = 'white';
        upgradeButtonPath1.style.color = 'black';
        upgradeButtonPath1.style.transition = 'background-color 0.3s ease-out, color 0.3s ease-out';
    });
    upgradeButtonPath1.addEventListener('mouseout', () => {
        upgradeButtonPath1.style.backgroundColor = 'black';
        upgradeButtonPath1.style.color = 'white';
    });
    // Create the second button
    const upgradeButtonPath2 = document.createElement('button');
    upgradeButtonPath2.innerText = `Please select a tower to upgrade it.`;
    // Style the second button similarly
    upgradeButtonPath2.style.padding = '1vw 3vw'; // Adds space inside the button (top-bottom, left-right)
    upgradeButtonPath2.style.fontSize = '1.5vw'; // Adjusts button text size
    upgradeButtonPath2.style.width = 'auto'; // Auto width to fit content
    upgradeButtonPath2.style.height = 'auto'; // Auto height to fit content
    upgradeButtonPath2.style.whiteSpace = 'nowrap'; // Prevent text wrapping
    upgradeButtonPath2.style.textAlign = 'center'; // Center the text
    upgradeButtonPath2.style.border = '1px solid white'; // Optional styling for better appearance
    upgradeButtonPath2.style.backgroundColor = 'black';
    upgradeButtonPath2.style.color = 'white';
    upgradeButtonPath2.style.borderRadius = '0.5vh';
    upgradeButtonPath2.style.boxShadow = '0 0 0.5vh 0.5vh rgba(255, 255, 255, 0.5)'; // White shading all around
    // Add hover effect for the second button
    upgradeButtonPath2.addEventListener('mouseover', () => {
        upgradeButtonPath2.style.backgroundColor = 'white';
        upgradeButtonPath2.style.color = 'black';
        upgradeButtonPath2.style.transition = 'background-color 0.3s ease-out, color 0.3s ease-out';
    });
    upgradeButtonPath2.addEventListener('mouseout', () => {
        upgradeButtonPath2.style.backgroundColor = 'black';
        upgradeButtonPath2.style.color = 'white';
    });
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
                h2Red.innerText = `Health: ${GameHealth}`;
                h2Green.innerText = `Cash: $${gameCash}`;
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
                h2Red.innerText = `Health: ${GameHealth}`;
                h2Green.innerText = `Cash: $${gameCash}`;
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
                    ctx.fillStyle = currentMap[i][j] === 1 ? 'brown' : 'green';
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
                                    h2Green.innerText = `Cash: $${gameCash}`;
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
                    enemy.render(ctx, enemy.health);
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
                    h2Red.innerText = `Health: ${GameHealth}`;
                    h2Green.innerText = `Cash: $${gameCash}`;
                }
                if (GameHealth <= 0) {
                    gameLost = true;
                    h2Red.innerText = `Health: ${GameHealth}`;
                    h2Green.innerText = `Cash: $${gameCash}`; // Update the health and cash display
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
                h2Red.innerText = `Health: ${GameHealth}`;
                h2Green.innerText = `Cash: $${gameCash}`;
            }
        });
    }
    // Start the game loop
    renderMap();
    requestAnimationFrame(gameLoop); // Start the animation
});

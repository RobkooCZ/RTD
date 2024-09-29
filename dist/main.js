"use strict";
class BasicBullet {
    damage;
    x; // Current position of the bullet
    y; // Current position of the bullet
    targetX; // Target position (center of the enemy)
    targetY; // Target position (center of the enemy)
    constructor(damage, towerX, towerY, enemyX, enemyY) {
        this.damage = damage;
        this.x = towerX + (50 - 10) / 2; // Center the bullet in the tower
        this.y = towerY + (50 - 10) / 2;
        this.targetX = enemyX + (25 - 10) / 2; // Center the bullet in the enemy
        this.targetY = enemyY + (25 - 10) / 2;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    // Method to render the bullet on the canvas
    render(ctx) {
        ctx.fillStyle = 'black'; // Set the color of the bullet
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
        const speed = 2;
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
            const enemyCenterX = enemy.x + 12.5; // Center of the enemy
            const enemyCenterY = enemy.y + 12.5; // Center of the enemy
            if (this.x >= enemyCenterX - 12.5 && this.x <= enemyCenterX + 12.5 &&
                this.y >= enemyCenterY - 12.5 && this.y <= enemyCenterY + 12.5) {
                // Collision detected
                enemy.takeDamage(this.damage); // Apply damage to the enemy
                // Remove bullet after hitting the enemy
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
    size = 25; // Size of the enemy
    constructor(speed, x, y, health) {
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.health = health; // Initialize health
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
    constructor(range, damage, fireRate, x, y, cost) {
        this.range = range;
        this.damage = damage;
        this.fireRate = fireRate;
        this.x = x;
        this.y = y;
        this.cost = cost;
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
        // Draw the range of the tower
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y + 25, this.range, 0, 2 * Math.PI);
        ctx.stroke();
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
/// <reference path="basicTower.ts" />
/// <reference path="basicEnemy.ts" />
/// <reference path="basicBullet.ts" />
/// <reference path="maps/gameMap.ts" />
const staticInfo = document.createElement('div');
staticInfo.className = 'staticInfo';
const gameStats = document.createElement('h2');
gameStats.className = 'gameStats';
document.body.appendChild(staticInfo);
document.body.appendChild(gameStats);
document.addEventListener('DOMContentLoaded', () => {
    const basicMap = [
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
    const basicMapPath = [
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
        { x: 100, y: 150 },
        { x: 100, y: 100 },
        { x: 100, y: 50 },
        { x: 100, y: 0 },
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
    const ctx = canvas.getContext('2d');
    const rectSize = 50; // Size of each grid cell
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
    gameStats.innerHTML = `Health: ${GameHealth}<br>Cash: $${gameCash}`; // Display health and cash
    staticInfo.innerHTML = `Tower Damage: ${damage}<br>Fire Rate: ${fireRate}/s<br>Enemy Health: ${health}<br><br><u>Health Color Coding </u><br>White: 85 - 100 (Full Health)<br>Light Green: 65 - 85 (Healthy)<br>Yellow: 45 - 65 (Moderately Healthy)<br>Orange: 32 - 45 (Wounded)<br>Pink: 16 - 32 (Seriously Wounded)<br>Red: 0 - 16 (Critical Condition)`;
    let cursorX = 0; // Initialize cursorX
    let cursorY = 0; // Initialize cursorY
    // Mouse movement for cursor position
    document.addEventListener('mousemove', (event) => {
        cursorX = event.clientX - 32; // Adjust cursor position
        cursorY = event.clientY - 100; // Adjust cursor position
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
            if (gameCash >= towerCost) {
                // Check if the position is valid for tower placement
                if (gridY >= 0 && gridY < currentMap.length && gridX >= 0 && gridX < currentMap[0].length) {
                    if (currentMap[gridY][gridX] === 0) { // Valid placement check (0 means free)
                        // Check if a tower already exists at this grid position
                        if (!towerArray.some(tower => tower.x === snappedX && tower.y === snappedY)) {
                            gameCash -= towerCost; // Deduct the tower cost from the cash
                            gameStats.innerHTML = `Health: ${GameHealth}<br>Cash: $${gameCash}`; // Update the health and cash display
                            const tower = new BasicTower(125, damage, fireRate, snappedX, snappedY, towerCost);
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
            gameStats.innerHTML = `Health: ${GameHealth}<br>Cash: $${gameCash}`; // Update the health and cash display
        }
    });
    // toggle to let the enemy move
    document.addEventListener('keydown', (event) => {
        if (event.key === 'e' || event.key === 'E') {
            spawnEnemy(); // Spawn a new enemy
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
        const newEnemy = new BasicEnemy(0.3, 350, 500, health);
        enemies.push(newEnemy);
        currentPathIndex.push(0); // Start at the beginning of the path for this enemy
    }
    // Start rendering and movement
    function gameLoop(timestamp) {
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            renderMap(); // Render the map
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
                    enemy.erase(ctx);
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
                                const bullet = new BasicBullet(tower.damage, tower.x, tower.y, enemyPositionX, enemyPositionY);
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
                    gameStats.innerHTML = `Health: ${GameHealth}<br>Cash: $${gameCash}`; // Update the health and cash display
                }
                if (GameHealth <= 0) {
                    gameLost = true;
                    gameStats.innerHTML = `Health: ${GameHealth}<br>Cash: $${gameCash}<br>Game Over! Press 'r' to restart`; // Update the health and cash display
                }
                enemies.splice(enemyIndex, 1); // Remove enemy from the array
                currentPathIndex.splice(enemyIndex, 1); // Remove path index for the enemy
            }
            // Remove enemy if health is zero or below
            if (enemy.health <= 0) {
                enemies.splice(enemyIndex, 1); // Remove enemy from the array
                currentPathIndex.splice(enemyIndex, 1); // Remove path index for the enemy
                gameCash += 10; // Add cash for killing an enemy
                gameStats.innerHTML = `Health: ${GameHealth}<br>Cash: $${gameCash}`; // Update the health and cash display
            }
        });
    }
    // Start the game loop
    renderMap();
    requestAnimationFrame(gameLoop); // Start the animation
});

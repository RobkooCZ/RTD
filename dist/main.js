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
        // Draw the range of the tower
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y + 25, this.range, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
/// <reference path="basicTower.ts" />
/// <reference path="basicEnemy.ts" />
/// <reference path="basicBullet.ts" />
const staticInfo = document.createElement('div');
staticInfo.className = 'staticInfo';
document.body.appendChild(staticInfo);
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
    const enemyPath = [
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
        if (event.key === 't') {
            const snappedX = snapToGrid(cursorX);
            const snappedY = snapToGrid(cursorY);
            const gridX = snappedX / rectSize; // Column index
            const gridY = snappedY / rectSize; // Row index
            // Check if the position is valid for tower placement
            if (gridY >= 0 && gridY < map.length && gridX >= 0 && gridX < map[0].length) {
                if (map[gridY][gridX] === 0) { // Valid placement check (0 means free)
                    // Check if a tower already exists at this grid position
                    if (!towerArray.some(tower => tower.x === snappedX && tower.y === snappedY)) {
                        const tower = new BasicTower(125, damage, fireRate, snappedX, snappedY);
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
    });
    // toggle to reset the game
    document.addEventListener('keydown', (event) => {
        if (event.key === 'r') {
            towerArray = []; // Reset the tower array
            bullets = []; // Reset the bullets array
            enemies = []; // Reset the enemies array
            currentPathIndex = []; // Reset the path index for enemies
        }
    });
    // toggle to let the enemy move
    document.addEventListener('keydown', (event) => {
        if (event.key === 'e') {
            spawnEnemy(); // Spawn a new enemy
        }
    });
    // Initial rendering of the map
    function renderMap() {
        if (ctx) {
            for (let i = 0; i < map.length; i++) {
                for (let j = 0; j < map[i].length; j++) {
                    ctx.fillStyle = map[i][j] === 1 ? 'brown' : 'green';
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
            if (ctx && currentPathIndex[enemyIndex] < enemyPath.length) {
                const target = enemyPath[currentPathIndex[enemyIndex]];
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
            // Remove enemy if health is zero or below
            if (enemy.health <= 0) {
                enemies.splice(enemyIndex, 1); // Remove enemy from the array
                currentPathIndex.splice(enemyIndex, 1); // Remove path index for the enemy
            }
        });
    }
    // Start the game loop
    renderMap();
    requestAnimationFrame(gameLoop); // Start the animation
});

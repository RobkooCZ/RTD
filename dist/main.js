"use strict";
class BasicBullet {
    damage;
    x; // Current position of the bullet
    y; // Current position of the bullet
    targetX; // Target position (center of the enemy)
    targetY; // Target position (center of the enemy)
    constructor(damage, towerX, towerY, enemyX, enemyY) {
        this.damage = damage;
        // Center the bullet at the tower's position
        this.x = towerX + (50 - 10) / 2;
        this.y = towerY + (50 - 10) / 2;
        // Center the target at the enemy's position 
        this.targetX = enemyX + (50 - 10) / 2;
        this.targetY = enemyY + (50 - 10) / 2;
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
    move(ctx) {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        if (magnitude === 0) {
            return; // Already at target position, exit the function
        }
        const speed = 5;
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
        // Render bullet
        this.render(ctx);
    }
}
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
        // Draw the range of the tower
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y + 25, this.range, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
const message = 'Basic map and tower render';
document.body.innerHTML = `<h1>${message}</h1>`;
/// <reference path="basicTower.ts" />
/// <reference path="basicEnemy.ts" />
/// <reference path="basicBullet.ts" />
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
    let currentPathIndex = 0;
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    const rectSize = 50; // Size of each grid cell
    let towerArray = []; // Array to store the towers
    let bullets = []; // Array to store bullets
    const basicEnemy = new BasicEnemy(1, 350, 450); // Example enemy initialization
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
    // Handle tower placement
    document.addEventListener('keydown', (event) => {
        if (event.key === 'e') {
            const snappedX = snapToGrid(cursorX);
            const snappedY = snapToGrid(cursorY);
            const gridX = snappedX / rectSize; // Column index
            const gridY = snappedY / rectSize; // Row index
            // Check if the position is valid for tower placement
            if (gridY >= 0 && gridY < map.length && gridX >= 0 && gridX < map[0].length) {
                if (map[gridY][gridX] === 0) { // Valid placement check (0 means free)
                    // Check if a tower already exists at this grid position
                    if (!towerArray.some(tower => tower.x === snappedX && tower.y === snappedY)) {
                        const tower = new BasicTower(125, 10, 1, snappedX, snappedY);
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
    // Initial rendering of the map and enemy
    function renderMapAndEnemy() {
        if (ctx) {
            for (let i = 0; i < map.length; i++) {
                for (let j = 0; j < map[i].length; j++) {
                    ctx.fillStyle = map[i][j] === 1 ? 'brown' : 'green';
                    ctx.fillRect(j * rectSize, i * rectSize, rectSize, rectSize);
                }
            }
            basicEnemy.render(ctx);
        }
    }
    // Start rendering and movement
    function gameLoop() {
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            renderMapAndEnemy(); // Render the map and enemy
            // Render all towers
            towerArray.forEach(tower => {
                tower.render(ctx);
            });
            // Move and render bullets
            bullets.forEach((bullet, index) => {
                bullet.move(ctx); // Move the bullet
                bullet.render(ctx); // Render the bullet
                // Remove bullet if it reached the target
                if (bullet.x === bullet.targetX && bullet.y === bullet.targetY) {
                    bullets.splice(index, 1); // Remove bullet from the array
                }
            });
            // Move the enemy
            moveEnemy();
        }
        requestAnimationFrame(gameLoop); // Call gameLoop again for the next frame
    }
    function moveEnemy() {
        if (ctx && currentPathIndex < enemyPath.length) { // Ensure ctx is not null and path index is valid
            const target = enemyPath[currentPathIndex];
            let enemyPositionX = basicEnemy.x;
            let enemyPositionY = basicEnemy.y;
            const dx = target.x - enemyPositionX;
            const dy = target.y - enemyPositionY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = 0.3; // Adjust speed for smoother movement
            if (distance < speed) {
                // Snap to the target position if close enough
                basicEnemy.setPosition(target.x, target.y);
                currentPathIndex++; // Move to the next point in the path
            }
            else {
                // Move towards the target position
                basicEnemy.erase(ctx);
                enemyPositionX += (dx / distance) * speed;
                enemyPositionY += (dy / distance) * speed;
                basicEnemy.setPosition(enemyPositionX, enemyPositionY);
                basicEnemy.render(ctx);
            }
            // Check if the enemy can attack towers
            towerArray.forEach(tower => {
                const distanceToTower = Math.sqrt(Math.pow(tower.x - enemyPositionX, 2) + Math.pow(tower.y - enemyPositionY, 2));
                if (distanceToTower <= tower.range) {
                    console.log(`Enemy in range of tower ${tower}`); // Assuming tower has a toString method
                    const bullet = new BasicBullet(tower.damage, tower.x, tower.y, enemyPositionX, enemyPositionY);
                    bullets.push(bullet); // Store bullet in the bullets array
                }
            });
        }
    }
    // Start the game loop
    renderMapAndEnemy();
    requestAnimationFrame(gameLoop); // Start the animation
});

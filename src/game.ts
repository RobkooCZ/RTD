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
    const basicMap: number[][] = [
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
    

    const basicMapPath: { x: number; y: number }[] = [
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

    const easyMap: number[][] = [
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

    const easyMapPath: {
         x: number; y: number }[] = [
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
    
    const canvas = document.getElementById('mapCanvas') as HTMLCanvasElement;
    let rectSize: number = 50; // Size of each grid cell, this is the default
    let towerSize: number = 50; // Size of each tower, this is the default
    let enemySize: number = 25; // Size of each enemy, this is the default

    // Function to average a number to prevent bad numbers
    function averageToNumber(value: number, average: number): number {
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
    let towerArray: BasicTower[] = []; // Array to store the towers
    let bullets: BasicBullet[] = []; // Array to store bullets
    let enemies: BasicEnemy[] = []; // Array to store enemies
    let currentPathIndex: number[] = []; // Array to track path indices for multiple enemies
    let damage: number = 10;
    let fireRate: number = 2;
    let health: number = 100;
    let GameHealth: number = 100;
    let gameCash: number = 1000;
    let towerCost: number = 100;
    let gameLost: boolean = false;
    let currentMapIndex = 0; // Index to track selected map
    let maps: gameMap[] = []; // Array to store multiple maps
    let currentMap: number[][] = []; // Currently selected map grid
    let currentMapPath: { x: number; y: number }[] = []; // Currently selected map path
    let selectedMap = localStorage.getItem('selectedMap'); // Get the selected map from the main menu
    let enemyPaths: { x: number; y: number }[][] = []; // Array to store enemy paths

    enemyPaths.push(basicMapPath); // add all enemy paths to an array for easy coding later
    enemyPaths.push(easyMapPath);

    enemyPaths.forEach(path => { // loops to modify x and y coordinates for enemy paths according to the resolution
        path.forEach(point => {
            point.x = point.x/50 * rectSize;
            point.y = point.y/50 * rectSize;
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

    gameStats.innerHTML = `Health: ${GameHealth}<br>Cash: $${gameCash}`; // Display health and cash
    // staticInfo.innerHTML = `Tower Damage: ${damage}<br>Fire Rate: ${fireRate}/s<br>Enemy Health: ${health}<br><br><u>Health Color Coding </u><br>White: 85 - 100 (Full Health)<br>Light Green: 65 - 85 (Healthy)<br>Yellow: 45 - 65 (Moderately Healthy)<br>Orange: 32 - 45 (Wounded)<br>Pink: 16 - 32 (Seriously Wounded)<br>Red: 0 - 16 (Critical Condition)`;

    let cursorX = 0; // Initialize cursorX
    let cursorY = 0; // Initialize cursorY

    // Mouse movement for cursor position
    document.addEventListener('mousemove', (event) => {
        cursorX = event.clientX - 24; // Adjust cursor position
        cursorY = event.clientY - 25; // Adjust cursor position
    });

    // Function to snap coordinates to the nearest grid point
    function snapToGrid(value: number): number {
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

            if (gameCash >= towerCost){
                // Check if the position is valid for tower placement
                if (gridY >= 0 && gridY < currentMap.length && gridX >= 0 && gridX < currentMap[0].length) {
                    if (currentMap[gridY][gridX] === 0) { // Valid placement check (0 means free)
                        // Check if a tower already exists at this grid position
                        if (!towerArray.some(tower => tower.x === snappedX && tower.y === snappedY)) {
                            gameCash -= towerCost; // Deduct the tower cost from the cash
                            gameStats.innerHTML = `Health: ${GameHealth}<br>Cash: $${gameCash}`; // Update the health and cash display
                            const tower: BasicTower = new BasicTower(125, damage, fireRate, snappedX, snappedY, towerCost, towerSize);
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
        if (selectedMap === 'basicMap') {
            const newEnemy = new BasicEnemy(0.5, 0, 300/50 * rectSize, health, enemySize, rectSize);
            enemies.push(newEnemy);
        }
        else if (selectedMap === 'easyMap') {
            const newEnemy = new BasicEnemy(0.5, 350/50 * rectSize, 500/50 * rectSize, health, enemySize, rectSize);
            enemies.push(newEnemy);
        }
        currentPathIndex.push(0); // Start at the beginning of the path for this enemy
    }

    // Start rendering and movement
    function gameLoop(timestamp: number) {
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
                } else {
                    // Move towards the target position
                    enemyPositionX += (dx / distance) * speed;
                    enemyPositionY += (dy / distance) * speed;
                    enemy.setPosition(enemyPositionX, enemyPositionY);
                    enemy.render(ctx, enemy.health);
                }
    
                if (!gameLost){ // if the game is lost, towers dont attack
                    // Check if the enemy can attack towers
                    towerArray.forEach(tower => {
                        const distanceToTower = Math.sqrt(Math.pow(tower.x - enemyPositionX, 2) + Math.pow(tower.y - enemyPositionY, 2));
                        if (distanceToTower <= tower.range) {
                            const currentTime = performance.now(); // Get the current time in milliseconds
                            
                            // Check if enough time has passed since the last shot
                            if (currentTime - tower.lastFired >= (1000 / tower.fireRate)) {
                                const bullet = new BasicBullet(tower.damage, tower.x, tower.y, enemyPositionX, enemyPositionY, towerSize, enemySize);
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
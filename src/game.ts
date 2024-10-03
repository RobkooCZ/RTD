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
if(rightContainer) rightContainer.appendChild(gameStats);


// make a div to store tower info in the right container
const towerDiv = document.createElement('div');
towerDiv.id = 'towerDiv';

if (rightContainer) rightContainer.appendChild(towerDiv);


// create divs to store tower info in the towerDiv
const singleShotTowerDiv = document.createElement('div');
const minigunTowerDiv = document.createElement('div');

// Create text elements for the towers
const singleShotTowerText = document.createElement('h3');
singleShotTowerText.innerText = 'Single Shot Tower';

const minigunTowerText = document.createElement('h3');
minigunTowerText.innerText = 'Minigun Tower';

// Create images for the towers
const singleShotTowerImg = document.createElement('img');
singleShotTowerImg.src = '../towers/images/SST.jpg'; 
singleShotTowerImg.alt = 'Single Shot Tower';

const minigunTowerImg = document.createElement('img');
minigunTowerImg.src = '../towers/images/MT.jpg'; 
minigunTowerImg.alt = 'Minigun Tower';

// Create paragraph elements for the towers
const singleShotTowerHotkey = document.createElement('p');
singleShotTowerHotkey.innerText = `Hotkey: T`;

const minigunTowerHotkey = document.createElement('p');
minigunTowerHotkey.innerText = `Hotkey: S`;

const singleShotTowerCost = document.createElement('p');
singleShotTowerCost.id = "SSTCost";
singleShotTowerCost.innerText = `$100`;

const minigunTowerCost = document.createElement('p');
minigunTowerCost.id = "MTCost";
minigunTowerCost.innerText = `$125`;

singleShotTowerDiv.appendChild(singleShotTowerText);
singleShotTowerDiv.appendChild(singleShotTowerImg);
singleShotTowerDiv.appendChild(singleShotTowerHotkey);
singleShotTowerDiv.appendChild(singleShotTowerCost);

minigunTowerDiv.appendChild(minigunTowerText);
minigunTowerDiv.appendChild(minigunTowerImg);
minigunTowerDiv.appendChild(minigunTowerHotkey);
minigunTowerDiv.appendChild(minigunTowerCost);

if (towerDiv){
    towerDiv.appendChild(singleShotTowerDiv);
    towerDiv.appendChild(minigunTowerDiv);
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mapCanvas') as HTMLCanvasElement;
    let rectSize: number = 50; // Size of each grid cell, this is the default
    let towerSize: number = 50; // Size of each tower, this is the default
    let enemySize: number = 25; // Size of each enemy, this is the default
    
    /**
     * Rounds a given value to the nearest multiple of the specified average.
     *
     * @param value - The number to be rounded.
     * @param average - The average or multiple to which the value should be rounded.
     * @returns The value rounded to the nearest multiple of the average.
     */
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
    let towerArray: Tower[] = []; // Array to store the towers
    let bullets: BasicBullet[] = []; // Array to store bullets
    let enemies: BasicEnemy[] = []; // Array to store enemies
    let currentPathIndex: number[] = []; // Array to track path indices for multiple enemies
    let damage: number = 10;
    let fireRate: number = 2;
    let health: number = 100;
    let GameHealth: number = 100;
    let gameCash: number = 1000;
    let towerCost: number = 0;
    let SSTC: number = 100;
    let MTC: number = 125;
    let gameLost: boolean = false;
    let currentMapIndex = 0; // Index to track selected map
    let maps: gameMap[] = []; // Array to store multiple maps
    let currentMap: number[][] = []; // Currently selected map grid
    let currentMapPath: { x: number; y: number }[] = []; // Currently selected map path
    let selectedMap = localStorage.getItem('selectedMap'); // Get the selected map from the main menu
    let selectedGamemode = localStorage.getItem('selectedGamemode') //  Get the selected gamemode from the main menu
    let wavesStart: boolean = false;
    let enemyPaths: { x: number; y: number }[][] = []; // Array to store enemy paths
    let towerSelected: boolean = false;
    let activeEnemiesCount = 0; // Track the number of active enemies

    if(selectedGamemode == "sandbox")h2Blue.innerText = `Press E to spawn enemies!`; h2Blue.style.fontSize = '3vh';

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

    function updateStatistics(): void {
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
    function snapToGrid(value: number): number {
        return Math.round(value / rectSize) * rectSize;
    }

  // Toggle to spawn a tower
document.addEventListener('keydown', (event) => {
    let pressedT: boolean = event.key === 't' || event.key === 'T';
    let pressedS: boolean = event.key === 's' || event.key === 'S';
    

    if (pressedT || pressedS) {
        const snappedX = snapToGrid(cursorX);
        const snappedY = snapToGrid(cursorY);
        const gridX = snappedX / rectSize; // Column index
        const gridY = snappedY / rectSize; // Row index
        console.log(`Tower trying to be placed at: X: ${gridX}, Y: ${gridY}`);

        if (pressedT) {
            towerCost = SSTC;
        } else if (pressedS) {
            towerCost = MTC;
        }

        if (gameCash >= towerCost) {
            if (gridY >= 0 && gridY < currentMap.length && gridX >= 0 && gridX < currentMap[0].length) {
                if (currentMap[gridY][gridX] === 0) {
                    if (!towerArray.some(tower => tower.x === snappedX && tower.y === snappedY)) {
                        gameCash -= towerCost;
                        updateStatistics();

                        let tower: Tower | null = null; // Initialize as null

                        if (pressedT) {
                            tower = new SingleShotTower(snappedX, snappedY, false, rectSize);
                        } else if (pressedS) {
                            tower = new minigunTower(snappedX, snappedY, false, rectSize);
                        }

                        // Ensure tower is assigned before pushing or rendering
                        if (tower !== null) {
                            towerArray.push(tower);
                            if (ctx) {
                                tower.render(ctx);
                            }
                        }
                    } else {
                        console.log('Tower not placed: A tower already exists at this position.');
                    }
                } else {
                    console.log('Tower not placed: Invalid position (path)');
                }
            } else {
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
            if (selectedGamemode == "waves"){
                wavesStart = true;
            }
            else if (selectedGamemode == "sandbox"){
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
    if(bottomContainer) bottomContainer.appendChild(upgradeContainer);    

    let currentSelectedTower: Tower | null = null;

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
            if (
                mouseX >= tower.x && mouseX <= tower.x + towerSize &&
                mouseY >= tower.y && mouseY <= tower.y + towerSize
            ) {
                // Set this tower as selected
                tower.isClicked = true;
                towerSelected = true;
                currentSelectedTower = tower;
                isTowerClicked = true;

                // Update the upgrade buttons
                const updateButton = (button: HTMLButtonElement, pathUpgrades: number, upgradeText: string) => {
                    if (pathUpgrades === 1) {
                        button.innerText = "FULLY UPGRADED";
                    } else {
                        button.innerText = upgradeText;
                    }
                };

                if (currentSelectedTower){
                    updateButton(upgradeButtonPath1, currentSelectedTower.path1Upgrades, 'Upgrade Firerate ($75)');
                    updateButton(upgradeButtonPath2, currentSelectedTower.path2Upgrades, 'Upgrade Damage ($100)');
                }

                if (ctx) tower.render(ctx);
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
        if (gameCash > 75){
            if (currentSelectedTower && currentSelectedTower.path1Upgrades !== 1) {
                gameCash -= 75;
                updateStatistics();
                currentSelectedTower.upgradePath1();
                upgradeButtonPath1.innerText = "FULLY UPGRADED";
            }
        }
        else{
            upgradeButtonPath1.innerText = "NOT ENOUGH MONEY";
            setTimeout(() => {
                upgradeButtonPath1.innerText = "Upgrade Firerate";
            }, 1500);
        }
    });
    
    upgradeButtonPath2.addEventListener('click', () => {
        if (gameCash > 100){
            if (currentSelectedTower && currentSelectedTower.path2Upgrades !== 1) {
                gameCash -= 100;
                updateStatistics();
                currentSelectedTower.upgradePath2();
                upgradeButtonPath2.innerText = "FULLY UPGRADED";
            }
        }
        else{
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
                                (function (index) { // IIFE to capture current enemyIndex properly
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
                } else {
                    // Move towards the target position
                    enemyPositionX += (dx / distance) * speed;
                    enemyPositionY += (dy / distance) * speed;
                    enemy.setPosition(enemyPositionX, enemyPositionY);
                    enemy.render(ctx);
                }
    
                if (!gameLost){ // if the game is lost, towers dont attack
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
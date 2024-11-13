const canvas = document.getElementById('mapCanvas') as HTMLCanvasElement;

const backToMainMenu = document.getElementsByClassName('backToMainMenu')[0] as HTMLButtonElement;
const xButton = document.getElementById('xIcon') as HTMLElement;
const settingsModal = document.getElementsByClassName('settingsModal')[0] as HTMLElement;
const settingsIcon = document.getElementById('settingsIcon') as HTMLElement;

// Define the structure of the incoming tower data
interface TowerData {
    gridX: number;
    gridY: number;
    towerType: string;
}

interface upgradeData {
    tower: Tower | null;
    upgradePath: number;
}
  
// declare functions from other stuff for server communication
declare function sendDataToServer(messageType: string, data: Object): void;
declare function acceptData(messageType: string): void;
declare function getNewData(messageType: "towerDataForPlayer"): TowerData[];
declare function getNewData(messageType: "upgradeDataForPlayer"): upgradeData[];
declare function getNewData(messageType: string): TowerData[] | upgradeData[];
declare function getSocketID(): string;

document.addEventListener('DOMContentLoaded', () => {
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
        return Math.floor(value / average) * average;
    }

    // Set initial canvas size and grid cell size   
    canvas.width = averageToNumber((window.innerWidth / 100) * 78.125, 10);
    canvas.height = averageToNumber((window.innerHeight / 100) * 83.333, 10);
    rectSize = averageToNumber((canvas.width / 30), 1); // Update the size of each grid cell
    towerSize = rectSize; // Update the size of each tower
    enemySize = rectSize / 2; // Update the size of each enemy

    const ctx = canvas.getContext('2d');
    let towerArray: Tower[] = []; // Array to store the towers
    let bullets: bullet[] = []; // Array to store bullets
    let enemies: Enemy[] = []; // Array to store enemies
    let currentPathIndex: number[] = []; // Array to track path indices for multiple enemies
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

    enemyPaths.push(returnBasicMapPath()); // add all enemy paths to an array for easy coding later
    enemyPaths.push(returnEasyMapPath());

    enemyPaths.forEach(path => { // loops to modify x and y coordinates for enemy paths according to the resolution
        path.forEach(point => {
            point.x = point.x/50 * rectSize;
            point.y = point.y/50 * rectSize;
        });
    });

    // Add maps to the array
    maps.push(new gameMap(returnBasicMap(), enemyPaths[0], 'Basic Map'));
    maps.push(new gameMap(returnEasyMap(), enemyPaths[1], 'Easy Map'));

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
        cursorX = event.clientX - 24; // Update cursorX
        cursorY = event.clientY - 25; // Update cursorY
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

                            if (pressedT) {
                                currentMap[gridY][gridX] = 2; // Update the map to indicate a Single Shot Tower is placed
                            } else if (pressedS) {
                                currentMap[gridY][gridX] = 3; // Update the map to indicate a Minigun Tower is placed
                            }

                            updateStatistics();

                            let tower: Tower | null = null; // Initialize as null

                            if (pressedT) {
                                tower = new MarksmanTower(snappedX, snappedY, false, rectSize, 5, "Marksman Tower");
                                tower.setPositionInGrid(snappedX, snappedY, rectSize);
                                tower.towerOwner = getSocketID();
                                const towerData: TowerData = { gridX, gridY, towerType: "Marksman Tower" };
                                sendDataToServer('towerData', towerData);
                            } else if (pressedS) {
                                tower = new minigunTower(snappedX, snappedY, false, rectSize, 2, "Minigun Tower"); 
                                tower.setPositionInGrid(snappedX, snappedY, rectSize); 
                                tower.towerOwner = getSocketID();
                                const towerData: TowerData = { gridX, gridY, towerType: "Minigun Tower" };
                                sendDataToServer('towerData', towerData);
                            }

                    // Ensure tower is assigned before pushing or rendering
                    if (tower) {
                        towerArray.push(tower);
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

    function placeIncomingTower(gridX: number, gridY: number, grid: number[][], towerType: string): void {        
        let x: number = gridX * rectSize;
        let y: number = gridY * rectSize;
        
        if (towerType === "Marksman Tower") {
            let tower = new MarksmanTower(x, y, false, rectSize, 5, "Marksman Tower");
            tower.setPositionInGrid(x, y, rectSize);
            grid[gridY][gridX] = 2;
            towerArray.push(tower);
        } else if (towerType === "Minigun Tower") {
            let tower = new minigunTower(x, y, false, rectSize, 2, "Minigun Tower");
            tower.setPositionInGrid(x, y, rectSize);
            grid[gridY][gridX] = 3;
            towerArray.push(tower);
        }
    }

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
            updateStatistics(); // Update the statistics
            if (selectedMap === 'basicMap') {
                currentMapIndex = 0;
                maps[currentMapIndex].map = returnBasicMap();
            }
            else if (selectedMap === 'easyMap') {
                currentMapIndex = 1;
                maps[currentMapIndex].map = returnEasyMap();
            }

            currentMap = maps[currentMapIndex].map;
            if(ctx)  renderMap(ctx, currentMap, towerArray, rectSize, towerSize);
            h2Blue.innerText = `Press E to Start!`;
        }
    });

    // toggle to let the enemy move
    document.addEventListener('keydown', (event) => {
        if (event.key === 'e' || event.key === 'E') {
            if (selectedGamemode == "waves"){
                spawnEnemy(); // set it to spawn enemy until wave logic is fixed
            }
            else if (selectedGamemode == "sandbox"){
                spawnEnemy();
            }
        }
    });

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

        // Loop through towers to check which one is clicked and display UI
        for (let index = 0; index < towerArray.length; index++) {
            const tower = towerArray[index];
            if (
                mouseX >= tower.x && mouseX <= tower.x + towerSize &&
                mouseY >= tower.y && mouseY <= tower.y + towerSize &&
                tower.towerOwner === getSocketID()
            ) {
                // Set this tower as selected
                tower.isClicked = true;
                towerSelected = true;   
                currentSelectedTower = tower;
                isTowerClicked = true;

                if (currentSelectedTower){
                    towerDamage.innerText = `Damage: ${currentSelectedTower.damageDealt}`;
                    towerKills.innerText = `Kills: ${currentSelectedTower.enemiesKilled}`;
                    currentSelectedTower.calculateSellValue();
                    sellButton.innerHTML = `Sell Tower for $${currentSelectedTower.sellValue}`;
                    towerStatisticsContainer.classList.add('active')
                    sellButton.classList.add('active');
                    sellButton.addEventListener('click', () => {
                        if (currentSelectedTower !== null){
                            currentMap[currentSelectedTower.gridY][currentSelectedTower.gridX] = 0;
                            gameCash = currentSelectedTower.sellTower(gameCash, currentSelectedTower, towerArray, currentSelectedTower.sellValue);
                        }
                        updateStatistics();
                        updateUIAfterTowerNotClicked();
                    });
                    updateButton(currentSelectedTower, upgradeName1, upgradeName2, costLabel1, costLabel2, progressBar1, progressBar2);
                }
            }
        }

        
        if (!isTowerClicked) {
            updateUIAfterTowerNotClicked();
        }
    });
        
    upgradeButtonPath1.addEventListener('click', () => {
        gameCash = upgradePath1(currentSelectedTower, gameCash, upgradeName1, upgradeName2, costLabel1, costLabel2, progressBar1, progressBar2);
        const upgradeData: upgradeData = { tower: currentSelectedTower, upgradePath: 1 };
        sendDataToServer('upgradeData', upgradeData);
        updateStatistics();
    });
    
    upgradeButtonPath2.addEventListener('click', () => {
        gameCash = upgradePath2(currentSelectedTower, gameCash, upgradeName1, upgradeName2, costLabel1, costLabel2, progressBar1, progressBar2);
        const upgradeData: upgradeData = { tower: currentSelectedTower, upgradePath: 2 };
        sendDataToServer('upgradeData', upgradeData);
        updateStatistics();
    });

    backToMainMenu.addEventListener('click', () => {
        window.location.href = '../../mainMenu.html';
    });
    
    xButton.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });
    
    settingsIcon.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });
    
    if(ctx)  renderMap(ctx, currentMap, towerArray, rectSize, towerSize); // Render the map initially

    function spawnEnemy() {
        // Create a new enemy at the start position and push it into the enemies array
        const rng = () => Math.floor(Math.random() * 10);  // Random number between 0 and 9
    
        if (selectedMap === 'basicMap') {
            const randomValue = rng();  // Get a random value for the spawn chance
            
            let newEnemy;
            if (randomValue === 0) {
                // 1/10 chance for an ArmoredEnemy
                newEnemy = new ArmoredEnemy(0, 300 / 50 * rectSize, rectSize);
            } else {
                // 50% chance for either NormalEnemy or FastEnemy if it's not an ArmoredEnemy
                newEnemy = (randomValue <= 5) ? new NormalEnemy(0, 300 / 50 * rectSize, rectSize) : new FastEnemy(0, 300 / 50 * rectSize, rectSize);
            }
    
            enemies.push(newEnemy);
        } else if (selectedMap === 'easyMap') {
            const randomValue = rng();  // Get a random value for the spawn chance
    
            let newEnemy;
            if (randomValue === 0) {
                // 1/10 chance for a NormalEnemy
                newEnemy = new NormalEnemy(350 / 50 * rectSize, 500 / 50 * rectSize, rectSize);
            } else {
                // 50/50 chance for either FastEnemy or NormalEnemy if it's not the ArmoredEnemy
                newEnemy = (randomValue <= 5) ? new NormalEnemy(350 / 50 * rectSize, 500 / 50 * rectSize, rectSize) : new FastEnemy(350 / 50 * rectSize, 500 / 50 * rectSize, rectSize);
            }
    
            enemies.push(newEnemy);
        }
    
        currentPathIndex.push(0); // Start at the beginning of the path for this enemy
    }

    // Start rendering and movement
    function gameLoop(timestamp: number) {
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            const { rectSize, towerSize, enemySize } = resizeCanvas(towerArray, canvas);
            renderMap(ctx, currentMap, towerArray, rectSize, towerSize);

            towerArray.forEach(tower => { // loop to update the tower statistics while theyre selected
                if (tower.isClicked){
                    towerDamage.innerText = `Damage: ${tower.damageDealt}`;
                    towerKills.innerText = `Kills: ${tower.enemiesKilled}`;
                    tower.calculateSellValue();
                    sellButton.innerHTML = `Sell Tower for $${tower.sellValue}`;
                }
            });
            
            // Retrieve new tower data
            const newTowerData: TowerData[] = getNewData("towerDataForPlayer");

            // Process each new tower placement from other players
            newTowerData.forEach((towerData) => {
                console.log('New tower placed by another player:', towerData);
                placeIncomingTower(towerData.gridX, towerData.gridY, currentMap, towerData.towerType);
            });

            // Retrieve new upgrade data (this should be of type `upgradeData[]`)
            const newUpgradeData: upgradeData[] = getNewData("upgradeDataForPlayer");

            // Process each new upgrade from other players
            newUpgradeData.forEach((upgrade) => {
                console.log('New upgrade by another player:', upgrade);
                
                if (upgrade.tower){
                    towerArray.forEach(tower => {
                        if (tower.gridX === upgrade.tower?.gridX && tower.gridY === upgrade.tower?.gridY) {
                            // If the tower is not null, apply the upgrade
                            console.log(`Upgrading tower at (${upgrade.tower.gridX}, ${upgrade.tower.gridY}) with upgrade path: ${upgrade.upgradePath}`);
                            upgrade.upgradePath === 1 ? tower.upgradePath1() : tower.upgradePath2();
                        }
                    });
                }
            }); 

            bullets.forEach((bullet, index) => {
                const currentTime = performance.now();

                if (currentTime - bullet.bulletFired >= 250){
                    bullet.bulletRender = false;
                }

                if (bullet.bulletRender){
                    bullet.move(enemies, ctx); // Move the bullet and check for collisions with enemies
                }
                else{
                    bullets.splice(index, 1);
                }
            
                // Remove the bullet only if it is off-screen AND its pierce count is 0
                if ((bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) && bullet.pierce === 0) {
                    bullets.splice(index, 1); // Remove bullet if it goes off-screen and pierce is depleted
                }
            });
            
            // Move all enemies
            if (enemies.length > 0) {
                moveEnemies(enemySize);
            }
        }
        requestAnimationFrame(gameLoop); // Call gameLoop again for the next frame
    }

    function moveEnemies(enemySize: number) {
        enemies.forEach((enemy, enemyIndex) => {
            if (ctx && currentPathIndex[enemyIndex] < currentMapPath.length) {
                const target = currentMapPath[currentPathIndex[enemyIndex]];
                let enemyPositionX = enemy.x;
                let enemyPositionY = enemy.y;
    
                const dx = target.x - enemyPositionX;
                const dy = target.y - enemyPositionY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                const speed = enemy.speed;
                
                enemy.render(ctx, enemySize);

                if (distance < speed) {
                    // Snap to the target position if close enough
                    enemy.setPosition(target.x, target.y);
                    currentPathIndex[enemyIndex]++; // Move to the next point in the path for this enemy
                } else {
                    // Move towards the target position
                    enemyPositionX += (dx / distance) * speed;
                    enemyPositionY += (dy / distance) * speed;
                    enemy.setPosition(enemyPositionX, enemyPositionY);
                }
    
                if (!gameLost) { // if the game is lost, towers don't attack
                    let bullet: bullet | null = null; // Initialize as null
                    
                    // Check if the enemy can attack towers
                    towerArray.forEach(tower => {
                        const distanceToTower = Math.sqrt(Math.pow(tower.x - enemyPositionX, 2) + Math.pow(tower.y - enemyPositionY, 2));
                        
                        if (distanceToTower <= tower.range) {
                            const currentTime = performance.now(); // Get the current time in milliseconds
                            
                            // Check if enough time has passed since the last shot
                            if (currentTime - tower.lastFired >= (1000 / tower.fireRate)) {
                                // Depending on the tower type, assign the appropriate bullet to the shared 'bullet' variable
                                if (tower.name === 'Marksman Tower') {
                                    if (tower.path1Upgrades >= 2){
                                        tower.path2Upgrades >= 2 ? bullet = new marksmanBullet(tower.damage, tower.x, tower.y, enemyPositionX, enemyPositionY, towerSize, enemySize, tower.path2Upgrades, tower.pierce, 30, tower, true) : bullet = new marksmanBullet(tower.damage, tower.x, tower.y, enemyPositionX, enemyPositionY, towerSize, enemySize, tower.path2Upgrades, tower.pierce, 15, tower, true);
                                    }else{
                                        tower.path2Upgrades >= 2 ? bullet = new marksmanBullet(tower.damage, tower.x, tower.y, enemyPositionX, enemyPositionY, towerSize, enemySize, tower.path2Upgrades, tower.pierce, 30, tower, false) : bullet = new marksmanBullet(tower.damage, tower.x, tower.y, enemyPositionX, enemyPositionY, towerSize, enemySize, tower.path2Upgrades, tower.pierce, 15, tower, false);
                                    }
                                }
                                else if (tower.name === 'Minigun Tower') {
                                    bullet = new classicBullet(tower.damage, tower.x, tower.y, enemyPositionX, enemyPositionY, towerSize, enemySize, tower.path2Upgrades, tower.pierce, 10, tower);
                                }   
                
                                // Check if a bullet was created and add it to the array
                                if (bullet) {
                                    bullets.push(bullet); // Store bullet in the bullets array
                                    bullet.bulletFired = currentTime; // Update bullet's fired time
                                }
                
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
                    activeEnemiesCount -= 1;
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
    if(ctx)  renderMap(ctx, currentMap, towerArray, rectSize, towerSize);
    requestAnimationFrame(gameLoop); // Start the animation
}); 
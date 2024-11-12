"use strict";
const canvas = document.getElementById('mapCanvas');
const backToMainMenu = document.getElementsByClassName('backToMainMenu')[0];
const xButton = document.getElementById('xIcon');
const settingsModal = document.getElementsByClassName('settingsModal')[0];
const settingsIcon = document.getElementById('settingsIcon');
document.addEventListener('DOMContentLoaded', () => {
    let rectSize = 50; // Size of each grid cell, this is the default
    let towerSize = 50; // Size of each tower, this is the default
    let enemySize = 25; // Size of each enemy, this is the default
    let incomingTowerData;
    /**
     * Rounds a given value to the nearest multiple of the specified average.
     *
     * @param value - The number to be rounded.
     * @param average - The average or multiple to which the value should be rounded.
     * @returns The value rounded to the nearest multiple of the average.
     */
    function averageToNumber(value, average) {
        return Math.floor(value / average) * average;
    }
    // Set initial canvas size and grid cell size   
    canvas.width = averageToNumber((window.innerWidth / 100) * 78.125, 10);
    canvas.height = averageToNumber((window.innerHeight / 100) * 83.333, 10);
    rectSize = averageToNumber((canvas.width / 30), 1); // Update the size of each grid cell
    towerSize = rectSize; // Update the size of each tower
    enemySize = rectSize / 2; // Update the size of each enemy
    const ctx = canvas.getContext('2d');
    let towerArray = []; // Array to store the towers
    let bullets = []; // Array to store bullets
    let enemies = []; // Array to store enemies
    let currentPathIndex = []; // Array to track path indices for multiple enemies
    let GameHealth = 100;
    let gameCash = 1000;
    let towerCost = 0;
    let SSTC = 100;
    let MTC = 125;
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
    enemyPaths.push(returnBasicMapPath()); // add all enemy paths to an array for easy coding later
    enemyPaths.push(returnEasyMapPath());
    enemyPaths.forEach(path => {
        path.forEach(point => {
            point.x = point.x / 50 * rectSize;
            point.y = point.y / 50 * rectSize;
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
    function updateStatistics() {
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
    function snapToGrid(value) {
        return Math.round(value / rectSize) * rectSize;
    }
    // Toggle to spawn a tower
    document.addEventListener('keydown', (event) => {
        let pressedT = event.key === 't' || event.key === 'T';
        let pressedS = event.key === 's' || event.key === 'S';
        if (pressedT || pressedS) {
            const snappedX = snapToGrid(cursorX);
            const snappedY = snapToGrid(cursorY);
            const gridX = snappedX / rectSize; // Column index
            const gridY = snappedY / rectSize; // Row index
            if (pressedT) {
                towerCost = SSTC;
            }
            else if (pressedS) {
                towerCost = MTC;
            }
            if (gameCash >= towerCost) {
                if (gridY >= 0 && gridY < currentMap.length && gridX >= 0 && gridX < currentMap[0].length) {
                    if (currentMap[gridY][gridX] === 0) {
                        if (!towerArray.some(tower => tower.x === snappedX && tower.y === snappedY)) {
                            gameCash -= towerCost;
                            if (pressedT) {
                                currentMap[gridY][gridX] = 2; // Update the map to indicate a Single Shot Tower is placed
                            }
                            else if (pressedS) {
                                currentMap[gridY][gridX] = 3; // Update the map to indicate a Minigun Tower is placed
                            }
                            updateStatistics();
                            let tower = null; // Initialize as null
                            if (pressedT) {
                                tower = new MarksmanTower(snappedX, snappedY, false, rectSize, 5, "Marksman Tower");
                                tower.setPositionInGrid(snappedX, snappedY, rectSize);
                                sendTowerDataToServer(gridX, gridY, "Marksman Tower");
                            }
                            else if (pressedS) {
                                tower = new minigunTower(snappedX, snappedY, false, rectSize, 2, "Minigun Tower");
                                tower.setPositionInGrid(snappedX, snappedY, rectSize);
                                sendTowerDataToServer(gridX, gridY, "Minigun Tower");
                            }
                            // Ensure tower is assigned before pushing or rendering
                            if (tower) {
                                towerArray.push(tower);
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
    function placeIncomingTower(gridX, gridY, grid, towerType, gridSize) {
        let x = gridX * rectSize;
        let y = gridY * rectSize;
        if (towerType === "Marksman Tower") {
            let tower = new MarksmanTower(x, y, false, rectSize, 5, "Marksman Tower");
            tower.setPositionInGrid(x, y, rectSize);
            grid[gridY][gridX] = 2;
            towerArray.push(tower);
        }
        else if (towerType === "Minigun Tower") {
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
            if (ctx)
                renderMap(ctx, currentMap, towerArray, rectSize, towerSize);
            h2Blue.innerText = `Press E to Start!`;
        }
    });
    // toggle to let the enemy move
    document.addEventListener('keydown', (event) => {
        if (event.key === 'e' || event.key === 'E') {
            if (selectedGamemode == "waves") {
                spawnEnemy(); // set it to spawn enemy until wave logic is fixed
            }
            else if (selectedGamemode == "sandbox") {
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
        // Loop through towers to check which one is clicked and display some UI
        for (let index = 0; index < towerArray.length; index++) {
            const tower = towerArray[index];
            if (mouseX >= tower.x && mouseX <= tower.x + towerSize &&
                mouseY >= tower.y && mouseY <= tower.y + towerSize) {
                // Set this tower as selected
                tower.isClicked = true;
                towerSelected = true;
                currentSelectedTower = tower;
                isTowerClicked = true;
                if (currentSelectedTower) {
                    towerDamage.innerText = `Damage: ${currentSelectedTower.damageDealt}`;
                    towerKills.innerText = `Kills: ${currentSelectedTower.enemiesKilled}`;
                    currentSelectedTower.calculateSellValue();
                    sellButton.innerHTML = `Sell Tower for $${currentSelectedTower.sellValue}`;
                    towerStatisticsContainer.classList.add('active');
                    sellButton.classList.add('active');
                    sellButton.addEventListener('click', () => {
                        if (currentSelectedTower !== null) {
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
        updateStatistics();
    });
    upgradeButtonPath2.addEventListener('click', () => {
        gameCash = upgradePath2(currentSelectedTower, gameCash, upgradeName1, upgradeName2, costLabel1, costLabel2, progressBar1, progressBar2);
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
    if (ctx)
        renderMap(ctx, currentMap, towerArray, rectSize, towerSize); // Render the map initially
    function spawnEnemy() {
        // Create a new enemy at the start position and push it into the enemies array
        const rng = () => Math.floor(Math.random() * 10); // Random number between 0 and 9
        if (selectedMap === 'basicMap') {
            const randomValue = rng(); // Get a random value for the spawn chance
            let newEnemy;
            if (randomValue === 0) {
                // 1/10 chance for an ArmoredEnemy
                newEnemy = new ArmoredEnemy(0, 300 / 50 * rectSize, rectSize);
            }
            else {
                // 50% chance for either NormalEnemy or FastEnemy if it's not an ArmoredEnemy
                newEnemy = (randomValue <= 5) ? new NormalEnemy(0, 300 / 50 * rectSize, rectSize) : new FastEnemy(0, 300 / 50 * rectSize, rectSize);
            }
            enemies.push(newEnemy);
        }
        else if (selectedMap === 'easyMap') {
            const randomValue = rng(); // Get a random value for the spawn chance
            let newEnemy;
            if (randomValue === 0) {
                // 1/10 chance for a NormalEnemy
                newEnemy = new NormalEnemy(350 / 50 * rectSize, 500 / 50 * rectSize, rectSize);
            }
            else {
                // 50/50 chance for either FastEnemy or NormalEnemy if it's not the ArmoredEnemy
                newEnemy = (randomValue <= 5) ? new NormalEnemy(350 / 50 * rectSize, 500 / 50 * rectSize, rectSize) : new FastEnemy(350 / 50 * rectSize, 500 / 50 * rectSize, rectSize);
            }
            enemies.push(newEnemy);
        }
        currentPathIndex.push(0); // Start at the beginning of the path for this enemy
    }
    // Start rendering and movement
    function gameLoop(timestamp) {
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            const { rectSize, towerSize, enemySize } = resizeCanvas(towerArray, canvas);
            renderMap(ctx, currentMap, towerArray, rectSize, towerSize);
            towerArray.forEach(tower => {
                if (tower.isClicked) {
                    towerDamage.innerText = `Damage: ${tower.damageDealt}`;
                    towerKills.innerText = `Kills: ${tower.enemiesKilled}`;
                    tower.calculateSellValue();
                    sellButton.innerHTML = `Sell Tower for $${tower.sellValue}`;
                }
            });
            // Retrieve new tower data
            const newTowerData = getNewTowerData();
            // Process each new tower placement from other players
            newTowerData.forEach((towerData) => {
                console.log('New tower placed by another player:', towerData);
                placeIncomingTower(towerData.gridX, towerData.gridY, currentMap, towerData.towerType, rectSize);
            });
            bullets.forEach((bullet, index) => {
                const currentTime = performance.now();
                if (currentTime - bullet.bulletFired >= 250) {
                    bullet.bulletRender = false;
                }
                if (bullet.bulletRender) {
                    bullet.move(enemies, ctx); // Move the bullet and check for collisions with enemies
                }
                else {
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
    function moveEnemies(enemySize) {
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
                }
                else {
                    // Move towards the target position
                    enemyPositionX += (dx / distance) * speed;
                    enemyPositionY += (dy / distance) * speed;
                    enemy.setPosition(enemyPositionX, enemyPositionY);
                }
                if (!gameLost) { // if the game is lost, towers don't attack
                    let bullet = null; // Initialize as null
                    // Check if the enemy can attack towers
                    towerArray.forEach(tower => {
                        const distanceToTower = Math.sqrt(Math.pow(tower.x - enemyPositionX, 2) + Math.pow(tower.y - enemyPositionY, 2));
                        if (distanceToTower <= tower.range) {
                            const currentTime = performance.now(); // Get the current time in milliseconds
                            // Check if enough time has passed since the last shot
                            if (currentTime - tower.lastFired >= (1000 / tower.fireRate)) {
                                // Depending on the tower type, assign the appropriate bullet to the shared 'bullet' variable
                                if (tower.name === 'Marksman Tower') {
                                    if (tower.path1Upgrades >= 2) {
                                        tower.path2Upgrades >= 2 ? bullet = new marksmanBullet(tower.damage, tower.x, tower.y, enemyPositionX, enemyPositionY, towerSize, enemySize, tower.path2Upgrades, tower.pierce, 30, tower, true) : bullet = new marksmanBullet(tower.damage, tower.x, tower.y, enemyPositionX, enemyPositionY, towerSize, enemySize, tower.path2Upgrades, tower.pierce, 15, tower, true);
                                    }
                                    else {
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
    if (ctx)
        renderMap(ctx, currentMap, towerArray, rectSize, towerSize);
    requestAnimationFrame(gameLoop); // Start the animation
});
/// <reference path="game.ts" />
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
// make a div to store tower info in the right container
const towerDiv = document.createElement('div');
towerDiv.id = 'towerDiv';
if (rightContainer)
    rightContainer.appendChild(towerDiv);
// create divs to store tower info in the towerDiv
const singleShotTowerDiv = document.createElement('div');
const minigunTowerDiv = document.createElement('div');
// Create text elements for the towers
const singleShotTowerText = document.createElement('h3');
singleShotTowerText.innerText = 'Single Shot\nTower';
const minigunTowerText = document.createElement('h3');
minigunTowerText.innerText = 'Minigun\nTower';
// Create images for the towers
const singleShotTowerImg = document.createElement('img');
singleShotTowerImg.src = '/towerImages/SST.jpg';
singleShotTowerImg.alt = 'Single Shot Tower';
const minigunTowerImg = document.createElement('img');
minigunTowerImg.src = '/towerImages/MT.jpg';
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
if (towerDiv) {
    towerDiv.appendChild(singleShotTowerDiv);
    towerDiv.appendChild(minigunTowerDiv);
}
const sellButton = document.createElement('button');
sellButton.id = 'sellButton';
sellButton.innerText = 'Sell Tower';
bottomContainer?.appendChild(sellButton);
const towerStatisticsContainer = document.createElement('div');
const towerDamage = document.createElement('h2');
const towerKills = document.createElement('h2');
towerDamage.innerText = "Damage: 0";
towerKills.innerText = "Kills: 0";
towerStatisticsContainer.id = 'towerStatisticsContainer';
towerStatisticsContainer.appendChild(towerDamage);
towerStatisticsContainer.appendChild(towerKills);
if (bottomContainer)
    bottomContainer.appendChild(towerStatisticsContainer);
const upgradeContainer = document.createElement('div');
upgradeContainer.id = 'upgradeContainer';
// Create the first button with all required elements
const upgradeButtonPath1 = document.createElement('div');
upgradeButtonPath1.id = 'upgradeButtonPath1';
upgradeButtonPath1.className = 'upgradeButton';
// Title for Button 1
const upgradeName1 = document.createElement('div');
upgradeName1.className = 'upgradeName';
upgradeName1.innerText = 'Select a tower to upgrade it';
// Image Box for Button 1
const imageBox1 = document.createElement('div');
imageBox1.className = 'imageBox';
const upgradeIMG1 = document.createElement('img');
upgradeIMG1.className = 'upgradeIMG';
upgradeIMG1.alt = 'Upgrade Image 1';
imageBox1.appendChild(upgradeIMG1);
// Cost Label for Button 1
const costLabel1 = document.createElement('div');
costLabel1.className = 'costLabel';
costLabel1.innerText = 'Select a tower'; // Replace with actual cost
// Progress Bar for Button 1
const progressBarContainer1 = document.createElement('div');
progressBarContainer1.className = 'progressBarContainer';
let progressBar1 = [];
for (let index = 0; index < 4; index++) {
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar'); // Add the styling class
    progressBar1.push(progressBar); // Add to the array
    progressBarContainer1.appendChild(progressBar); // Append to the container
}
// Append all elements to Button 1
upgradeButtonPath1.appendChild(upgradeName1);
upgradeButtonPath1.appendChild(imageBox1);
upgradeButtonPath1.appendChild(costLabel1);
upgradeButtonPath1.appendChild(progressBarContainer1);
// Create the second button with all required elements
const upgradeButtonPath2 = document.createElement('div'); // Use div instead of button for better structure
upgradeButtonPath2.id = 'upgradeButtonPath2';
upgradeButtonPath2.className = 'upgradeButton'; // Optional: Add a class for additional styling if needed
// Title for Button 2
const upgradeName2 = document.createElement('div');
upgradeName2.className = 'upgradeName';
upgradeName2.innerText = 'Select a tower to upgrade it';
// Image Box for Button 2
const imageBox2 = document.createElement('div');
imageBox2.className = 'imageBox';
const upgradeIMG2 = document.createElement('img');
upgradeIMG2.className = 'upgradeIMG';
upgradeIMG2.alt = 'Upgrade Image 2';
imageBox2.appendChild(upgradeIMG2);
// Cost Label for Button 2
const costLabel2 = document.createElement('div');
costLabel2.className = 'costLabel';
costLabel2.innerText = 'Select a tower'; // Replace with actual cost
// Progress Bar for Button 2
const progressBarContainer2 = document.createElement('div');
progressBarContainer2.className = 'progressBarContainer';
let progressBar2 = [];
for (let index = 0; index < 4; index++) {
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar'); // Add the styling class
    progressBar2.push(progressBar); // Add to the array
    progressBarContainer2.appendChild(progressBar); // Append to the container
}
// Append all elements to Button 2
upgradeButtonPath2.appendChild(upgradeName2);
upgradeButtonPath2.appendChild(imageBox2);
upgradeButtonPath2.appendChild(costLabel2);
upgradeButtonPath2.appendChild(progressBarContainer2);
// Append both buttons to the parent container
upgradeContainer.appendChild(upgradeButtonPath1);
upgradeContainer.appendChild(upgradeButtonPath2);
// Append the container to the body
if (bottomContainer)
    bottomContainer.appendChild(upgradeContainer);
let currentSelectedTower = null;
function updateUIAfterTowerNotClicked() {
    upgradeName1.innerText = 'Select a tower to upgrade it';
    upgradeName2.innerText = 'Select a tower to upgrade it';
    costLabel1.innerText = 'Select a tower';
    costLabel2.innerText = 'Select a tower';
    removeLightUpBar(4, progressBar1);
    removeLightUpBar(4, progressBar2);
    currentSelectedTower = null;
    towerStatisticsContainer.classList.remove('active');
    sellButton.classList.remove('active');
}
// Clear the canvas before rendering
function clearCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function calculateNewRectSize(width) {
    return Math.floor(width / 30);
}
// Initial rendering of the map
function renderMap(ctx, currentMap, towerArray, rectSize, towerSize) {
    if (ctx) {
        // Render the map
        for (let i = 0; i < currentMap.length; i++) {
            for (let j = 0; j < currentMap[i].length; j++) {
                ctx.fillStyle = currentMap[i][j] === 1 ? 'white' : 'black';
                ctx.fillRect(j * rectSize, i * rectSize, rectSize, rectSize);
            }
        }
        // Render the towers based on 2 or 3 in currentMap
        towerArray.forEach(tower => {
            // Calculate tower's grid position (i, j) based on the tower's original x and y
            const gridX = Math.floor(tower.gridX * rectSize);
            const gridY = Math.floor(tower.gridY * rectSize);
            // Render the tower at the recalculated grid position
            tower.render(ctx, towerSize, gridX, gridY);
        });
        towerArray.forEach(tower => {
            tower.renderRange(ctx);
        });
    }
}
function averageToNumber(value, average) {
    return Math.floor(value / average) * average;
}
// not functional function to update the map based on the windows resize
// function updatePath(rectSize: number,currentMapIndex: number, currentMapPath: {x: number, y: number}[], enemyPaths: { x: number; y: number }[][] = []): { x: number; y: number }[][] {
//     if (currentMapIndex === 0) {
//         currentMapPath = returnBasicMapPath();
//     }
//     currentMapPath.forEach((path, index) => {
//         const x = path.x * rectSize;
//         const y = path.y * rectSize;
//         enemyPaths[currentMapIndex][index] = { x, y };
//     });
//     return enemyPaths;
// }
function resizeCanvas(towerArray, canvas, enemyPaths = []) {
    const updateSizes = () => {
        canvas.width = averageToNumber((window.innerWidth / 100) * 78.125, 10);
        canvas.height = averageToNumber((window.innerHeight / 100) * 83.333, 10);
        const newRectSize = calculateNewRectSize(canvas.width); // Update the rectSize
        const newTowerSize = newRectSize; // Update the size of each tower
        const newEnemySize = newRectSize / 2; // Update the size of each enemy
        // Adjust tower positions based on the new rectSize
        towerArray.forEach(tower => {
            // Recalculate the tower's screen position
            tower.x = tower.gridX * newRectSize;
            tower.y = tower.gridY * newRectSize;
        });
        return { rectSize: newRectSize, towerSize: newTowerSize, enemySize: newEnemySize };
    };
    window.addEventListener('resize', updateSizes);
    return updateSizes();
}
let PATH1LOCKED = false;
let PATH2LOCKED = false;
function lightUpBar(number, progressBar) {
    for (let index = 0; index < number && index < progressBar.length; index++) {
        progressBar[index].classList.add('active');
    }
}
function removeLightUpBar(number, progressBar) {
    for (let index = 0; index < number && index < progressBar.length; index++) {
        progressBar[index].classList.remove('active');
    }
}
// Function to update the upgrade buttons based on the tower's current upgrades
const updateButton = (currentSelectedTower, button1, button2, cost1, cost2, progressBar1 = [], progressBar2 = []) => {
    const path1Upgrades = currentSelectedTower.path1Upgrades;
    const path2Upgrades = currentSelectedTower.path2Upgrades;
    // Determine lock states based on upgrade levels
    PATH1LOCKED = path1Upgrades >= 2;
    PATH2LOCKED = path2Upgrades >= 2;
    let costPath1 = currentSelectedTower.returnCost(path1Upgrades, 1);
    let costPath2 = currentSelectedTower.returnCost(path2Upgrades, 2);
    removeLightUpBar(4, progressBar1);
    removeLightUpBar(4, progressBar2);
    lightUpBar(path1Upgrades, progressBar1);
    lightUpBar(path2Upgrades, progressBar2);
    // Update Path 1 button
    if (path1Upgrades >= 4) {
        button1.innerText = 'MAX UPGRADED';
        button1.style.pointerEvents = 'none';
        cost1.innerText = 'MAX';
    }
    else if (currentSelectedTower.path2Upgrades > 2 && path1Upgrades >= 2) {
        button1.innerText = 'PATH LOCKED';
        button1.style.pointerEvents = 'none';
        cost1.innerText = 'LOCKED';
    }
    else {
        cost1.innerText = "$" + costPath1.toString();
        button1.style.pointerEvents = 'auto'; // Make button clickable
        button1.style.backgroundColor = ''; // Reset style
        if (path1Upgrades == 0) {
            button1.innerText = "Improved Rifle";
        }
        else if (path1Upgrades == 1) {
            button1.innerText = "Armor Piercing Bullets";
        }
        else if (path1Upgrades == 2) {
            button1.innerText = "Deadly Precision";
        }
        else if (path1Upgrades == 3) {
            button1.innerText = "idk some final upgrade";
        }
    }
    // Update Path 2 button
    if (path2Upgrades >= 4) {
        button2.innerText = 'MAX UPGRADED';
        button2.style.pointerEvents = 'none';
        cost2.innerText = 'MAX';
    }
    else if (currentSelectedTower.path1Upgrades > 2 && path2Upgrades >= 2) {
        button2.innerText = 'PATH LOCKED';
        button2.style.pointerEvents = 'none';
        cost2.innerText = 'LOCKED';
    }
    else {
        cost2.innerText = "$" + costPath2.toString();
        button2.style.pointerEvents = 'auto'; // Make button clickable
        button2.style.backgroundColor = ''; // Reset style
        if (path2Upgrades == 0) {
            button2.innerText = "Faster Firing";
        }
        else if (path2Upgrades == 1) {
            button2.innerText = "Binoculars";
        }
        else if (path2Upgrades == 2) {
            button2.innerText = "Automatic Rifle";
        }
        else if (path2Upgrades == 3) {
            button2.innerText = "idk some final upgrade 2";
        }
    }
};
// Function to handle upgrading Path 1
function upgradePath1(currentSelectedTower, gameCash, upgradeButtonPath1, upgradeButtonPath2, cost1, cost2, progressBar1 = [], progressBar2 = []) {
    const path1Upgrades = currentSelectedTower.path1Upgrades;
    // Check if Path 1 is locked or maxed out
    if (currentSelectedTower.path2Upgrades > 2 && path1Upgrades >= 2) {
        return gameCash;
    }
    let costPath1 = currentSelectedTower.returnCost(path1Upgrades, 1);
    if (!isNaN(costPath1))
        currentSelectedTower.modifyTotalCost(costPath1);
    // Check if the player can afford the upgrade
    if (gameCash >= costPath1) {
        // Deduct the upgrade cost
        gameCash -= costPath1;
        // Upgrade the tower
        currentSelectedTower.upgradePath1();
        // Update the buttons after upgrading
        updateButton(currentSelectedTower, upgradeButtonPath1, upgradeButtonPath2, cost1, cost2, progressBar1, progressBar2);
    }
    else {
        // Not enough money, show a warning message
        if (!(path1Upgrades == 4)) {
            upgradeButtonPath1.innerText = 'NOT ENOUGH MONEY';
        }
        setTimeout(() => {
            updateButton(currentSelectedTower, upgradeButtonPath1, upgradeButtonPath2, cost1, cost2, progressBar1, progressBar2);
        }, 1500);
    }
    return gameCash;
}
// Function to handle upgrading Path 2
function upgradePath2(currentSelectedTower, gameCash, upgradeButtonPath1, upgradeButtonPath2, cost1, cost2, progressBar1 = [], progressBar2 = []) {
    const path2Upgrades = currentSelectedTower.path2Upgrades;
    if (currentSelectedTower.path1Upgrades > 2 && path2Upgrades >= 2) {
        return gameCash; // Can't upgrade
    }
    let costPath2 = currentSelectedTower.returnCost(path2Upgrades, 2);
    if (!isNaN(costPath2))
        currentSelectedTower.modifyTotalCost(costPath2);
    // Check if the player can afford the upgrade
    if (gameCash >= costPath2) {
        // Deduct the upgrade cost
        gameCash -= costPath2;
        // Upgrade the tower
        currentSelectedTower.upgradePath2();
        // Update the buttons after upgrading
        updateButton(currentSelectedTower, upgradeButtonPath1, upgradeButtonPath2, cost1, cost2, progressBar1, progressBar2);
    }
    else {
        // Not enough money, show a warning message
        if (!(path2Upgrades == 4)) {
            upgradeButtonPath2.innerText = 'NOT ENOUGH MONEY';
        }
        setTimeout(() => {
            updateButton(currentSelectedTower, upgradeButtonPath1, upgradeButtonPath2, cost1, cost2, progressBar1, progressBar2);
        }, 1500);
    }
    return gameCash;
}
class bullet {
    damage;
    towerOfOrigin; // Tower that fired the bullet
    x; // Current position of the bullet
    y; // Current position of the bullet
    targetX; // Target position (center of the enemy)
    targetY; // Target position (center of the enemy)
    towerSize;
    enemySize;
    towerUpgrade;
    pierce;
    size = 12.5; // Size of the bullet   
    hitEnemies; // Set to store enemies that have been hit by the bullet
    lastX; // To detect if the bullet is stuck
    lastY; // To detect if the bullet is stuck
    bulletFired = 0;
    bulletRender = true;
    speed;
    armorPiercing;
    constructor(damage, towerX, towerY, enemyX, enemyY, towerSize, enemySize, towerUpgrade, pierce, speed, towerOfOrigin, armorPiercing) {
        this.damage = damage;
        this.towerSize = towerSize;
        this.hitEnemies = new Set();
        this.enemySize = enemySize;
        this.x = towerX + (this.towerSize - 10) / 2; // Center the bullet in the tower
        this.y = towerY + (this.towerSize - 10) / 2;
        this.targetX = enemyX + (this.enemySize - 10) / 2; // Center the bullet in the enemy
        this.targetY = enemyY + (this.enemySize - 10) / 2;
        this.towerUpgrade = towerUpgrade;
        this.pierce = pierce;
        this.lastX = this.x; // Initial position   
        this.lastY = this.y;
        this.speed = speed;
        this.towerOfOrigin = towerOfOrigin;
        this.armorPiercing = armorPiercing;
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
        // Draw the border around the bullet
        ctx.strokeStyle = 'white'; // Set color for the border
        ctx.lineWidth = 2; // Set line width for the border
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
        const speed = this.speed; // Speed of the bullet
        // Move the bullet in its current direction
        let dx = this.targetX - this.x;
        let dy = this.targetY - this.y;
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        let hpOverflow;
        if (magnitude !== 0) {
            // Normalize the direction vector and move the bullet
            const directionX = dx / magnitude;
            const directionY = dy / magnitude;
            this.x += directionX * speed;
            this.y += directionY * speed;
        }
        // Track the previous position to detect if the bullet is stuck
        // const hasMoved = this.lastX !== this.x || this.lastY !== this.y;
        this.lastX = this.x;
        this.lastY = this.y;
        // Check if bullet has hit an enemy and hasn't hit it before
        enemies.forEach((enemy) => {
            const enemyCenterX = enemy.x + (this.enemySize - 10) / 2;
            const enemyCenterY = enemy.y + (this.enemySize - 10) / 2;
            if (this.x >= enemyCenterX - 12.5 && this.x <= enemyCenterX + 12.5 &&
                this.y >= enemyCenterY - 12.5 && this.y <= enemyCenterY + 12.5 &&
                !this.hitEnemies.has(enemy)) { // Only hit if not already hit
                // Collision detected, apply damage, and add it to the total damage dealt by the tower
                if (!(this.towerOfOrigin.armorPiercing === false && enemy.fortified === true)) {
                    const hpOverflow = enemy.takeDamage(this.damage);
                    if (hpOverflow != null) {
                        if (hpOverflow <= 0) {
                            this.towerOfOrigin.addDamageDealt(hpOverflow);
                            if (!this.hitEnemies.has(enemy)) {
                                this.towerOfOrigin.addEnemyKilled();
                            }
                        }
                        else {
                            this.towerOfOrigin.addDamageDealt(0);
                        }
                    }
                    this.hitEnemies.add(enemy); // Mark enemy as hit
                    // Decrease pierce count
                    this.pierce--;
                }
                else {
                    this.pierce = 0;
                }
                if (this.pierce > 0) {
                    // Continue moving in the same direction, but further out
                    const pierceDistance = 50; // Travel a bit beyond the enemy
                    this.targetX += (dx / magnitude) * pierceDistance; // Adjust target position
                    this.targetY += (dy / magnitude) * pierceDistance;
                }
                else {
                    // If no pierce left, mark as off-screen to be removed
                    this.x = -100;
                    this.y = -100;
                }
            }
        });
        // Render the bullet
        this.render(ctx);
    }
    isOutOfBounds(canvasWidth, canvasHeight) {
        return this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight;
    }
}
class classicBullet extends bullet {
    constructor(damage, towerX, towerY, enemyX, enemyY, towerSize, enemySize, towerUpgrade, pierce, speed, towerOfOrigin) {
        // Call the parent class constructor
        super(damage, towerX, towerY, enemyX, enemyY, towerSize, enemySize, towerUpgrade, pierce, speed, towerOfOrigin, false);
    }
    render(ctx) {
        ctx.fillStyle = 'black'; // Set fill style for the bullet
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();
        // Draw the border around the bullet
        ctx.strokeStyle = 'white'; // Set color for the border
        ctx.lineWidth = 2; // Set line width for the border
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.stroke();
        const smallSquareSize = 2;
        const smallSquareX = this.x - smallSquareSize / 2;
        const smallSquareY = this.y - smallSquareSize / 2;
        if (this.towerUpgrade == 1) {
            ctx.fillStyle = 'red';
        }
        else {
            ctx.fillStyle = 'white';
        }
        ctx.fillRect(smallSquareX, smallSquareY, smallSquareSize, smallSquareSize);
    }
}
class marksmanBullet extends bullet {
    constructor(damage, towerX, towerY, enemyX, enemyY, towerSize, enemySize, towerUpgrade, pierce, speed, towerOfOrigin, armorPiercing) {
        // Call the parent class constructor
        super(damage, towerX, towerY, enemyX, enemyY, towerSize, enemySize, towerUpgrade, pierce, speed, towerOfOrigin, false);
    }
    render(ctx) {
        ctx.fillStyle = 'black'; // Set fill style for the bullet
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();
        // Draw the border around the bullet
        ctx.strokeStyle = 'white'; // Set color for the border
        ctx.lineWidth = 2; // Set line width for the border
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.stroke();
        const smallSquareSize = 2;
        const smallSquareX = this.x - smallSquareSize / 2;
        const smallSquareY = this.y - smallSquareSize / 2;
        if (this.towerUpgrade == 1) {
            ctx.fillStyle = 'red';
        }
        else {
            ctx.fillStyle = 'white';
        }
        ctx.fillRect(smallSquareX, smallSquareY, smallSquareSize, smallSquareSize);
    }
}
class Enemy {
    x;
    y;
    speed;
    health;
    size;
    gridSize;
    fortified;
    maxHealth;
    constructor(speed, x, y, health, size, gridSize, fortified, maxHealth) {
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.health = health;
        this.size = size;
        this.gridSize = gridSize;
        this.fortified = fortified;
        this.maxHealth = maxHealth;
    }
    // Method to apply damage to the enemy
    takeDamage(amount) {
        this.health -= amount;
        return this.health;
    }
    // Method to render the enemy on the canvas
    render(ctx, size) {
        // Calculate the color based on health
        const healthPercentage = Math.max(0, Math.min(100, this.health));
        const red = Math.floor(255 * (1 - healthPercentage / 100)); // R component from 0 (black) to 255 (white)
        const green = Math.floor(255 * (1 - healthPercentage / 100)); // G component from 0 (black) to 255 (white)
        const blue = Math.floor(255 * (1 - healthPercentage / 100)); // B component from 0 (black) to 255 (white)
        this.size = size; // Set the size of the enemy
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
    calculateHealthColor(health, maxHealth) {
        const currentHealth = Math.max(0, health);
        const red = Math.floor(255 * (1 - currentHealth / maxHealth)); // R component from 0 (black) to 255 (white)
        const green = Math.floor(255 * (1 - currentHealth / maxHealth)); // G component from 0 (black) to 255 (white)
        const blue = Math.floor(255 * (1 - currentHealth / maxHealth)); // B component from 0 (black) to 255 (white)
        return [red, green, blue];
    }
}
/// <reference path="enemyClass.ts"/> 
class ArmoredEnemy extends Enemy {
    constructor(x, y, gridSize) {
        // NormalEnemy with standard speed, health, and size
        super(0.25, x, y, 200, gridSize / 1.5, gridSize, true, 200); // speed, x, y, health, size, gridSize, fortified
    }
    render(ctx, size) {
        // Calculate the color based on health
        const colorsArray = this.calculateHealthColor(this.health, this.maxHealth);
        const red = colorsArray[0];
        const green = colorsArray[1];
        const blue = colorsArray[2];
        this.size = size; // Set the size of the enemy
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`; // Set fill style based on health
        ctx.beginPath();
        // Center the enemy in the grid cell
        let centeredX = this.x + (this.gridSize - this.size) / 2; // Center it horizontally
        let centeredY = this.y + (this.gridSize - this.size) / 2; // Center it vertically
        ctx.rect(centeredX, centeredY, this.size, this.size); // Draw the enemy
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        centeredX = (this.x + (this.gridSize - this.size) / 2) - (this.size / 100) * 25;
        centeredY = (this.y + (this.gridSize - this.size) / 2) - (this.size / 100) * 25;
        ctx.rect(centeredX, centeredY, this.size * 1.5, this.size * 1.5); // Draw the enemy
        ctx.stroke();
    }
}
class FastEnemy extends Enemy {
    constructor(x, y, gridSize) {
        // NormalEnemy with standard speed, health, and size
        super(1.5, x, y, 50, gridSize / 2, gridSize, false, 50); // speed, x, y, health, size, gridSize, fortified
    }
    render(ctx, size) {
        // Calculate the color based on health
        const colorsArray = this.calculateHealthColor(this.health, this.maxHealth);
        const red = colorsArray[0];
        const green = colorsArray[1];
        const blue = colorsArray[2];
        this.size = size; // Set the size of the enemy
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`; // Set fill style based on health
        ctx.beginPath();
        // Center the enemy in the grid cell
        const centeredX = this.x + (this.gridSize - this.size) / 2; // Center it horizontally
        const centeredY = this.y + (this.gridSize - this.size) / 2; // Center it vertically
        ctx.rect(centeredX, centeredY, this.size, this.size); // Draw the enemy
        ctx.fill();
    }
}
class NormalEnemy extends Enemy {
    constructor(x, y, gridSize) {
        // NormalEnemy with standard speed, health, and size
        super(0.5, x, y, 100, gridSize / 2, gridSize, false, 50); // speed, x, y, health, size, gridSize, fortified
    }
    render(ctx, size) {
        // Calculate the color based on health
        const colorsArray = this.calculateHealthColor(this.health, this.maxHealth);
        const red = colorsArray[0];
        const green = colorsArray[1];
        const blue = colorsArray[2];
        this.size = size; // Set the size of the enemy
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`; // Set fill style based on health
        ctx.beginPath();
        // Center the enemy in the grid cell
        const centeredX = this.x + (this.gridSize - this.size) / 2; // Center it horizontally
        const centeredY = this.y + (this.gridSize - this.size) / 2; // Center it vertically
        ctx.rect(centeredX, centeredY, this.size, this.size); // Draw the enemy
        ctx.fill();
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
/// <reference path="gameMap.ts" />
function returnBasicMap() {
    return [
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
}
function returnBasicMapPath() {
    return [
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
}
function returnEasyMap() {
    return [
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
}
;
function returnEasyMapPath() {
    return [
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
}
class Tower {
    range;
    damage;
    fireRate;
    lastFired = 0;
    x;
    y;
    gridX; // Add gridX to store tower's position in the grid
    gridY; // Add gridY to store tower's position in the grid
    cost;
    size;
    isClicked;
    path1Upgrades = 0;
    path2Upgrades = 0;
    towerColor = 'black';
    towerColorWhenClicked = 'gray';
    pierce = 1;
    name = 'Tower'; // Name of the tower
    UPGRADE_COSTS = {
        PATH1: [10, 100, 1000, 10000], // Default costs for Path 1
        PATH2: [15, 300, 1500, 15000] // Default costs for Path 2
    };
    sellValue = 1;
    totalCost = 0;
    damageDealt = 0;
    enemiesKilled = 0;
    armorPiercing = false;
    constructor(range, damage, fireRate, x, y, cost, size, isClicked, pierce, name, UPGRADE_COSTS, sellValue = cost, totalCost = cost) {
        this.range = range;
        this.damage = damage;
        this.fireRate = fireRate;
        this.x = x;
        this.y = y;
        this.gridX = -1; // Set gridX from constructor
        this.gridY = -1; // Set gridY from constructor
        this.cost = cost;
        this.size = size;
        this.isClicked = isClicked;
        this.pierce = pierce;
        this.name = name;
        this.UPGRADE_COSTS = UPGRADE_COSTS;
        this.sellValue = sellValue;
        this.totalCost = totalCost;
    }
    setPositionInGrid(x, y, gridSize) {
        this.gridX = Math.floor(x / gridSize); // Set the gridX coordinate
        this.gridY = Math.floor(y / gridSize); // Set the gridY coordinate
    }
    // Upgrade methods
    upgradePath1() {
        this.path1Upgrades++;
    }
    upgradePath2() {
        this.path2Upgrades++;
    }
    calculateSellValue() {
        this.sellValue = Math.floor(this.totalCost * 0.85);
    }
    modifyTotalCost(cost) {
        this.totalCost += cost;
        this.calculateSellValue();
    }
    sellTower(gameCash, tower, towerArray, sellValue) {
        gameCash += sellValue;
        towerArray.splice(towerArray.indexOf(tower), 1);
        return gameCash;
    }
    // Method to render the tower on the canvas
    render(ctx, size, x, y) {
        this.size = size; // Set the size of the tower
        this.x = x;
        this.y = y;
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
    }
    renderRange(ctx) {
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
    returnCost(index, path) {
        if (path == 1) {
            return this.UPGRADE_COSTS.PATH1[index];
        }
        else {
            return this.UPGRADE_COSTS.PATH2[index];
        }
    }
    addDamageDealt(substract) {
        this.damageDealt += this.damage - substract;
    }
    addEnemyKilled() {
        this.enemiesKilled++;
    }
}
/**
 * Represents a Single Shot Tower in the game.
 *
 * @extends Tower
 *
 * @param {number} x - The x-coordinate of the tower's position.
 * @param {number} y - The y-coordinate of the tower's position.
 * @param {boolean} isClicked - Indicates whether the tower is clicked.
 * @param {number} gridSize - The size of the grid the tower resides in.
 * @param {number} pierce - The pierce value for this tower.
 * @param {number} gridX - The grid X-coordinate of the tower.
 * @param {number} gridY - The grid Y-coordinate of the tower.
 *
*/
/// <reference path="towerClass.ts"/>
class MarksmanTower extends Tower {
    constructor(x, y, isClicked, gridSize, pierce, name, UPGRADE_COSTS = {
        PATH1: [100, 500, 1000, 10000], // Costs for Path 1
        PATH2: [150, 450, 750, 12500] // Costs for Path 2
    }, sellValue = 0, totalCost = 100, armorPiercing = false) {
        // Call the parent constructor with correctly ordered values
        super(150, 5, 1000, x, y, 100, gridSize, isClicked, pierce, name, UPGRADE_COSTS, sellValue, totalCost);
    }
    upgradePath1() {
        if (this.path1Upgrades === 0) {
            this.damage += 3;
            this.pierce += 1;
        }
        else if (this.path1Upgrades === 1) {
            this.damage += 2;
            this.pierce += 1;
            this.armorPiercing = true;
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
    upgradePath2() {
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
    render(ctx, size, x, y) {
        this.size = size; // Set the size of the tower
        this.x = x;
        this.y = y;
        // Draw the base color (entire area)
        ctx.fillStyle = this.towerColor; // Use the normal tower color
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();
        // Draw the border around the tower
        if (this.path1Upgrades === 1) {
            ctx.strokeStyle = 'red'; // Set color for the border
        }
        else if (this.path1Upgrades === 2) {
            ctx.strokeStyle = 'purple'; // Set color for the border
        }
        else if (this.path1Upgrades === 3) {
            ctx.strokeStyle = 'blue'; // Set color for the border
        }
        else if (this.path1Upgrades === 4) {
            ctx.strokeStyle = 'green'; // Set color for the border
        }
        else {
            ctx.strokeStyle = 'white'; // Set color for the border
        }
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
        if (this.path2Upgrades === 1) {
            ctx.fillStyle = 'red'; // Set color
        }
        else if (this.path2Upgrades === 2) {
            ctx.fillStyle = 'purple'; // Set color
        }
        else if (this.path2Upgrades === 3) {
            ctx.fillStyle = 'blue'; // Set color
        }
        else if (this.path2Upgrades === 4) {
            ctx.fillStyle = 'green'; // Set color
        }
        else {
            ctx.fillStyle = 'white'; // Set color
        }
        ctx.fillRect(smallSquareX, smallSquareY, smallSquareSize, smallSquareSize); // Draw the small square
    }
    renderRange(ctx) {
        // Draw the range of the tower with filling
        if (this.isClicked) {
            // Set the range color based on upgrades
            let rangeColor;
            if (this.path1Upgrades === 1) {
                rangeColor = 'pink'; // Set color for the border
            }
            else if (this.path1Upgrades === 2) {
                rangeColor = 'violet'; // Set color for the border
            }
            else if (this.path1Upgrades === 3) {
                rangeColor = 'lightblue'; // Set color for the border
            }
            else if (this.path1Upgrades === 4) {
                rangeColor = 'lightgreen'; // Set color for the border
            }
            else {
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
}
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
    constructor(x, y, isClicked, gridSize, pierce, name, UPGRADE_COSTS = {
        PATH1: [150, 750, 1500, 7500], // Costs for Path 1
        PATH2: [100, 1000, 5000, 10000] // Costs for Path 2
    }, sellValue = 0, totalCost = 125, armorPiercing = false) {
        // Call the parent constructor with specific values for MinigunTower
        super(100, 2, 10, x, y, 100, gridSize, isClicked, pierce, name, UPGRADE_COSTS, sellValue, totalCost);
    }
    render(ctx, size) {
        // Draw the base color (entire area)
        this.size = size;
        ctx.fillStyle = this.towerColor; // Use the normal tower color
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();
        // Draw the border around the tower
        if (this.path1Upgrades === 1) {
            ctx.strokeStyle = 'red'; // Set color for the border
        }
        else if (this.path1Upgrades === 2) {
            ctx.strokeStyle = 'purple'; // Set color for the border
        }
        else if (this.path1Upgrades === 3) {
            ctx.strokeStyle = 'blue'; // Set color for the border
        }
        else if (this.path1Upgrades === 4) {
            ctx.strokeStyle = 'green'; // Set color for the border
        }
        else {
            ctx.strokeStyle = 'white'; // Set color for the border
        }
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
        const smallSquareSize = 10; // Size of the small white square
        const smallSquareX = this.x + (this.size - smallSquareSize) / 2; // Centered x position
        const smallSquareY = this.y + (this.size - smallSquareSize) / 2; // Centered y position
        if (this.path2Upgrades === 1) {
            ctx.fillStyle = 'red'; // Set color
        }
        else if (this.path2Upgrades === 2) {
            ctx.fillStyle = 'purple'; // Set color
        }
        else if (this.path2Upgrades === 3) {
            ctx.fillStyle = 'blue'; // Set color
        }
        else if (this.path2Upgrades === 4) {
            ctx.fillStyle = 'green'; // Set color
        }
        else {
            ctx.fillStyle = 'white'; // Set color
        }
        ctx.fillRect(smallSquareX, smallSquareY, smallSquareSize, smallSquareSize); // Draw the small square
    }
    renderRange(ctx) {
        // Draw the range of the tower with filling
        if (this.isClicked) {
            // Set the range color based on upgrades
            let rangeColor;
            if (this.path1Upgrades === 1) {
                rangeColor = 'pink'; // Set color for the border
            }
            else if (this.path1Upgrades === 2) {
                rangeColor = 'violet'; // Set color for the border
            }
            else if (this.path1Upgrades === 3) {
                rangeColor = 'lightblue'; // Set color for the border
            }
            else if (this.path1Upgrades === 4) {
                rangeColor = 'lightgreen'; // Set color for the border
            }
            else {
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
    upgradePath1() {
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
    upgradePath2() {
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
// todo cant be bothered to fix the wave spawning and enemy coutning logic
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

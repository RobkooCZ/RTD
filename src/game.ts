/**
 * Initializes the game by setting up the canvas, game statistics, and UI elements.
 * Handles game events such as spawning towers, resetting the game, and starting waves.
 * Manages the game loop, rendering, and enemy movement.
 * 
 * @file /c:/Coding/RTD/src/game.ts
 * 
 * @constant {HTMLCanvasElement} canvas - The canvas element for rendering the game map.
 * @constant {HTMLDivElement} gameStats - The container for displaying game statistics.
 * @constant {HTMLDivElement} bottomContainer - The container for bottom UI elements.
 * @constant {HTMLDivElement} rightContainer - The container for right-side UI elements.
 * @constant {HTMLHeadingElement} h2Red - The H2 element for displaying game health.
 * @constant {HTMLHeadingElement} h2Green - The H2 element for displaying game cash.
 * @constant {HTMLHeadingElement} h2Blue - The H2 element for displaying game instructions.
 * @constant {HTMLDivElement} towerDiv - The container for displaying tower information.
 * @constant {HTMLDivElement} singleShotTowerDiv - The container for single shot tower information.
 * @constant {HTMLDivElement} minigunTowerDiv - The container for minigun tower information.
 * @constant {HTMLHeadingElement} singleShotTowerText - The text element for single shot tower.
 * @constant {HTMLHeadingElement} minigunTowerText - The text element for minigun tower.
 * @constant {HTMLImageElement} singleShotTowerImg - The image element for single shot tower.
 * @constant {HTMLImageElement} minigunTowerImg - The image element for minigun tower.
 * @constant {HTMLParagraphElement} singleShotTowerHotkey - The hotkey information for single shot tower.
 * @constant {HTMLParagraphElement} minigunTowerHotkey - The hotkey information for minigun tower.
 * @constant {HTMLParagraphElement} singleShotTowerCost - The cost information for single shot tower.
 * @constant {HTMLParagraphElement} minigunTowerCost - The cost information for minigun tower.
 * @constant {HTMLButtonElement} sellButton - The button for selling towers.
 * @constant {HTMLDivElement} towerStatisticsContainer - The container for displaying tower statistics.
 * @constant {HTMLHeadingElement} towerDamage - The element for displaying tower damage.
 * @constant {HTMLHeadingElement} towerKills - The element for displaying tower kills.
 * @constant {HTMLButtonElement} backToMainMenu - The button for navigating back to the main menu.
 * @constant {HTMLElement} xButton - The button for closing the settings modal.
 * @constant {HTMLElement} settingsModal - The modal for game settings.
 * @constant {HTMLElement} settingsIcon - The icon for opening the settings modal.
 * @constant {HTMLDivElement} upgradeContainer - The container for displaying upgrade options.
 * @constant {HTMLDivElement} upgradeButtonPath1 - The first upgrade button.
 * @constant {HTMLDivElement} upgradeButtonPath2 - The second upgrade button.
 * @constant {HTMLDivElement} upgradeName1 - The name element for the first upgrade button.
 * @constant {HTMLDivElement} upgradeName2 - The name element for the second upgrade button.
 * @constant {HTMLDivElement} imageBox1 - The image box for the first upgrade button.
 * @constant {HTMLDivElement} imageBox2 - The image box for the second upgrade button.
 * @constant {HTMLImageElement} upgradeIMG1 - The image element for the first upgrade button.
 * @constant {HTMLImageElement} upgradeIMG2 - The image element for the second upgrade button.
 * @constant {HTMLDivElement} costLabel1 - The cost label for the first upgrade button.
 * @constant {HTMLDivElement} costLabel2 - The cost label for the second upgrade button.
 * @constant {HTMLDivElement} progressBarContainer1 - The progress bar container for the first upgrade button.
 * @constant {HTMLDivElement} progressBarContainer2 - The progress bar container for the second upgrade button.
 * @constant {HTMLDivElement[]} progressBar1 - The progress bars for the first upgrade button.
 * @constant {HTMLDivElement[]} progressBar2 - The progress bars for the second upgrade button.
 * @constant {Tower | null} currentSelectedTower - The currently selected tower for upgrades.
 * @constant {number} rectSize - The size of each grid cell.
 * @constant {number} towerSize - The size of each tower.
 * @constant {number} enemySize - The size of each enemy.
 * @constant {Tower[]} towerArray - The array to store the towers.
 * @constant {bullet[]} bullets - The array to store bullets.
 * @constant {Enemy[]} enemies - The array to store enemies.
 * @constant {number[]} currentPathIndex - The array to track path indices for multiple enemies.
 * @constant {number} GameHealth - The health of the game.
 * @constant {number} gameCash - The cash available in the game.
 * @constant {number} towerCost - The cost of the tower being placed.
 * @constant {number} SSTC - The cost of the single shot tower.
 * @constant {number} MTC - The cost of the minigun tower.
 * @constant {boolean} gameLost - The flag indicating if the game is lost.
 * @constant {number} currentMapIndex - The index to track the selected map.
 * @constant {gameMap[]} maps - The array to store multiple maps.
 * @constant {number[][]} currentMap - The currently selected map grid.
 * @constant {{ x: number; y: number }[]} currentMapPath - The currently selected map path.
 * @constant {string | null} selectedMap - The selected map from the main menu.
 * @constant {string | null} selectedGamemode - The selected gamemode from the main menu.
 * @constant {boolean} wavesStart - The flag indicating if waves have started.
 * @constant {{ x: number; y: number }[][]} enemyPaths - The array to store enemy paths.
 * @constant {boolean} towerSelected - The flag indicating if a tower is selected.
 * @constant {number} activeEnemiesCount - The number of active enemies.
 * @constant {number} cursorX - The X-coordinate of the cursor.
 * @constant {number} cursorY - The Y-coordinate of the cursor.
 * @constant {number} enemyWavesIndex - The index of the current enemy wave.
 * @constant {number} enemyWaves - The array of enemy waves.
 * 
 * @function averageToNumber - Rounds a given value to the nearest multiple of the specified average.
 * @param {number} value - The number to be rounded.
 * @param {number} average - The average or multiple to which the value should be rounded.
 * @returns {number} The value rounded to the nearest multiple of the average.
 * 
 * @function updateStatistics - Updates the game statistics displayed on the UI.
 * 
 * @function snapToGrid - Snaps coordinates to the nearest grid point.
 * @param {number} value - The value to be snapped.
 * @returns {number} The snapped value.
 * 
 * @function updateUIAfterTowerNotClicked - Updates the UI when no tower is clicked.
 * 
 * @function spawnEnemy - Spawns a new enemy at the start position.
 * 
 * @function gameLoop - The main game loop for rendering and updating game state.
 * @param {number} timestamp - The current timestamp.
 * 
 * @function moveEnemies - Moves all enemies along their paths.
 * @param {number} enemySize - The size of each enemy.
 */
const canvas = document.getElementById('mapCanvas') as HTMLCanvasElement;

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
singleShotTowerText.innerText = 'Single Shot\nTower';

const minigunTowerText = document.createElement('h3');
minigunTowerText.innerText = 'Minigun\nTower';

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

if (bottomContainer) bottomContainer.appendChild(towerStatisticsContainer);

const backToMainMenu = document.getElementsByClassName('backToMainMenu')[0] as HTMLButtonElement;
const xButton = document.getElementById('xIcon') as HTMLElement;
const settingsModal = document.getElementsByClassName('settingsModal')[0] as HTMLElement;
const settingsIcon = document.getElementById('settingsIcon') as HTMLElement;

backToMainMenu.addEventListener('click', () => {
    window.location.href = '../../mainMenu.html';
});

xButton.addEventListener('click', () => {
    settingsModal.classList.remove('active');
});

settingsIcon.addEventListener('click', () => {
    settingsModal.classList.add('active');
});



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
                        updateStatistics();

                            let tower: Tower | null = null; // Initialize as null


                            if (pressedT) {
                                tower = new SingleShotTower(snappedX, snappedY, false, rectSize, 5, "Single Shot Tower");
                                tower.setPositionInGrid(snappedX, snappedY, rectSize); 
                            } else if (pressedS) {
                                tower = new minigunTower(snappedX, snappedY, false, rectSize, 2, "Minigun Tower"); 
                                tower.setPositionInGrid(snappedX, snappedY, rectSize); 
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
                wavesStart = true;
            }
            else if (selectedGamemode == "sandbox"){
                spawnEnemy(); // Spawn a new enemy
            }
        }
    });

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
    let progressBar1: HTMLDivElement[] = [];

    for (let index = 0; index < 4; index++) {
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');  // Add the styling class
        progressBar1.push(progressBar);             // Add to the array
        progressBarContainer1.appendChild(progressBar);         // Append to the container
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
    let progressBar2: HTMLDivElement[] = [];

    for (let index = 0; index < 4; index++) {
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');  // Add the styling class
        progressBar2.push(progressBar);             // Add to the array
        progressBarContainer2.appendChild(progressBar);         // Append to the container
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
    if(bottomContainer) bottomContainer.appendChild(upgradeContainer);    

    let currentSelectedTower: Tower | null = null;


    function updateUIAfterTowerNotClicked(): void{
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
            if (
                mouseX >= tower.x && mouseX <= tower.x + towerSize &&
                mouseY >= tower.y && mouseY <= tower.y + towerSize
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
        updateStatistics();
    });
    
    upgradeButtonPath2.addEventListener('click', () => {
        gameCash = upgradePath2(currentSelectedTower, gameCash, upgradeName1, upgradeName2, costLabel1, costLabel2, progressBar1, progressBar2);
        updateStatistics();
    });
    
    if(ctx)  renderMap(ctx, currentMap, towerArray, rectSize, towerSize); // Render the map initially

    function spawnEnemy() {
        // Create a new enemy at the start position and push it into the enemies array
        const rng = () => Math.floor(Math.random() * 2);
        const randomValue = rng();
        
        if (selectedMap === 'basicMap') {
            const newEnemy = randomValue === 0 ? new NormalEnemy(0, 300/50 * rectSize, rectSize) : new FastEnemy(0, 300/50 * rectSize, rectSize);
            enemies.push(newEnemy);
        }
        else if (selectedMap === 'easyMap') {
            const newEnemy = randomValue === 0 ? new NormalEnemy(350/50 * rectSize, 500/50 * rectSize, rectSize) : new FastEnemy(350/50 * rectSize, 500/50 * rectSize, rectSize);
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
            
            if (wavesStart) {
                let enemyWavesIndex = 0; // First wave
                
                const spawnNextWave = () => {
                    if (enemyWavesIndex < enemyWaves.length) {
                        let gameWaves = enemyWaves[enemyWavesIndex];
                
                        if (gameWaves != null && !gameWaves.waveSent) {
                            h2Blue.innerText = `Wave: ${gameWaves.waveNumber}/${enemyWaves.length}`;
                            activeEnemiesCount = gameWaves.enemyCount;
                
                            for (let enemyIndex = 0; enemyIndex < gameWaves.enemyCount; enemyIndex++) {
                                (function (index) { // IIFE to capture current enemyIndex properly
                                    setTimeout(() => {
                                        spawnEnemy(); // Spawn enemy logic
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
                                if (tower.name === 'Single Shot Tower') {
                                    tower.path2Upgrades >= 2 ? bullet = new marksmanBullet(tower.damage, tower.x, tower.y, enemyPositionX, enemyPositionY, towerSize, enemySize, tower.path2Upgrades, tower.pierce, 30, tower) : bullet = new marksmanBullet(tower.damage, tower.x, tower.y, enemyPositionX, enemyPositionY, towerSize, enemySize, tower.path2Upgrades, tower.pierce, 15, tower);
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
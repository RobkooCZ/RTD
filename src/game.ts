/// <reference path="basicTower.ts" />
/// <reference path="basicEnemy.ts" />
/// <reference path="basicBullet.ts" />
/// <reference path="maps/gameMap.ts" />
/// <reference path="waves.ts" />

// Create the master container for game stats
const gameStats = document.createElement('div');

// Style the container
gameStats.style.position = 'absolute';
gameStats.style.color = 'white';
gameStats.style.top = '3.5%';
gameStats.style.right = '3.5%';
gameStats.style.fontFamily = "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif";
gameStats.style.fontSize = '5vh';  // Consistent font size
gameStats.style.maxWidth = '16%';
gameStats.style.whiteSpace = 'nowrap';  // Prevent text wrapping
gameStats.style.textAlign = 'center';  // Center the text
gameStats.style.display = 'flex';
gameStats.style.flexDirection = 'column';  // Stack the H2s vertically

// Create the first H2 element with a red outline around each letter
const h2Red = document.createElement('h2');
h2Red.innerText = 'Red Bordered Text';
h2Red.style.color = 'white';  // Maintain white text color
h2Red.style.fontSize = 'inherit';  // Keep the same font size as the container
h2Red.style.fontFamily = 'inherit';  // Keep the same font family
h2Red.style.textAlign = 'inherit';  // Keep the same text alignment
h2Red.style.letterSpacing = '0.1vw';  // Adjust spacing between letters if needed

// Add red outline to each letter
h2Red.style.webkitTextStroke = '0.2px red';  // Outline each individual letter in red
h2Red.style.webkitTextFillColor = 'white';  // Ensure the text inside the outline stays white

// Create the second H2 element with a green border around the text (whole H2)
const h2Green = document.createElement('h2');
h2Green.innerText = 'Green Bordered Text';
h2Green.style.color = 'white';  // Maintain white text color
h2Green.style.fontSize = 'inherit';  // Keep the same font size as the container
h2Green.style.fontFamily = 'inherit';  // Keep the same font family
h2Green.style.textAlign = 'inherit';  // Keep the same text alignment

h2Green.style.webkitTextStroke = '0.2px green';  // Outline each individual letter in green
h2Green.style.webkitTextFillColor = 'white';  // Ensure the text inside the outline stays white


const h2Blue = document.createElement('h2');
h2Blue.innerText = `Press 'E' to start!`;
h2Blue.style.color = 'white';  // Maintain white text color
h2Blue.style.fontSize = 'inherit';  // Keep the same font size as the container
h2Blue.style.fontFamily = 'inherit';  // Keep the same font family
h2Blue.style.textAlign = 'inherit';  // Keep the same text alignment

h2Blue.style.webkitTextStroke = '0.2px blue';  // Outline each individual letter in green
h2Blue.style.webkitTextFillColor = 'white';  // Ensure the text inside the outline stays white

// Append the two H2 elements to the gameStats container
gameStats.appendChild(h2Red);
gameStats.appendChild(h2Green);
gameStats.appendChild(h2Blue);

// Append the gameStats container to the document body
document.body.appendChild(gameStats);

document.addEventListener('DOMContentLoaded', () => {
    console.log(enemyWaves);
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
    let selectedGamemode = localStorage.getItem('selectedGamemode') //  Get the selected gamemode from the main menu
    let wavesStart: boolean = false;
    let enemyPaths: { x: number; y: number }[][] = []; // Array to store enemy paths
    let towerSelected: boolean = false;
    let activeEnemiesCount = 0; // Track the number of active enemies

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

    h2Red.innerText = `Health: ${health}`;
    h2Green.innerText = `Cash: $${gameCash}`;

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
                            h2Red.innerText = `Health: ${health}`;
                            h2Green.innerText = `Cash: $${gameCash}`;
                            const tower: BasicTower = new BasicTower(125, damage, fireRate, snappedX, snappedY, towerCost, towerSize, false);
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
            h2Red.innerText = `Health: ${health}`;
            h2Green.innerText = `Cash: $${gameCash}`;
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

    // Position the container at the bottom 16.666% of the viewport
    upgradeContainer.style.position = 'absolute';
    upgradeContainer.style.bottom = '5%'; 
    upgradeContainer.style.left = '50%';
    upgradeContainer.style.transform = 'translateX(-50%)';  // Center horizontally
    upgradeContainer.style.display = 'flex';  // Flexbox for side-by-side buttons
    upgradeContainer.style.gap = '2vw';  // Add gap between the buttons
    upgradeContainer.style.alignItems = 'center';  // Center buttons vertically within this area
    upgradeContainer.style.height = '10%';  // Container height to vertically center the buttons
    upgradeContainer.style.justifyContent = 'center';
    
    // Create the first button
    const upgradeButtonPath1 = document.createElement('button');
    upgradeButtonPath1.innerText = `Please select a tower to upgrade it.`;
    
    // Style the first button
    upgradeButtonPath1.style.padding = '1vw 3vw';  // Adds space inside the button (top-bottom, left-right)
    upgradeButtonPath1.style.fontSize = '1.5vw';  // Adjusts button text size
    upgradeButtonPath1.style.width = 'auto';  // Auto width to fit content
    upgradeButtonPath1.style.height = 'auto';  // Auto height to fit content
    upgradeButtonPath1.style.whiteSpace = 'nowrap';  // Prevent text wrapping
    upgradeButtonPath1.style.textAlign = 'center';  // Center the text
    upgradeButtonPath1.style.border = '2px solid black';  // Optional styling for better appearance
    upgradeButtonPath1.style.backgroundColor = '#f0f0f0';  // Optional background color
    
    // Create the second button
    const upgradeButtonPath2 = document.createElement('button');
    upgradeButtonPath2.innerText = `Please select a tower to upgrade it.`;
    
    // Style the second button similarly
    upgradeButtonPath2.style.padding = '1vw 3vw';  // Adds space inside the button (top-bottom, left-right)
    upgradeButtonPath2.style.fontSize = '1.5vw';  // Adjusts button text size
    upgradeButtonPath2.style.width = 'auto';  // Auto width to fit content
    upgradeButtonPath2.style.height = 'auto';  // Auto height to fit content
    upgradeButtonPath2.style.whiteSpace = 'nowrap';  // Prevent text wrapping
    upgradeButtonPath2.style.textAlign = 'center';  // Center the text
    upgradeButtonPath2.style.border = '2px solid black';  // Optional styling for better appearance
    upgradeButtonPath2.style.backgroundColor = '#f0f0f0';  // Optional background color
    
    // Add both buttons to the container
    upgradeContainer.appendChild(upgradeButtonPath1);
    upgradeContainer.appendChild(upgradeButtonPath2);
    
    // Append the container to the body
    document.body.appendChild(upgradeContainer);    

    let currentSelectedTower: BasicTower | null = null;

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

                updateButton(upgradeButtonPath1, currentSelectedTower.path1Upgrades, 'Upgrade Firerate ($75)');
                updateButton(upgradeButtonPath2, currentSelectedTower.path2Upgrades, 'Upgrade Damage ($100)');

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
                h2Red.innerText = `Health: ${health}`;
                h2Green.innerText = `Cash: $${gameCash}`;
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
                h2Red.innerText = `Health: ${health}`;
                h2Green.innerText = `Cash: $${gameCash}`;
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
                                const bullet = new BasicBullet(tower.damage, tower.x, tower.y, enemyPositionX, enemyPositionY, towerSize, enemySize, tower.path2Upgrades);
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
                    h2Red.innerText = `Health: ${health}`;
                    h2Green.innerText = `Cash: $${gameCash}`;
                }

                if (GameHealth <= 0) {
                    gameLost = true;
                    h2Red.innerText = `Health: ${health}`;
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
                h2Red.innerText = `Health: ${health}`;
                h2Green.innerText = `Cash: $${gameCash}`;
            }
        });

        
    }
    
    // Start the game loop
    renderMap();
    requestAnimationFrame(gameLoop); // Start the animation
});
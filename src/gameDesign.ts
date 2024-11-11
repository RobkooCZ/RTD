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
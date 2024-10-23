let PATH1LOCKED: boolean = false;
let PATH2LOCKED: boolean = false;

function lightUpBar(number: number, progressBar: HTMLDivElement[]) {
    for (let index = 0; index < number && index < progressBar.length; index++) {
        progressBar[index].classList.add('active');
    }
}

function removeLightUpBar(number: number, progressBar: HTMLDivElement[]) {
    for (let index = 0; index < number && index < progressBar.length; index++) {
        progressBar[index].classList.remove('active');
    }
}

// Function to update the upgrade buttons based on the tower's current upgrades
const updateButton = (
    currentSelectedTower: any,
    button1: HTMLElement,
    button2: HTMLElement,
    cost1: HTMLElement,
    cost2: HTMLElement,
    progressBar1: HTMLDivElement[] = [],
    progressBar2: HTMLDivElement[] = []
) => {
    const path1Upgrades = currentSelectedTower.path1Upgrades;
    const path2Upgrades = currentSelectedTower.path2Upgrades;

    // Determine lock states based on upgrade levels
    PATH1LOCKED = path1Upgrades >= 2; 
    PATH2LOCKED = path2Upgrades >= 2;

    let costPath1: number = currentSelectedTower.returnCost(path1Upgrades, 1);
    let costPath2: number = currentSelectedTower.returnCost(path2Upgrades, 2);


    removeLightUpBar(4, progressBar1);
    removeLightUpBar(4, progressBar2);
    lightUpBar(path1Upgrades, progressBar1);
    lightUpBar(path2Upgrades, progressBar2);

    // Update Path 1 button
    if (path1Upgrades >= 4) {
        button1.innerText = 'MAX UPGRADED';
        button1.style.pointerEvents = 'none';
        cost1.innerText = 'MAX';
    } else if (currentSelectedTower.path2Upgrades > 2 && path1Upgrades >= 2) {
        button1.innerText = 'PATH LOCKED';
        button1.style.pointerEvents = 'none';
        cost1.innerText = 'LOCKED';
    } else {
        cost1.innerText = "$" + costPath1.toString();
        button1.style.pointerEvents = 'auto';     // Make button clickable
        button1.style.backgroundColor = '';       // Reset style
        if (path1Upgrades == 0){
            button1.innerText = "Improved Rifle";
        }else if (path1Upgrades == 1){
            button1.innerText = "Armor Piercing Bullets";
        }else if (path1Upgrades == 2){
            button1.innerText = "Deadly Precision";
        }else if (path1Upgrades == 3){
            button1.innerText = "idk some final upgrade";
        }
    }

    // Update Path 2 button
    if (path2Upgrades >= 4) {
        button2.innerText = 'MAX UPGRADED';
        button2.style.pointerEvents = 'none';
        cost2.innerText = 'MAX';
    } else if (currentSelectedTower.path1Upgrades > 2 && path2Upgrades >= 2) {
        button2.innerText = 'PATH LOCKED';
        button2.style.pointerEvents = 'none';
        cost2.innerText = 'LOCKED';
    } else {
        cost2.innerText = "$" + costPath2.toString();
        button2.style.pointerEvents = 'auto';     // Make button clickable
        button2.style.backgroundColor = '';       // Reset style
        if (path2Upgrades == 0){
            button2.innerText = "Faster Firing";
        }else if (path2Upgrades == 1){
            button2.innerText = "Binoculars";
        }else if (path2Upgrades == 2){
            button2.innerText = "Automatic Rifle";
        }else if (path2Upgrades == 3){
            button2.innerText = "idk some final upgrade 2";
        }
    }
};

// Function to handle upgrading Path 1
function upgradePath1(
    currentSelectedTower: any,
    gameCash: number,
    upgradeButtonPath1: HTMLElement,
    upgradeButtonPath2: HTMLElement,
    cost1: HTMLElement,
    cost2: HTMLElement,
    progressBar1: HTMLDivElement[] = [],
    progressBar2: HTMLDivElement[] = []
): number {
    const path1Upgrades = currentSelectedTower.path1Upgrades;
    // Check if Path 1 is locked or maxed out
    if (currentSelectedTower.path2Upgrades > 2 && path1Upgrades >= 2) {
        return gameCash; 
    }

    let costPath1: number = currentSelectedTower.returnCost(path1Upgrades, 1);
    
    if (!isNaN(costPath1)) currentSelectedTower.modifyTotalCost(costPath1);

    // Check if the player can afford the upgrade
    if (gameCash >= costPath1) {
        // Deduct the upgrade cost
        gameCash -= costPath1;
        // Upgrade the tower
        currentSelectedTower.upgradePath1();
        // Update the buttons after upgrading
        updateButton(currentSelectedTower, upgradeButtonPath1, upgradeButtonPath2, cost1, cost2, progressBar1, progressBar2);
    } else {
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
function upgradePath2(
    currentSelectedTower: any,
    gameCash: number,
    upgradeButtonPath1: HTMLElement,
    upgradeButtonPath2: HTMLElement,
    cost1: HTMLElement,
    cost2: HTMLElement,
    progressBar1: HTMLDivElement[] = [],
    progressBar2: HTMLDivElement[] = []
): number {
    const path2Upgrades = currentSelectedTower.path2Upgrades;

    if (currentSelectedTower.path1Upgrades > 2 && path2Upgrades >= 2){
        return gameCash; // Can't upgrade
    }

    let costPath2: number = currentSelectedTower.returnCost(path2Upgrades, 2);
    if (!isNaN(costPath2)) currentSelectedTower.modifyTotalCost(costPath2);

    // Check if the player can afford the upgrade
    if (gameCash >= costPath2) {
        // Deduct the upgrade cost
        gameCash -= costPath2;
        // Upgrade the tower
        currentSelectedTower.upgradePath2();
        // Update the buttons after upgrading
        updateButton(currentSelectedTower, upgradeButtonPath1, upgradeButtonPath2, cost1, cost2, progressBar1, progressBar2);
    } else {
        // Not enough money, show a warning message
        if (!(path2Upgrades == 4)){
            upgradeButtonPath2.innerText = 'NOT ENOUGH MONEY';
        }
        setTimeout(() => {
            updateButton(currentSelectedTower, upgradeButtonPath1, upgradeButtonPath2, cost1, cost2, progressBar1, progressBar2);
        }, 1500);
    }

    return gameCash;
}
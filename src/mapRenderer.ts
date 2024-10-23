interface ResizeResult {
    rectSize: number;
    towerSize: number;
    enemySize: number;
}

// Clear the canvas before rendering
function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function calculateNewRectSize(width: number): number {
    return Math.floor(width / 30);
}

// Initial rendering of the map
function renderMap(ctx: CanvasRenderingContext2D, currentMap: number[][], towerArray: Tower[], rectSize: number, towerSize: number): void {
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

function averageToNumber(value: number, average: number): number {
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

function resizeCanvas(towerArray: Tower[], canvas: HTMLCanvasElement, enemyPaths: { x: number; y: number }[][] = []): ResizeResult {
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
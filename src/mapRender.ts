/// <reference path="basicTower.ts" />
/// <reference path="basicEnemy.ts" />

document.addEventListener('DOMContentLoaded', () => {
    const map: number[][] = [
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

    const canvas = document.getElementById('mapCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    let cursorX = 0;
    let cursorY = 0;
    const rectSize = 50; // Size of each grid cell

    document.addEventListener('mousemove', (event) => {
        cursorX = event.clientX - 32; // Adjust cursor position
        cursorY = event.clientY - 100; // Adjust cursor position
    });

    // Function to snap coordinates to the nearest grid point
    function snapToGrid(value: number): number {
        return Math.round(value / rectSize) * rectSize;
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'e') {
            // Snap cursor coordinates to the grid
            const snappedX = snapToGrid(cursorX);
            const snappedY = snapToGrid(cursorY);
            
            // Determine the grid position based on snapped coordinates
            const gridX = snappedX / rectSize; // Column index
            const gridY = snappedY / rectSize; // Row index

            // Check if the position is valid for tower placement
            if (gridY >= 0 && gridY < map.length && gridX >= 0 && gridX < map[0].length) {
                if (map[gridY][gridX] === 0) { // Valid placement check (0 means free)
                    const tower: BasicTower = new BasicTower(50, 10, 1, snappedX, snappedY);
                    if (ctx) {
                        tower.render(ctx); // Render the tower
                    }
                    console.log(`Tower placed at (${snappedX}, ${snappedY})`); // Debugging statement
                } else {
                    console.log('Tower not placed: Invalid position (path)');
                }
            } else {
                console.log('Tower not placed: Out of map bounds');
            }
        }
    });

    // Create and render the enemy
    const basicEnemy: BasicEnemy = new BasicEnemy(1, 350, 450); // Example enemy initialization

    // Render the map and then the enemy
    if (ctx) {
        // Render the map first
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                ctx.fillStyle = map[i][j] === 1 ? 'brown' : 'green';
                ctx.fillRect(j * rectSize, i * rectSize, rectSize, rectSize);
            }
        }

        // Then render the enemy
        basicEnemy.render(ctx);
        let enemyPositionX = basicEnemy.x;
        let enemyPositionY = basicEnemy.y;
        let gridX = enemyPositionX / rectSize;
        let gridY = enemyPositionY / rectSize;
        let lastGridX = -1; // Initialize last grid position
        let lastGridY = -1; // Initialize last grid position
        
        setInterval(() => {
            // Calculate the grid position based on the current enemy position
            const gridX = Math.floor(enemyPositionX / rectSize);
            const gridY = Math.floor(enemyPositionY / rectSize);
        
            // Check if the enemy can move right
            if (gridY >= 0 && gridY < map.length && 
                gridX + 1 >= 0 && gridX + 1 < map[gridY].length &&
                map[gridY][gridX + 1] === 1 && (lastGridX !== gridX + 1 || lastGridY !== gridY)) {
                
                basicEnemy.erase(ctx);
                enemyPositionX += rectSize; // Move right
                basicEnemy.setPosition(enemyPositionX, enemyPositionY);
                basicEnemy.render(ctx);
                
                // Update the last position
                lastGridX = gridX;
                lastGridY = gridY;
            } 
            // Check if the enemy can move left
            else if (gridY >= 0 && gridY < map.length && 
                gridX - 1 >= 0 && gridX - 1 < map[gridY].length && 
                map[gridY][gridX - 1] === 1 && (lastGridX !== gridX - 1 || lastGridY !== gridY)) {
                
                basicEnemy.erase(ctx);
                enemyPositionX -= rectSize; // Move left
                basicEnemy.setPosition(enemyPositionX, enemyPositionY);
                basicEnemy.render(ctx);
                
                // Update the last position
                lastGridX = gridX;
                lastGridY = gridY;
            } 
            // Check if the enemy can move down
            else if (gridY + 1 < map.length && 
                gridX >= 0 && gridX < map[gridY + 1].length && 
                map[gridY + 1][gridX] === 1 && (lastGridX !== gridX || lastGridY !== gridY + 1)) {
                
                basicEnemy.erase(ctx);
                enemyPositionY += rectSize; // Move down
                basicEnemy.setPosition(enemyPositionX, enemyPositionY);
                basicEnemy.render(ctx);
                
                // Update the last position
                lastGridX = gridX;
                lastGridY = gridY;
            } 
            // Check if the enemy can move up
            else if (gridY - 1 >= 0 && 
                gridX >= 0 && gridX < map[gridY - 1].length && 
                map[gridY - 1][gridX] === 1 && (lastGridX !== gridX || lastGridY !== gridY - 1)) {
                
                basicEnemy.erase(ctx);
                enemyPositionY -= rectSize; // Move up
                basicEnemy.setPosition(enemyPositionX, enemyPositionY);
                basicEnemy.render(ctx);
                
                // Update the last position
                lastGridX = gridX;
                lastGridY = gridY;
            }
        }, 1000);
        
    } else {
        console.error("Canvas context is not available");
    }
});

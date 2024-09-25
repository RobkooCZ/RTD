/// <reference path="basicTower.ts" />

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

    // Render the map
    if (ctx) {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                ctx.fillStyle = map[i][j] === 1 ? 'brown' : 'green';
                ctx.fillRect(j * rectSize, i * rectSize, rectSize, rectSize);
            }
        }
    } else {
        console.error("Canvas context is not available");
    }
});

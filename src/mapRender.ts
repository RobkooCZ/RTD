/// <reference path="basicTower.ts" />

document.addEventListener('DOMContentLoaded', () => {
    const map: number[][] = [
        [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
    ];

    const canvas = document.getElementById('mapCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const tower: BasicTower = new BasicTower(50, 10, 1, 250, 350);

    if (ctx) {
        const rectSize = 50;

        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                ctx.fillStyle = map[i][j] === 1 ? 'brown' : 'green';
                ctx.fillRect(j * rectSize, i * rectSize, rectSize, rectSize);
            }
        }
        tower.render(ctx);
    } else {
        console.error("Canvas context is not available");
    }
});

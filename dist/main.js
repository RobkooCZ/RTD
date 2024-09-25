"use strict";
class BasicTower {
    range;
    damage;
    fireRate;
    x;
    y;
    constructor(range, damage, fireRate, x, y) {
        this.range = range;
        this.damage = damage;
        this.fireRate = fireRate;
        this.x = x;
        this.y = y;
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    // Method to render the tower on the canvas
    render(ctx) {
        ctx.fillStyle = 'blue'; // Set the color of the tower
        ctx.beginPath();
        ctx.rect(this.x, this.y, 50, 50);
        ctx.fill();
    }
}
const message = 'Basic map and tower render';
document.body.innerHTML = `<h1>${message}</h1>`;
/// <reference path="basicTower.ts" />
document.addEventListener('DOMContentLoaded', () => {
    const map = [
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
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    const tower = new BasicTower(50, 10, 1, 250, 350);
    if (ctx) {
        const rectSize = 50;
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                ctx.fillStyle = map[i][j] === 1 ? 'brown' : 'green';
                ctx.fillRect(j * rectSize, i * rectSize, rectSize, rectSize);
            }
        }
        tower.render(ctx);
    }
    else {
        console.error("Canvas context is not available");
    }
});

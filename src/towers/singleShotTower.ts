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


class SingleShotTower extends Tower {
    constructor(x: number, y: number, isClicked: boolean, gridSize: number) {
        // Call the parent constructor with specific values for SingleShotTower
        super(100, 10, 1.5, x, y, 100, gridSize, isClicked); // Range: 100, Damage: 10, FireRate: 1.5, Cost: 75, Size: 30
    }
}
# Robkoo's Tower Defense

## Description
A website game made primarily using Typescript. I made it to practice my programming skills and to have fun while coding a simple TD game.

## To find out more about the waves in my game, please see the [Waves](ENEMYWAVES.md) document.

# Changelog (last 3 updates)

## For the full detailed list of changes and updates, please see the [Changelog](CHANGELOG.md).

## Alpha 0.3.1
- Added proper prices to tower upgrades, making them tougher to aquire
- Added a fortified enemy
    - HP: 200
    - Speed: 2x slower than normal enemy (0.25)
    - Only damagable with AP bullets
    - The enemy has a visible "armor" render
- Renamed SST (Single Shot Tower) to Marksman Tower
- Minor changes to how the map data is handled

### Balance Changes
- **Marksman Tower**    
    - 2-x, 3-x, 4-x now have AP bullets

### Bugfixes
- Fixed armor rendering different color until a tower is placed
- Fixed enemies' color not being calculated properly based on their specific health

## Alpha 0.3
- Removed unnecesary console.log() commands
- Added multiple upgrades, and simmilarly to BTD5, you can go up to 4 upgrades on one path and 2 on the other path.
- Remade the upgrade UI
    - includes the upgrade image, cost, name and progress bar of how much you've upgraded
- Added some WIP upgrades for towers with very cheap prices, making them incredibly OP right now. I'll balance it out later.
- Added different designs for tower upgrades (provisional)
- Added tower damage and kills statistics, that are shown when a tower is selected 
- Finally reworked the main menu
- Added a settings modal to the game. For now, you can only go back to the main menu
- Added selling to the game. You get back 85% of anything you buy
- Added a big JSDoc comment to the top of game.ts to explain what the code does

### Balance Changes
- **Single Shot Tower**  
    - **Damage**: 10 → 5 (50% Nerf)
    - **Firerate**: 1.5/s → 1/s (33% Nerf)
    - **DPS Change**: 10 DPS → 5 DPS
- **Minigun Tower**
    - **Firerate**: 15/s → 10/s (33% Nerf)
    - **Pierce**: 5 → 2 (60% Nerf)
    - **DPS Change**: 25 DPS → 20 DPS

### Bugfixes
- Fixed a bug where the tower's range would be cut off by grid "blocks"
- Fixed the tower info on the right side not styling properly
- Fixed the resize window calculations to not cause bugs
- Fixed towers dissapearing after resizing the window
- Fixed towers' size not changing properly on window resize
- Fixed enemies' size not changing properly on window resize
- Fixed some styling around resizing and empty spaces, mainly caused due to rounding errors
- Fixed canvas and its gridSize not resizing properly on window resize
- Fixed tower range rendering issues
- Fixed a bug regarding upgrade buttons' progress bars
- Fixed a bug where the cost for upgrades could cause problems with the selling mechanism and calculations
- Fixed a bug where if an enemy died with 0 HP left, it wouldn't track it as a kill for the tower
- Fixed a bug where the selling price would be higher for every subsequent tower

## Alpha 0.2.8.1

### Bugfixes
- Fixed a bug where the bullet would stay on the screen if it didn't reach its pierce.
    - The bullet dissapears after 250ms of staying on the screen
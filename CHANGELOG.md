# Changelog for Robkoo's Tower Defense

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

## Alpha 0.2.8
- Added pierce to towers
- Each tower has 5 pierce

### Balance Changes
- 1 -> 5 Pierce on both towers

### Bugfixes
- Fixed a bug where the bullet hit the same enemy multiple times

### Known bug
- Most bullets stay rendered on screen after they are shot, and their pierce cap isn't met

## Alpha 0.2.7
- Added support for multiple enemies
- Added a fast enemy
    - 3x the speed compared to the normal enemy 
    - 2x less health (50HP) compared to the normal enemy 
- Spawnable only by a random chance when you press 'E' in the Sandbox mode
- Minor changes

### Bugfixes
- Modified the range of the towers so on higher resolution displays it isn't smaller compared to lower resolution displays

## Alpha 0.2.6
- Added support for multiple towers
- Added a second tower, the Minigun Tower
    - Slightly different design from the Single Shot Tower, prone to change in the future
    - 10x the firerate of the Single Shot Tower
    - 5x less damage than the Single Shot Tower
    - 125$ cost
    - Same range as the Single Shot Tower
- Below the game statistics you can see the list of towers availible, aswell as their cost, image and hotkey to place them.
- Moved all tower related stuff to a separate 'towers' folder

## Alpha 0.2.5
- Made the game mostly black/white
- Towers now follow this styling:
    - Border color change means non-bullet upgrade
    - Inner square color change means bullet upgrade
    - Inner square count means different type of tower (not implemented yet)
- Bullets are styled similarly to towers
- When you check the range, it fills the border
- Enemies' color changes based on their health, giving it the illusion of fading into the path
- Moved styling from game.ts to style.css
- Moved map data into its own file

## Alpha 0.2.4
- Made a better UI, and made it more responsive
- Updated the buttons
- Made it so you have to click on the tower to see its range

### Bugfixes
- Fixed health not updating after losing lives

## Alpha 0.2.3
- Added a form to the main menu to pick between sandbox mode (the original one) and wave mode
- Added 10 waves into the game, each with a different enemy count and time between enemy spawns
- You get money after each round ($100 + roundNumber)
- Added wave number into the top right

### Balance Changes
- None this update

### Bugfixes
- None again :D

## Alpha 0.2.2
- Added a basic upgrade system
- Added buttons to upgrade the towers
- Upgrades cost money and if you don't have money, it shows "NOT ENOUGH MONEY" on the button for 1.5s
- Styled the buttons
- Changed the Cash and Health a little bit
- The site is very responsive and doesnt change much when changing resolutions (unless you change the aspect ratio from horizontal to vertical or make the resolution very small)

### Balance Changes
- Made the bullet travel 5x faster (TOWER BUFF)

### Bugfixes
- no bugs found this update :)

## Alpha 0.2.1
- Made the site scale based on your resolution
- Towers, enemies and the grid scales accordingly, this includes tower range and shooting
- Rewrote the enemy spawning and pathing code to properly spawn and "walk" regardless of the resolution

### Bugfixes
- Fixed an issue where a tower couldn't be placed due to a rounding error

## Alpha 0.2
- GAME PROPERLY WORKS ONLY IN FULLSCREEN ON 1920X1080
- Made the game into a fullscreen game
- Very WIP UI
- Made the "Basic Map" into a big map

### Bugfixes
- Fixed a bug where the tower wouldn't be placed where your cursor was

## Alpha 0.1.7
- Added a second map, "Easy Map"
- Made a very simple main menu where you can choose the map you want to play

### Bugfixes
- Fixed a bug where the keybinds wouldn't work with Capital letters

## Alpha 0.1.6
- Added cash to the game
- Starting cash: $1000
- Tower cost: $100
- You earn $10 per enemy kill
- The towers stop shooting if you lose the game

## Alpha 0.1.5
- Added a simple health display
- You lose 1 HP everytime an enemy reaches the end of the path

## Alpha 0.1.4
- Added health stages

## Alpha 0.1.3
- Towers now attack based on a set firerate
- Enemies have health (currently set at 100)
- Towers now deal damage (currently set at 10)

## Alpha 0.1.2
- You can spawn multiple enemies

## Alpha 0.1.1
- Made the control to spawn a tower 't' instead of 'e'
- Added 2 more controls to the game, 'e' for spawning an enemy, 'r' to reset the game

## Alpha 0.1.0
- Enemy movement much smoother
- Towers show range
- Towers attack enemies inside their range

## Alpha 0.0.3
- Added an "enemy" that moves along the path

## Alpha 0.0.2
- You can now place a tower by pressing 'e'

## Alpha 0.0.1
- Added a basic tower and map render
# Robkoo's Tower Defense

## Description
A website game made primarily using Typescript. I made it to practice my programming skills and to have fun while coding a simple TD game.

## To find out more about the waves in my game, please see the [Waves](ENEMYWAVES.md) document.

# Changelog (last 3 updates)

## For the full detailed list of changes and updates, please see the [Changelog](CHANGELOG.md).

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
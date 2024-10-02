# Robkoo's Tower Defense

## Description
A website game made primarily using Typescript. I made it to practice my programming skills and to have fun while coding a simple TD game.

## To find out more about the waves in my game, please see the [Waves](ENEMYWAVES.md) document.

# Changelog (last 3 updates)

## For the full detailed list of changes and updates, please see the [Changelog](CHANGELOG.md).

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
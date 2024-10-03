# Robkoo's Tower Defense

## Description
A website game made primarily using Typescript. I made it to practice my programming skills and to have fun while coding a simple TD game.

## To find out more about the waves in my game, please see the [Waves](ENEMYWAVES.md) document.

# Changelog (last 3 updates)

## For the full detailed list of changes and updates, please see the [Changelog](CHANGELOG.md).

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
- Added a second towers, the Minigun Tower
    - Slightly different design from the Single Shot Tower, prone to change in the future
    - 10x the firerate of the Single Shot Tower
    - 5x less damage than the Single Shot Tower
    - 125$ cost
    - Same range as the Single Shot Tower
- Below the game statistics you can see the list of towers availible, aswell as their cost, image and hotkey to place them.
- Moved all tower related stuff to a separate 'towers' folder
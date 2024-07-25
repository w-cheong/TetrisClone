# TetrisClone
This project is an attempt at replicating the play of modern versions of Tetris.

## Game Logic
The most integral part of the project. Proper game functionality.
* piece rotation
* wall interactions
* gravity tick check
* buffer zone
* piece bag / randomization

## Appearance
Cosmetic details meant to enhance the user experience.
* grid
* piece appearance
* ghost piece
* next queue

------

## Planning
global gamegrid (10x20 2D array)
currentPiece

listen for user's keypresses. If there are any, handle.

each game tick, tetrimino moves down
checks for if piece is on surface
after some delay, locks piece

```javascript
gameGrid = [], //10x20 array of locked pieces. Each entry is a string or null
currentPiece, // {pieceType, orientation?}
```

Pieces have their own internal coordinate system (for easier rotation logic?)
Gets mapped to game grid's coordinate system.

Then every refresh tick, redraw playfield using the `drawGridPiece()` function.

## Primary Task List
The main tasks to achieve for this project for functional gameplay. 
Project will be considered in a finished state when all these tasks are completed.
* [X] Draw all pieces in their default orientation (north)
* [X] Add moving of pieces (with collision avoidance)
* [X] Listen to keybinds
* [X] Draw all pieces in their other orientations
* [X] Add rotation of pieces (with kick table)
* [X] Add gravity of pieces
* [X] Add game over condition (Pieces stop dropping after block out)
* [X] Add hold function
* [X] Add next queue pieces
* [X] Increasing gravity speed over time
* [X] Pieces stop being controlled when landing without hard drop
* [X] Add shadow piece (should show where piece lands after hard drop)
* [X] Pause function (automatically when switching windows and/or pause button)


## Secondary Task List
Mainly cosmetic features for improved user experience, not necessary for playability
These features may be implemented at any future point in any order
Some tasks may be removed if deemed unneeded for users
* [X] Restart game without restarting tab
* [X] Text marking hold and next queues
* [X] Visual for paused screen
* [ ] Proper randomization for next queue pieces (7-bag system)
* [ ] Add autoplay
* [ ] Start Screen designed
* [ ] Additional game over condition - lock out (entire piece drops above playzone)
* [ ] Customizable keyboard binding
* [ ] Audio features
* [ ] Text appearing on screen for singles, doubles, triples, and tetrises cleared
* [ ] Text for combos (# of drops in a row that cause line clears)
* [ ] Scoring 

## References
Sources used as basis for how the game should look and play. 
* https://ia804609.us.archive.org/27/items/2009-tetris-variant-concepts_202201/2009%20Tetris%20Design%20Guideline.pdf
* https://tetris.wiki/Super_Rotation_System
* https://tetris.fandom.com/wiki/SRS
* https://harddrop.com/wiki/Tetris_Guideline
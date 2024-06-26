# TetrisClone

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

## Task List
* [X] Draw all pieces in their default orientation (north)
* [X] Add moving of pieces (with collision avoidance)
  * [X] Listen to keybinds
* [X] Draw all pieces in their other orientations
* [X] Add rotation of pieces (with kick table)
  * [ ] Check accuracy of rotation of pieces (with kick table)
* [X] Add gravity of pieces
* [X] Add game over condition (Pieces stop dropping after block out)
  * [ ] Additional game over condition - lock out (entire piece drops above playzone)
* [X] Add hold function
* [X] Add next queue pieces
* [ ] Textbar for controls (cosmetic)
  * [ ] Customizable keyboard binding???
  * [ ] Audio (Sound effects, background music)
  * [ ] Text appearing on screen for singles, doubles, triples, and tetrises cleared
  * [ ] Text for combos (# of drops in a row that cause line clears)
  * [ ] Scoring (+ high scores list???)
* [X] Increasing gravity speed over time
* [X] Pieces stop being controlled when landing without hard drop
* [ ] Add shadow piece (should show where piece lands after hard drop)
  * [ ] Add autoplay
* [X] Pause function (automatically when switching windows and/or pause button)


## References

* https://ia804609.us.archive.org/27/items/2009-tetris-variant-concepts_202201/2009%20Tetris%20Design%20Guideline.pdf
* https://tetris.wiki/Super_Rotation_System
* https://tetris.fandom.com/wiki/SRS
* https://harddrop.com/wiki/Tetris_Guideline
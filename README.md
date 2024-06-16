# TetrisClone

## Game Logic

* piece rotation
* wall interactions
* gravity tick check
* buffer zone
* piece bag / randomization

## Appearance

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
checks for if on surface
after some delay, locks piece

```javascript
gameGrid = [], //10x20 array of locked pieces. Each entry is a string or null
currentPiece, // {pieceType, orientation?}
```

Pieces have their own internal coordinate system (for easier rotation logic?)
Gets mapped to game grid's coordinate system.

Then every refresh tick, redraw playfield using the `drawGridPiece()` function.


## References

* https://ia804609.us.archive.org/27/items/2009-tetris-variant-concepts_202201/2009%20Tetris%20Design%20Guideline.pdf
* https://tetris.wiki/Super_Rotation_System
* https://tetris.fandom.com/wiki/SRS
* https://harddrop.com/wiki/Tetris_Guideline
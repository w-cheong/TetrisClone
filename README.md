# TetrisClone

# Game Logic
* piece rotation
* wall interactions
* gravity tick check
* buffer zone
# Appearance
* grid 
* piece appearance

------


Want a way to specify which gridpieces to draw which colors.

Want a function
```javascript
function drawGridPiece(r,c,color){

}
```



```javascript
gameState = {
    gameGrid = [], //10x20 array of locked pieces. Each entry is an object {occupied: bool, color: string}
    currentPiece, // {pieceType, orientation?}
}

```

import { Grid } from "./grid.js";
import { gameGrid, playfieldGrid, holdAreaGrid, nextQueueGrid } from "./game.js";

export class Piece {

  /**
   * https://tetris.wiki/Super_Rotation_System
   * 0 = spawn
   * R = clockwise rotation "right" from spawn
   * L = ccw rotation "left" from spawn
   * 2 = two rotations in either direction from spawn
   */
  static kickTable3Piece = {
    '0->R': [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
    "R->0": [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
    "R->2": [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
    "2->R": [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
    "2->L": [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
    "L->2": [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
    "L->0": [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
    "0->L": [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
  }

  static kickTable4Piece = {
    "0->R": [[0, 0], [-2, 0], [+1, 0], [-2, -1], [+1, +2]],
    "R->0": [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -2]],
    "R->2": [[0, 0], [-1, 0], [+2, 0], [-1, +2], [+2, -1]],
    "2->R": [[0, 0], [+1, 0], [-2, 0], [+1, -2], [-2, +1]],
    "2->L": [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -2]],
    "L->2": [[0, 0], [-2, 0], [+1, 0], [-2, -1], [+1, +2]],
    "L->0": [[0, 0], [+1, 0], [-2, 0], [+1, -2], [-2, +1]],
    "0->L": [[0, 0], [-1, 0], [+2, 0], [-1, +2], [+2, -1]],
  }

  /**
   * @param {Grid} grid Grid object that this Tetrimino belongs to
   * @param {number} centerX X position (grid coordinate) of the "main center" of the piece
   * @param {number} centerY Y position (grid coordinate) of the "main center" of the piece
   * @param {string} orientation north, south, east, west
   * @param {string} color
   */
  constructor(grid, centerX = -1, centerY = 0, orientation = "north", color = "yellow") {
    this.grid = grid
    this.centerX = centerX;
    this.centerY = centerY;
    this.orientation = orientation;
    this.color = color;


    // either kickTable3Piece or kickTable4Piece
    this.kickTable = null;

    /**
     * Maps direction string to array of (x,y) pairs
     */
    this.offsetsTable = null;
    this.offsets = null;
  }

  moveToPlayfieldGrid(){
    this.grid = playfieldGrid;
    this.orientation = 'north';
    this.centerX = 6;
    this.centerY = 21;
  }

  moveToHoldGrid(){
    this.grid = holdAreaGrid;
    this.orientation = 'north';
    this.centerX = 2;
    this.centerY = 2;
  }

  /**
   * Modifies the position of piece to align with drawing it onto the nextQueue canvas.
   * @param {number} positionInQueue (from 0 to 4)
   */
  moveQueuePieceToNextQueueGrid(positionInQueue){
    let positionToCenterY = [14, 11, 8, 5, 2];

    this.grid = nextQueueGrid;
    this.orientation = 'north';
    this.centerX = 2;
    this.centerY = positionToCenterY[positionInQueue];
  }

  /**
   * Attempt to rotate piece clockwise
   * @param {number|undefined} rotationCenter (1 to 5 inclusive)
   * @returns {number} -1 if failed to rotate, otherwise returns rotation center used to perform the rotation
   */
  rotateCW(rotationCenter) {
    let prevOrientation = this.orientation;
    let startingX = this.centerX;
    let startingY = this.centerY;
    let kickIndex = null;

    // need to try out different positions in the new rotation
    // to see if one is possible
    switch (this.orientation) {
      case 'north':
        this.orientation = 'east';
        kickIndex = '0->R';
        break;
      case 'east':
        this.orientation = 'south';
        kickIndex = 'R->2';
        break;
      case 'south':
        this.orientation = 'west';
        kickIndex = '2->L';
        break;
      case 'west':
        this.orientation = 'north';
        kickIndex = 'L->0';
        break;
    }

    // console.log(`Trying to rotate ${prevOrientation} -> ${this.orientation}`)
    // console.log(`kickIndex: ${kickIndex}`)

    if (rotationCenter === undefined){
      // try each rotation center in kick table
      for (let i = 1; i <= 5; i++){
        this.centerX = startingX + this.kickTable[kickIndex][i-1][0];
        this.centerY = startingY + this.kickTable[kickIndex][i-1][1];

        if(!this.checkForCollision()){
          // no collision
          // console.log(`Rotated with center ${i}`)
          return i;
        }
      }
    } else { // rotation to try is passed in. For debugging/testing

      // adjust center for the kick
      this.centerX += this.kickTable[kickIndex][rotationCenter-1][0]
      this.centerY += this.kickTable[kickIndex][rotationCenter-1][1]

      if(!this.checkForCollision()){
        // no collision
        return rotationCenter;
      }
    }

    // console.log('failed to rotate')

    // failed to rotate. Recover previous state
    this.centerX = startingX;
    this.centerY = startingY;
    this.orientation = prevOrientation;
    return -1;
  }

  /**
   * Attempt to rotate piece counterclockwise
   * @param {number|undefined} rotationCenter (1 to 5 inclusive)
   * @returns {number} -1 if failed to rotate, otherwise returns rotation center used to perform the rotation
   */
  rotateCCW(rotationCenter) {
    let prevOrientation = this.orientation;
    let startingX = this.centerX;
    let startingY = this.centerY;
    let kickIndex = null;

    switch (this.orientation) {
      case 'north':
        this.orientation = 'west';
        kickIndex = "0->L"
        break;
      case 'east':
        this.orientation = 'north';
        kickIndex = "R->0"
        break;
      case 'south':
        this.orientation = 'east';
        kickIndex = "2->R"
        break;
      case 'west':
        this.orientation = 'south';
        kickIndex = "L->2"
        break;
    }

    // console.log(`Trying to rotate ${prevOrientation} -> ${this.orientation}`)
    // console.log(`kickIndex: ${kickIndex}`)

    if (rotationCenter === undefined){
      // try each rotation center in kick table
      for (let i = 1; i<= 5; i++){
        this.centerX = startingX + this.kickTable[kickIndex][i-1][0];
        this.centerY = startingY + this.kickTable[kickIndex][i-1][1];

        if(!this.checkForCollision()){
          // no collision
          // console.log(`Rotated with center ${i}`)
          return i;
        }
      }
    } else { // rotation to try is passed in. For debugging/testing

      // adjust center for the kick
      this.centerX += this.kickTable[kickIndex][rotationCenter-1][0]
      this.centerY += this.kickTable[kickIndex][rotationCenter-1][1]

      if(!this.checkForCollision()){
        // no collision
        return rotationCenter;
      }
    }

    // console.log('Failed to rotate')
    // failed to rotate. Recover previous state
    this.centerX = startingX;
    this.centerY = startingY;
    this.orientation = prevOrientation;
    return -1; // for debugging
  }

  moveLeft() {
    this.centerX--;
    if (this.checkForCollision()) {
      this.centerX++;
    }
  }
  moveRight() {
    this.centerX++;
    if (this.checkForCollision()) {
      this.centerX--;
    }
  }
  /**
   * for testing only
   */
  // moveUp() {
  //   this.centerY++;
  //   if(this.checkForCollision()){
  //     this.centerY--;
  //   }
  // }

  /**
   * @return boolean whether succeeded
   */
  softDrop() {
    this.centerY--;
    if(this.checkForCollision()){
      this.centerY++;
      return false
    }
    return true
  }

  hardDrop() {
    while (!(this.checkForCollision())) {
      this.centerY--;
    }
    this.centerY++;
  }

  getShadowPiece(){
    return this.clone();
  }

  drawShadow() {
    // create a copy of itself, move the copy down until collision, move up, draw in gray
    let shadowPiece = this.clone();

    // call .moveDown() until it fails
    while(shadowPiece.softDrop()){}

    shadowPiece.drawSelf();

  }


  /**
   * @returns true if collision in current position
   */
  checkForCollision() {
    // console.log(this.getGridCoords());
    for (const [x, y] of this.getGridCoords()) {
      // console.log(x + " " + y);
      if (x < 1 || x > this.grid.gridWidth || y < 1 || y > this.grid.gridHeight + 4) {
        return true;
      }
      if (gameGrid[gameGrid.length - y][x - 1] !== null) {
        return true;
      }
    }
    return false;
  }

  /**
   * @returns boolean True if piece is on surface
   */
  checkIsOnSurface(){
    this.centerY--;
    let res = this.checkForCollision();
    this.centerY++;
    return res;
  }

  pieceToGrid() {
    //if piece is locked down
    //stop moving piece
    //add piece to grid
    for (const [x, y] of this.getGridCoords()) {
      gameGrid[gameGrid.length - y][x - 1] = this.color;
    }
  }

  drawSelf() {
    let offsets = this.offsetsTable[this.orientation];
    for (const [xOffset, yOffset] of offsets) {
      this.grid.fillGridCell(
        this.centerY + yOffset,
        this.centerX + xOffset,
        this.color
      );
    }
  }

  drawPieceCenter() {
    this.grid.fillGridCell(this.centerY, this.centerX, "rgb(155 155 155 / 75%)")
  }

  // for debugging
  setOrientation(orient){
    this.orientation = orient
  }

  /**
   * Returns a list of coordinates that the piece occupies on the grid.
   * Returned as (x,y) pairs both 1-indexed
   * @return {number[][]}
   */
  getGridCoords() {
    let arr = []
    for (const [xOffset, yOffset] of this.offsetsTable[this.orientation]) {
      arr.push([this.centerX + xOffset, this.centerY + yOffset])
    }
    return arr
  }

  /**
   *
   * @returns {string} the orientation of the piece
   */
  getOrientation() {
    return this.orientation
  }
}


export class LPiece extends Piece {
  constructor(grid, centerX = 6, centerY = 21, orientation = "north", color='orange') {
    super(grid, centerX, centerY, orientation, color);
    /*
          .
      .[.].
    */
    this.offsetsTable = {
      "north": [[-1, 0], [0, 0], [1, 0], [1, 1]],
      "east": [[0, 0], [0, 1], [0, -1], [1, -1]],
      "south": [[0, 0], [1, 0], [-1, 0], [-1, -1]],
      "west": [[0, 1], [-1, 1], [0, 0], [0, -1]],
    }

    // this.kickTableCW = {
    //   'north': [[0,0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    //   'east': [[0,0], [1, 0], [1, -1], [0, 2], [1, 2]],
    //   'south': [[0,0], [1,0], [1,1], [0,-2], [1, -2]],
    //   'west':[],
    // }
    // this.kickTableCCW = {
    //   'north': [[0,0], [1, 0], [1, 1], [0, -2], [1, -2]],
    //   'east': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
    //   'south': [],
    //   'west':[],
    // }
    this.kickTable = Piece.kickTable3Piece;
  }

  clone() {
    let shadow = new LPiece(this.grid, this.centerX, this.centerY, this.orientation);
    shadow.color = 'gray';
    return shadow;
  }
}

export class JPiece extends Piece {
  constructor(grid, centerX = 6, centerY = 21, orientation = 'north') {
    super(grid, centerX, centerY, orientation, 'blue');
    /*
      .
      .[.].
    */
    this.offsetsTable = {
      "north": [[-1, 1], [-1, 0], [0, 0], [1, 0]],
      "east": [[0, 0], [0, 1], [1, 1], [0, -1]],
      "south": [[0, 0], [1, 0], [1, -1], [-1, 0]],
      "west": [[0, 0], [0, 1], [0, -1], [-1, -1]],
    }
    this.kickTable = Piece.kickTable3Piece;
  }

  clone() {
    let shadow = new JPiece(this.grid, this.centerX, this.centerY, this.orientation);
    shadow.color = 'gray';
    return shadow;
  }

}

export class TPiece extends Piece {
  constructor(grid, centerX = 6, centerY = 21, orientation = 'north') {
    super(grid, centerX, centerY, orientation, 'purple');
    /*
        .
      .[.].
    */
    this.offsetsTable = {
      "north": [[-1, 0], [0, 0], [0, 1], [1, 0]],
      "east": [[0, 0], [0, 1], [1, 0], [0, -1]],
      "south": [[0, 0], [0, -1], [-1, 0], [1, 0]],
      "west": [[-1, 0], [0, 1], [0, 0], [0, -1]],
    }
    this.kickTable = Piece.kickTable3Piece;
  }

  clone() {
    let shadow = new TPiece(this.grid, this.centerX, this.centerY, this.orientation);
    shadow.color = 'gray';
    return shadow;
  }
}

export class OPiece extends Piece {
  constructor(grid, centerX = 6, centerY = 21, orientation = 'north') {
    super(grid, centerX, centerY, orientation, 'yellow');
    /*
      . .
     [.].
    */
    this.offsetsTable = {
      "north": [[0, 1], [0, 0], [1, 0], [1, 1]],
      "south": [[0, 1], [0, 0], [1, 0], [1, 1]],
      "east": [[0, 1], [0, 0], [1, 0], [1, 1]],
      "west": [[0, 1], [0, 0], [1, 0], [1, 1]],
    }
    this.kickTable = Piece.kickTable3Piece;
  }

  clone() {
    let shadow = new OPiece(this.grid, this.centerX, this.centerY, this.orientation);
    shadow.color = 'gray';
    return shadow;
  }

}

export class IPiece extends Piece {
  constructor(grid, centerX = 6, centerY = 21, orientation = 'north') {
    super(grid, centerX, centerY, orientation, 'cyan');
    /*
      .[.]. .
    */
    this.offsetsTable = {
      "north": [[-1, 0], [0, 0], [1, 0], [2, 0]],
      "east": [[1, 0], [1, 1], [1, -1], [1, -2]],
      "south": [[-1, -1], [0, -1], [1, -1], [2, -1]],
      "west": [[0, 0], [0, 1], [0, -1], [0, -2]],
    }

    this.kickTable = Piece.kickTable4Piece;
  }

  clone() {
    let shadow = new IPiece(this.grid, this.centerX, this.centerY, this.orientation);
    shadow.color = 'gray';
    return shadow;
  }
}

export class SPiece extends Piece {
  constructor(grid, centerX = 6, centerY = 21, orientation = 'north') {
    super(grid, centerX, centerY, orientation, 'limeGreen');
    /*
        . .
      .[.]
    */
    this.offsetsTable = {
      "north": [[-1, 0], [0, 0], [0, 1], [1, 1]],
      "east": [[0, 0], [0, 1], [1, 0], [1, -1]],
      "south": [[0, 0], [1, 0], [0, -1], [-1, -1]],
      "west": [[0, 0], [0, -1], [-1, 0], [-1, 1]],
    }
    this.kickTable = Piece.kickTable3Piece;
  }

  clone() {
    let shadow = new SPiece(this.grid, this.centerX, this.centerY, this.orientation);
    shadow.color = 'gray';
    return shadow;
  }

}


export class ZPiece extends Piece {
  constructor(grid, centerX = 6, centerY = 21, orientation = 'north') {
    super(grid, centerX, centerY, orientation, 'red');
    /*
      . .
       [.].
    */
    this.offsetsTable = {
      "north": [[-1, 1], [0, 1], [0, 0], [1, 0]],
      "east": [[0, 0], [0, -1], [1, 0], [1, 1]],
      "south": [[0, 0], [-1, 0], [0, -1], [1, -1]],
      "west": [[0, 0], [0, 1], [-1, 0], [-1, -1]],
    }
    this.kickTable = Piece.kickTable3Piece;
  }

  clone() {
    let shadow = new ZPiece(this.grid, this.centerX, this.centerY, this.orientation);
    shadow.color = 'gray';
    return shadow;
  }
}
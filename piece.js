import { Grid } from "./grid.js";
import { gameGrid } from "./game.js";

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

    if (rotationCenter === undefined){
      // try each rotation center in kick table
      for (let i = 1; i <= 5; i++){
        this.centerX = startingX + this.kickTable[kickIndex][i-1][0];
        this.centerY = startingY + this.kickTable[kickIndex][i-1][1];

        if(!this.checkForCollision()){
          // no collision
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

    if (rotationCenter === -1){
      // failed to rotate. Recover previous state
      this.centerX = startingX;
      this.centerY = startingY;
      this.orientation = prevOrientation;
      return -1; // for debugging
    }
    return -2; // this should not happen
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
        kickIndex = "L->2"
        break;
      case 'south':
        this.orientation = 'east';
        kickIndex = "2->R"
        break;
      case 'west':
        this.orientation = 'south';
        kickIndex = "R->0"
        break;
    }

    if (rotationCenter === undefined){
      // try each rotation center in kick table
      for (let i = 1; i<= 5; i++){
        this.centerX = startingX + this.kickTable[kickIndex][i-1][0];
        this.centerY = startingY + this.kickTable[kickIndex][i-1][1];

        if(!this.checkForCollision()){
          // no collision
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

    if (rotationCenter === -1){
      // failed to rotate. Recover previous state
      this.centerX = startingX;
      this.centerY = startingY;
      this.orientation = prevOrientation;
      return -1; // for debugging
    }
    return -2; // this should not happen
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
  moveUp() {
    this.centerY++;
    if(this.checkForCollision()){
      this.centerY--;
    }
  }
  moveDown() {
    this.centerY--;
    if(this.checkForCollision()){
      this.centerY++;
    }
  }

  softDrop() { return null; }
  hardDrop() {
    while (!(this.checkForCollision())) {
      this.centerY--;
    }
    this.centerY++;
    this.pieceToGrid();

  }

  /**
   * @returns true if collision in current position
   */
  checkForCollision() {
    console.log(this.getGridCoords());
    for (const [x, y] of this.getGridCoords()) {
      console.log(x + " " + y);
      if (x < 1 || x > this.grid.gridWidth || y < 1 || y > this.grid.gridHeight + 4) {
        return true;
      }
      if (gameGrid[gameGrid.length - y][x - 1] !== null) {
        return true;
      }
    }
    return false;
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
  constructor(grid, centerX = 6, centerY = 21, orientation = "north") {
    super(grid, centerX, centerY, orientation, 'orange');
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
}
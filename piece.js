import { Grid } from "./grid.js";

export class Piece {

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
  }

  rotateCW() { return null; }
  rotateCCW() { return null; }

  // TODO: Implement these
  moveLeft() { return null; }
  moveRight() { return null; }
  moveUp() { return null; }
  moveDown() { return null; }

  softDrop() { return null; }
  hardDrop() { return null; }

  drawSelf() {
    for (const [xOffset, yOffset] of this.offsets) {
      this.grid.fillGridCell(
        this.centerY + yOffset,
        this.centerX + xOffset,
        this.color
      );
    }
  }
}


export class LPiece extends Piece {
  constructor(grid, centerX = 8, centerY = 1, orientation = "north") {
    super(grid, centerX, centerY, orientation, 'orange');
    /*
          .
      .[.].
    */
    this.offsets = [[-1, 0], [0, 0], [1, 0], [1, 1]]
  }

}

export class JPiece extends Piece {
  constructor(grid, centerX = 3, centerY = 11, orientation = 'north') {
    super(grid, centerX, centerY, orientation, 'blue');
    /*
      .
      .[.].
    */
    this.offsets = [[-1, 1], [-1, 0], [0, 0], [1, 0]]
  }

}

export class TPiece extends Piece {
  constructor(grid, centerX = 7, centerY = 9, orientation = 'north') {
    super(grid, centerX, centerY, orientation, 'purple');
    /*
        .
      .[.].
    */
    this.offsets = [[-1, 0], [0, 0], [0, 1], [1, 0]]

  }

}

export class OPiece extends Piece {
  constructor(grid, centerX = 8, centerY = 13, orientation = 'north') {
    super(grid, centerX, centerY, orientation, 'yellow');
    /*
      . .
     [.].
    */
    this.offsets = [[0, 1], [0, 0], [1, 0], [1, 1]]
  }

}

export class IPiece extends Piece {
  constructor(grid, centerX = 2, centerY = 15, orientation = 'north') {
    super(grid, centerX, centerY, orientation, 'cyan');
    /*
      .[.]. .
    */
    this.offsets = [[-1, 0], [0, 0], [1, 0], [2, 0]]
  }

}

export class SPiece extends Piece {
  constructor(grid, centerX = 3, centerY = 1, orientation = 'north') {
    super(grid, centerX, centerY, orientation, 'limeGreen');
    /*
        . .
      .[.]
    */
    this.offsets = [[-1, 0], [0, 0], [0, 1], [1, 1]]
  }

}


export class ZPiece extends Piece {
  constructor(grid, centerX = 2, centerY = 3, orientation = 'north') {
    super(grid, centerX, centerY, orientation, 'red');
    /*
      . .
       [.].
    */
    this.offsets = [[-1, 1], [0, 1], [0, 0], [1, 0]]
  }

}

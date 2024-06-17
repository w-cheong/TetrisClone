import { drawGridPiece } from "./game.js";

class Piece {
  constructor(centerX = -1, centerY = 0, orientation = "north", color = "yellow") {
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
  moveUp() {return null;}
  moveDown() {return null;}

  softDrop() { return null; }
  hardDrop() { return null; }

  drawSelf() {
    for (const [xOffset, yOffset] of this.offsets) {
      drawGridPiece(
        this.centerY + yOffset,
        this.centerX + xOffset,
        this.color);
    }
  }
}


export class LPiece extends Piece {
  constructor() {
    super(8, 1, "north", "orange");
    /*
          .
      .[.].
    */
    this.offsets = [[-1, 0], [0, 0], [1, 0], [1, 1]]
  }

}

export class JPiece extends Piece {
  constructor() {
    super(3, 11, "north", "blue");
    /*
      .
      .[.].
    */
    this.offsets = [[-1, 1], [-1, 0], [0, 0], [1, 0]]
  }

}

export class TPiece extends Piece {
  constructor() {
    super(7, 9, "north", "purple");
    /*
        .
      .[.].
    */
    this.offsets = [[-1, 0], [0, 0], [0, 1], [1, 0]]

  }

}

export class OPiece extends Piece {
  constructor() {
    super(8, 13, "north", "yellow");
    /*
      . .
     [.].
    */
    this.offsets = [[0, 1], [0, 0], [1, 0], [1, 1]]
  }

}

export class IPiece extends Piece {
  constructor() {
    super(2, 15, "north", "cyan");
    /*
      .[.]. .
    */
    this.offsets = [[-1, 0], [0, 0], [1, 0], [2, 0]]
  }

}

export class SPiece extends Piece {
  constructor() {
    super(3, 1, "north", "limeGreen");
    /*
        . .
      .[.]
    */
    this.offsets = [[-1, 0], [0, 0], [0, 1], [1, 1]]
  }

}


export class ZPiece extends Piece {
  constructor() {
    super(2, 3, "north", "red");
    /*
      . .
       [.].
    */
    this.offsets = [[-1, 1], [0, 1], [0, 0], [1, 0]]
  }

}

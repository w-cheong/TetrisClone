import { drawGridPiece } from "./game.js";

class Piece {
  constructor(centerX=-1, centerY=0, orientation="north", color="yellow") {
    this.centerX = centerX;
    this.centerY = centerY;
    this.orientation = orientation;
    this.color = color;
  }

  // must be implemented in derived classes
  rotateCW() { return null; }
  rotateCCW() { return null; }
  moveLeft() { return null; }
  moveRight() { return null; }
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
  constructor() { // each specific piece should override this.
    super(8, 1, "north", "orange");
    /*
          .
      .[.].
    */
    this.offsets = [[-1, 0], [0, 0], [1, 0], [1, 1]]
  }

}

export class JPiece extends Piece {
  constructor() { // each specific piece should override this.
    super(3, 11, "north", "blue");
    /*
      .
      .[.].
    */
    this.offsets = [[-1, 1], [-1, 0], [0, 0], [1, 0]]
  }

}

export class TPiece extends Piece {
  constructor() { // each specific piece should override this.
    super(7, 9, "north", "purple");
    /*
        .
      .[.].
    */
    this.offsets = [[-1,0],[0,0],[0,1],[1,0]]

  }

}

export class OPiece extends Piece {
  constructor() { // each specific piece should override this.
    super(8, 13, "north", "yellow");
    /*
      . .
     [.].
    */
    this.offsets = [[0, 1], [0, 0], [1, 0], [1, 1]]
  }

}

export class IPiece extends Piece {
  constructor() { // each specific piece should override this.
    super(2, 15, "north", "cyan");
    /*
      .[.]. .
    */
    this.offsets = [[-1, 0], [0, 0], [1, 0], [2, 0]]
  }

}

export class SPiece extends Piece {
  constructor() { // each specific piece should override this.
    super(3, 1, "north", "limeGreen");
    /*
        . .
      .[.]
    */
    this.offsets = [[-1, 0], [0, 0], [0, 1], [1, 1]]
  }

}


export class ZPiece extends Piece {
  constructor() { // each specific piece should override this.
    super(2, 3, "north", "red");
    /*
      . .
       [.].
    */
    this.offsets = [[-1, 1], [0, 1], [0, 0], [1, 0]]
  }

}

import { drawGridPiece } from "./game.js";

class Piece {
  constructor() { // each specific piece should override this.
    this.centerX = -1;
    this.centerY = 0;
    this.orientation = "north";
  }

  // must be implemented in derived classes
  rotateCW() { return null; }
  rotateCCW() { return null; }
  moveLeft() { return null; }
  moveRight() { return null; }
  softDrop() { return null; }
  hardDrop() { return null; }
}


export class LPiece extends Piece {
  constructor() { // each specific piece should override this.
    super();
    this.centerX = 7;
    this.centerY = 4;
    this.orientation = "north";
    this.color = "orange"
    /*
          .
      .[.].
    */
    this.offsets = [[-1,0],[0,0],[1,0],[1,1]]
  }

  drawSelf(){
    for (const[xOffset, yOffset] of this.offsets){
      drawGridPiece(
        this.centerY + yOffset,
        this.centerX + xOffset,
        this.color);
    }
  }

}

class JPiece extends Piece {

}

class TPiece extends Piece {

}

class OPiece extends Piece {

}

class IPiece extends Piece {

}

class SPiece extends Piece {

}


class ZPiece extends Piece {

}

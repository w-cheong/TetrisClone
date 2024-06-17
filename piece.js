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
    super();
    this.centerX = 9;
    this.centerY = 1;
    this.orientation = "north";
    this.color = "orange"
    /*  
          .
      .[.].
    */
    this.offsets = [[-1, 0], [0, 0], [1, 0], [1, 1]]
  }

}

export class JPiece extends Piece {
  constructor() { // each specific piece should override this.
    super();
    this.centerX = 3;
    this.centerY = 11;
    this.orientation = "north";
    this.color = "blue"
    /*  
      .    
      .[.].
    */
    this.offsets = [[-1, 1], [-1, 0], [0, 0], [1, 0]]
  }

}

export class TPiece extends Piece {
  constructor() { // each specific piece should override this.
    super();
    this.centerX = 7;
    this.centerY = 9;
    this.orientation = "north";
    this.color = "purple"
    /*  
        .    
      .[.].
    */
    this.offsets = [[-1, 0], [0, 0], [0, 1], [1, 0]]
  }

}

export class OPiece extends Piece {
  constructor() { // each specific piece should override this.
    super();
    this.centerX = 8;
    this.centerY = 13;
    this.orientation = "north";
    this.color = "yellow"
    /*  
      . .   
     [.].
    */
    this.offsets = [[0, 1], [0, 0], [1, 0], [1, 1]]
  }

}

export class IPiece extends Piece {
  constructor() { // each specific piece should override this.
    super();
    this.centerX = 2;
    this.centerY = 15;
    this.orientation = "north";
    this.color = "cyan"
    /*         
      .[.]. .
    */
    this.offsets = [[-1, 0], [0, 0], [1, 0], [2, 0]]
  }

}

export class SPiece extends Piece {
  constructor() { // each specific piece should override this.
    super();
    this.centerX = 3;
    this.centerY = 1;
    this.orientation = "north";
    this.color = "limeGreen"
    /*  
        . .  
      .[.]
    */
    this.offsets = [[-1, 0], [0, 0], [0, 1], [1, 1]]
  }

}


export class ZPiece extends Piece {
  constructor() { // each specific piece should override this.
    super();
    this.centerX = 2;
    this.centerY = 3;
    this.orientation = "north";
    this.color = "red"
    /*  
      . .  
       [.].
    */
    this.offsets = [[-1, 1], [0, 1], [0, 0], [1, 0]]
  }

}

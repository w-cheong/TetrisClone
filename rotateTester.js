
import { Piece, LPiece, JPiece, TPiece, OPiece, IPiece, SPiece, ZPiece } from "./piece.js"

import { Grid } from './grid.js'


console.log('rotateTester is loaded')


const canvas = document.getElementById("testCanvas");

let grid = new Grid(canvas, 8, 8);
grid.draw();
console.log('filling cell 2,2')
grid.fillGridCell(1, 1, 'rgb(255 0 0 / 25%')

/**
 * @param {boolean[][]} testGrid Used to store whether grid position is already occupied
*/
let testGrid = [];

/**
 * @param {null | Piece} testPiece  active piece being tested
 */
let testPiece = null;


/*
These tests should be for checking individual entries in the kick table,
and the rotations using that.
*/
let tests = [
  {
    "Piece Type": "I",
    "Rotation Type": "CW",
    "Initial Orientation": "north",
    "Rotation Point": 1,
    "Starting Position": [4, 5],
    "Initial Occupied": [[3, 5], [4, 5], [5, 5], [6, 5]],
    "Final Orientation": "east",
    "Final Occupied": [[5, 3], [5, 4], [5, 5], [5, 6]]
  },
  {
    "Piece Type": "I",
    "Rotation Type": "CCW",
    "Initial Orientation": "north",
    "Rotation Point": 1,
    "Starting Position": [4, 5],
    "Initial Occupied": [[3, 5], [4, 5], [5, 5], [6, 5]],
    "Final Orientation": "west",
    "Final Occupied": [[4, 3], [4, 4], [4, 5], [4, 6]]
  },
  // TODO add more
]

/*
These tests are for checking that the correct rotation point gets chosen.
Diagrams with red blocks in Appendix A.
Assume the correct final placement of the piece after rotation (this should get tested by the other series of tests)
*/
let testsWithObstacles = [
  {
    "Piece Type": "I",
    "Rotation Type": "CW",
    "Initial Orientation": "east",
    "Obstacles": [ // list of rectangles. Store rectangle as two coordinates (bottom-left coordinate and top-right coordinate)
      [[6, 1], [8, 8]]
    ],
    "Starting Position": [4, 5], // this is center 1
    "Rotation Center": 2,
  },
  {
    "Piece Type": "I",
    "Rotation Type": "CCW",
    "Initial Orientation": "east",
    "Obstacles": [ // list of rectangles. Store rectangle as two coordinates (bottom-left coordinate and top-right coordinate)
      [[6, 1], [8, 8]]
    ],
    "Rotation Center": 3
  }
  // TODO add more
]

function runTests() {
  for (test of tests) {
    console.log(test)
    // create the piece at the specified location

    // draw the piece

    // time delay for visual

    // call the rotation method

    // draw the new position

    // check that final position and orientation are correct

    // time delay for visual


  }
}

/**
 * Draw the test grid.
 */
function draw() {
  grid.draw();
}

// runTests()
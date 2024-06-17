
import { Piece, LPiece, JPiece, TPiece, OPiece, IPiece, SPiece, ZPiece } from "./piece.js"

import { Grid } from './grid.js'


console.log('rotateTester is loaded')


const canvas = document.getElementById("testCanvas");

let grid = new Grid(canvas, 8, 8);
grid.draw();
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
These use (x,y) coordinates, 1-indexed
*/
let rotationTests = [
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
let rotationTestsWithObstacles = [
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


const timer = ms => new Promise(res => setTimeout(res, ms))

/**
 * Execute a specific rotation test
 * @param {rotationTests} test
 */
async function runRotationTest(test) {

  console.log('Test to be run:')
  console.log(test)

  let pieceType = test["Piece Type"]
  let initialOrientation = test["Initial Orientation"]
  let startingPos = test["Starting Position"]
  let rotationType = test["Rotation Type"]
  let rotationPoint = test["Rotation Point"]

  // initialize test piece with specified position and orientation
  testPiece = null;
  switch (pieceType) {
    case 'L':
      testPiece = new LPiece(grid, startingPos[0], startingPos[1], initialOrientation);
      break;
    case 'J':
      testPiece = new JPiece(grid, startingPos[0], startingPos[1], initialOrientation);
      break;
    case 'T':
      testPiece = new TPiece(grid, startingPos[0], startingPos[1], initialOrientation);
      break;
    case 'O':
      testPiece = new OPiece(grid, startingPos[0], startingPos[1], initialOrientation);
      break;
    case 'I':
      testPiece = new IPiece(grid, startingPos[0], startingPos[1], initialOrientation);
      break;
    case 'S':
      testPiece = new SPiece(grid, startingPos[0], startingPos[1], initialOrientation);
      break;
    case 'Z':
      testPiece = new ZPiece(grid, startingPos[0], startingPos[1], initialOrientation);
      break;
    default:
      console.log(`Invalid piece type: ${pieceType}`)
  }

  // draw the piece
  grid.draw();
  testPiece.drawSelf();

  // check that piece spawned in correct location
  if (!sameCoordinates(test['Initial Occupied'], testPiece.getGridCoords())) {
    console.log(`Piece did not spawn correctly. Expected ${test["Initial Occupied"]}, but got ${testPiece.getGridCoords()}`);
    // alert("Piece did not spawn correctly.")
    console.log('Expected:')
    console.log(test["Initial Occupied"])
    console.log('Got:')
    console.log(testPiece.getGridCoords())
  } else {
    console.log('Piece spawned correctly');
    // alert("Piece spawned correctly.")
  }

  // time delay for visual
  await timer(2000);

  // rotate the piece
  console.log('Performing rotation')
  switch (rotationType) {
    case 'CW':
      testPiece.rotateCW(rotationPoint)
      break;
    case 'CCW':
      testPiece.rotateCCW(rotationPoint)
      break;
    default:
      console.log(`Invalid rotation type: ${rotationType}`);
  }

  console.log('Redrawing after rotation.')
  // piece after rotation
  grid.draw();
  testPiece.drawSelf();
  await timer(2000);

  // check the final orientation is correct
  const expectedOrientation = test["Final Orientation"]
  if (testPiece.getOrientation() !== expectedOrientation) {
    console.log(`Incorrect orientation. Expected ${expectedOrientation.toString()} but got ${testPiece.getOrientation()}`);
  } else {
    console.log('Correct orientation after rotation')
  }

  // check the final position is correct
  if (!sameCoordinates(test["Final Occupied"], testPiece.getGridCoords())) {
    console.log(`Incorrect position. Expected ${test["Final Occupied"]} but got ${testPiece.getGridCoords()}`);
    console.log(test["Final Occupied"]);
    console.log(testPiece.getGridCoords());
  } else {
    console.log('Correct position after rotation')
  }
}

async function runTests() {
  for (const test of rotationTests) {
    await timer(2000);
    runRotationTest(test)
    await timer(2000);
  }
  console.log('Finished running test suite')
}

/**
 * Draw the test grid.
 */
function draw() {
  grid.draw();
}


function sameCoordinates(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  // convert coords from number[] to string
  let arr1Str = arr1.map((x) => x.toString())
  let arr2Str = arr2.map((x) => x.toString())

  return arr1Str.every(coord => arr2Str.includes(coord))
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

runTests()

function drawState(){
  grid.draw();
  testPiece?.drawSelf();
  testPiece?.drawPieceCenter();
}

setInterval(drawState, 10);
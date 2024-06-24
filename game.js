import * as pieces from "./piece.js";

import { Grid } from "./grid.js";

const playfieldCanvas = document.getElementById("playfield");
const playfieldCTX = playfieldCanvas.getContext("2d");

const holdAreaCanvas = document.getElementById('holdArea');
const holdAreaCTX = holdAreaCanvas.getContext("2d");

const nextQueueCanvas = document.getElementById('nextQueue');
const nextQueueCTX = nextQueueCanvas.getContext("2d");


let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

// let startingDelay = 300;
// let autoDownDelay = startingDelay;

let totalLinesCleared = 0;

let ticksElapsed = 0;

let initialTicksUntilMoveDown = 10
let ticksUntilMoveDown = initialTicksUntilMoveDown;

let holdPressed = false;
let holdPiece = null;

let gameOver = false;
let paused = false;

export let playfieldGrid = new Grid(playfieldCanvas, 10, 20, true);
export let holdAreaGrid = new Grid(holdAreaCanvas, 4, 4, true);
let nextQueueGrid = new Grid(nextQueueCanvas, 4, 17, true);

export let gameGrid = [
  [null, null, null, null, null, null, null, null, null, null], // 23
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null], // 20
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null], // 15
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null], // 10
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null], // 5
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null], // 2
  [null, null, null, null, null, null, null, null, null, null] // 1
];

let currentPiece = new generateRandomPiece()
currentPiece.drawSelf();

// let piece = currentPiece;
// piece.shadowToGrid();
// console.log(piece);
// piece.drawSelf();

function drawPlayfield() {
  if (!(paused)) {

    playfieldGrid.draw()

    drawPlayFieldState();

    //let piece = new pieces.ZPiece(playfieldGrid, 3, 6, "north");
    // piece.setOrientation('east')
    // piece.setOrientation('south')
    // piece.setOrientation('west')
    //piece.drawSelf();
    // piece.drawPieceCenter();

    //piece.shadowToGrid();
    //piece.drawSelf();

    if (rightPressed) {
      //piece.moveRight();
      currentPiece.moveRight();
    } if (leftPressed) {
      currentPiece.moveLeft();
    } if (upPressed) {
      currentPiece.moveUp();
    }
    if (downPressed) {
      currentPiece.moveDown();
    }
    currentPiece.drawSelf();
    currentPiece.drawPieceCenter();
  }
  else {

  }
}


function drawPlayFieldState() {
  //check array for if the position on the playfield should be filled
  //if filled call drawGridPiece() to fill the color in.
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 10; j++) {
      let element = gameGrid[gameGrid.length - i - 1][j];
      if (element != null) {
        playfieldGrid.fillGridCell(i + 1, j + 1, element);
      }
    }
  }
}

function drawHoldArea() {
  holdAreaGrid.draw();
  holdPiece?.drawSelf();
}

function drawNextQueue() {
  // TODO
  nextQueueGrid.draw();
}

function drawShadow() {
  // TODO
}

function lineClear() {
  let counter = 0; //note: create text display for single, double, triple, tetris using this
  for (let i = gameGrid.length - 1; i >= 0;) {
    if (!(gameGrid[i].includes(null))) {
      //clear line
      //move all lines above a row down
      gameGrid.splice(i, 1);
      gameGrid.unshift([null, null, null, null, null, null, null, null, null, null]);
      //gameGrid[0] = [null, null, null, null, null, null, null, null, null, null];
      counter++;
      console.log(gameGrid);
    } else {
      i--;
    }
  }
  totalLinesCleared += counter;
  ticksUntilMoveDown = initialTicksUntilMoveDown - Math.round(3 * totalLinesCleared / 5)
}

/**
 *  @returns a newly constructed random tetris piece
 */
function generateRandomPiece() {
  switch (Math.floor(Math.random() * 7)) {
    case 0:
      return new pieces.LPiece(playfieldGrid);
    case 1:
      return new pieces.JPiece(playfieldGrid);
    case 2:
      return new pieces.TPiece(playfieldGrid);
    case 3:
      return new pieces.OPiece(playfieldGrid);
    case 4:
      return new pieces.IPiece(playfieldGrid);
    case 5:
      return new pieces.SPiece(playfieldGrid);
    case 6:
      return new pieces.ZPiece(playfieldGrid);
  }
}

function draw() {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!(gameOver)) {
    drawPlayfield();
    drawHoldArea();
    drawNextQueue();
    drawShadow();

    if (!(paused)) {
      ticksElapsed++;
      if (ticksElapsed >= ticksUntilMoveDown) {
        console.log('here')
        ticksElapsed = 0;
        currentPiece.moveDown();
        // if the coords of the piece are the same after the movedown
        // set amount of ticks before automatically dropping
      }
    }
    else {
      //Text("Game Over", "Gill Sans", 100, 150, 'white');
    }
  }
}

function startGame() {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  function keyDownHandler(e) {
    console.log('Pressed: ' + e.key);

    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    } else if (e.key === "Up" || e.key === "ArrowUp") {
      upPressed = true;
    } else if (e.key === "Down" || e.key === "ArrowDown") {
      downPressed = true;
    } else if (e.key === 'd' && !paused) {
      currentPiece.rotateCCW();
      drawPlayfield();
    } else if (e.key === 'f' && !paused) {
      currentPiece.rotateCW();
      drawPlayfield();
    } else if (e.key === 'p') {
      paused = paused ? false : true;
    } else if (e.key === ' ' && !paused) {
      currentPiece.hardDrop();
      lineClear();
      //check if piece would spawn where a block already is (above visible game grid)
      if (gameGrid[2][5] !== null || gameGrid[2][6] !== null || gameGrid[2][7] !== null) {
        gameOver = true;
      }
      else {
        currentPiece = generateRandomPiece(); // should generate new piece randomly
        holdPressed = false;
      }
    } else if (e.key === 'Shift' && !holdPressed && !paused) {
      holdPressed = true;
      if (holdPiece !== null) { //if hold has a piece
        let tempPiece = currentPiece;
        currentPiece = holdPiece;
        holdPiece = tempPiece;
      } else { //if hold has no piece
        holdPiece = currentPiece;
        currentPiece = generateRandomPiece(); //must change for hold bar
      }
      holdPiece.moveToHoldGrid();
      holdPiece.drawSelf(); //need to show something
      currentPiece.moveToPlayfieldGrid();
      currentPiece.drawSelf();
    }
  }

  function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    } else if (e.key === "Up" || e.key === "ArrowUp") {
      upPressed = false;
    } else if (e.key === "Down" || e.key === "ArrowDown") {
      downPressed = false;
    }
  }

  const interval = setInterval(draw, 50);

  // const gravity = setTimeout(moveCurrentPieceDown, autoDownDelay);
}

// function updateGravity (callback, totalLinesCleared){
//   var internalCallback = function (){
//     return function() {
//       let newDelay = startingDelay - Math.round(totalLinesCleared*.1);
//       window.setTimeout(internalCallback, newDelay)
//     }
//   }
//   window.setTimeout(newDelay)
// }

// function moveCurrentPieceDown(){
//   currentPiece.moveDown();
// }

startGame();
// document.getElementById("runButton").addEventListener("click", function () {
//   startGame();
//   this.disabled = true;
// });

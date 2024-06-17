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

let playfieldGrid = new Grid(playfieldCanvas, 10, 20, true);
let holdAreaGrid = new Grid(holdAreaCanvas, 4, 4, true);
let nextQueueGrid = new Grid(nextQueueCanvas, 4, 17, true);

let gameGrid = [
  [null, null, null, null, null, null, null, null, null, null], // 23
  [null, null, null, null, null, "blue", null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, "cyan", null, null, null, "blue", null, null], // 20
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
  [null, null, null, null, null, "yellow", null, null, null, null],
  [null, null, null, null, null, "yellow", null, null, null, null], // 5
  [null, null, null, null, null, "yellow", null, null, null, null],
  [null, null, null, null, null, "yellow", null, null, null, null],
  [null, null, null, null, null, "yellow", null, null, null, null], // 2
  [null, null, null, null, null, "yellow", null, null, null, null] // 1
];

let currentPiece = new pieces.LPiece(playfieldGrid)
currentPiece.drawSelf();


function drawPlayfield() {

  playfieldGrid.draw()

  drawPlayFieldState();

  //testing pieces
  // const J_Piece = new pieces.JPiece(playfieldGrid)
  // J_Piece.drawSelf();
  // const T_Piece = new pieces.TPiece(playfieldGrid)
  // T_Piece.drawSelf();
  // const O_Piece = new pieces.OPiece(playfieldGrid)
  // O_Piece.drawSelf();
  // const I_Piece = new pieces.IPiece(playfieldGrid)
  // I_Piece.drawSelf();
  // const S_Piece = new pieces.SPiece(playfieldGrid)
  // S_Piece.drawSelf();
  // const Z_Piece = new pieces.ZPiece(playfieldGrid)
  // Z_Piece.drawSelf();


  let piece = new pieces.ZPiece(playfieldGrid, 3, 6, "north");
  // piece.setOrientation('east')
  // piece.setOrientation('south')
  // piece.setOrientation('west')
  piece.drawSelf();
  piece.drawPieceCenter();

  if (rightPressed) {
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
  // TODO
  holdAreaGrid.draw();
}

function drawNextQueue() {
  // TODO
  nextQueueGrid.draw();
}

function drawShadow() {
  // TODO
}


function draw() {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayfield();
  drawHoldArea();
  drawNextQueue()
  drawShadow();
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
    } else if (e.key === 'd') {
      currentPiece.rotateCCW();
      drawPlayfield();
    } else if (e.key === 'f') {
      currentPiece.rotateCW();
      drawPlayfield();
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

}

startGame();
// document.getElementById("runButton").addEventListener("click", function () {
//   startGame();
//   this.disabled = true;
// });
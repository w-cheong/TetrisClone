import * as pieces from "./piece.js";

import { Grid } from "./grid.js";

const playfieldCanvas = document.getElementById("playfield");
const playfieldCTX = playfieldCanvas.getContext("2d");

const holdAreaCanvas = document.getElementById('holdArea');
const holdAreaCTX = holdAreaCanvas.getContext("2d");

const nextQueueCanvas = document.getElementById('nextQueue');
const nextQueueCTX = nextQueueCanvas.getContext("2d");

const gameOverDiv = document.getElementById('gameOverDiv');
const gameOverDivHeight = gameOverDiv.offsetHeight;
const gameContainer = document.getElementById('game');
const gameContainerHeight = gameContainer.offsetHeight;

const resetBtn = document.getElementById('resetBtn');

gameOverDiv.style.top = `${gameContainerHeight / 2 - gameOverDivHeight / 2}px`

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

/**
 * This boolean is to prevent user from swapping a piece to hold multiple times in a row.
 */
let holdPreviouslyUsed = false;
let holdPiece = null;

let gameOver = false;
let paused = false;

export let playfieldGrid = new Grid(playfieldCanvas, 10, 20, true);
export let holdAreaGrid = new Grid(holdAreaCanvas, 4, 4, true);
export let nextQueueGrid = new Grid(nextQueueCanvas, 4, 17, true);

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

/**
 * Queue containing the next few pieces
 * @param {Piece[]} queue
 */
let queue = [];
populateQueue();

/**
 * Populate the queue from scratch.
 * Adds five elements.
 */
function populateQueue() {
  // initializes next queue
  for (let i = 0; i < 5; i++) {
    queue.push(new generateRandomPiece());
    queue[i].moveQueuePieceToNextQueueGrid(i);
  }
}

/**
 * Update every game tick (key being held down)
 */
function updatePiecePosition() {
  if (rightPressed) {
    currentPiece.moveRight();
  }
  if (leftPressed) {
    currentPiece.moveLeft();
  }
  if (upPressed) {
    currentPiece.moveUp();
  }
  if (downPressed) {
    currentPiece.moveDown();
  }
}


function drawPlayfield() {
  if (paused)  //  shouldn't update if paused
    return;

  playfieldGrid.draw();

  drawPlayFieldState();

  updatePiecePosition();

  currentPiece.drawSelf();
  currentPiece.drawPieceCenter(); // for debugging, remove eventually
}


/**
 * Draws the pieces stored in `gameGrid`
 */
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

/**
 * Draw the queue
 */
function drawNextQueue() {
  nextQueueGrid.draw();
  for (const piece of queue) {
    piece.drawSelf();
  }
}

function drawShadow() {
  // TODO
}

/**
 * Update queue when piece moves out of queue.
 */
function updateQueue() {
  currentPiece = queue.shift();
  currentPiece.moveToPlayfieldGrid();
  queue.push(generateRandomPiece());

  // update positions of all pieces in queue
  for (let i = 0; i < 5; i++) {
    queue[i].moveQueuePieceToNextQueueGrid(i);
  }

}

function lineClear() {
  let counter = 0;
  for (let i = gameGrid.length - 1; i >= 0;) {
    if (!(gameGrid[i].includes(null))) {
      //clear line
      //move all lines above a row down
      gameGrid.splice(i, 1);
      gameGrid.unshift([null, null, null, null, null, null, null, null, null, null]);
      counter++;
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
  if (paused || gameOver) return;

    drawPlayfield();
    drawHoldArea();
    drawNextQueue();
    drawShadow();

    // logic to handle automatic movedown after timer expires & piece lock
    ticksElapsed++;
    if (ticksElapsed >= ticksUntilMoveDown) {
      // console.log('here')
      ticksElapsed = 0;
      let moveDownSucceeded = currentPiece.moveDown();
      if (!moveDownSucceeded) {
        lockPieceIntoGridAndContinue()
      }
    }
}

function triggerGameOver() {
  gameOver = true;
  gameOverDiv.style.visibility = "visible";
  console.log('Game over')
}

function lockPieceIntoGridAndContinue() {
  currentPiece.pieceToGrid();
  lineClear();
  draw();
  //check if piece would spawn where a block already is (above visible game grid)
  if (gameGrid[2][5] !== null || gameGrid[2][6] !== null || gameGrid[2][7] !== null) {
    triggerGameOver();
  }
  else {
    //adjust the nextQueue
    updateQueue();
    drawNextQueue();
    holdPreviouslyUsed = false;
    currentPiece.moveToPlayfieldGrid();
  }
}

/**
 * Executed on click to reset game.
 * Setting things up for new game.
 */
function resetGame(){

  totalLinesCleared = 0;

  ticksElapsed = 0;

  initialTicksUntilMoveDown = 10
  ticksUntilMoveDown = initialTicksUntilMoveDown;

  holdPreviouslyUsed = false;
  holdPiece = null;


  // reset gameGrid
  for (let i = 0; i < 23; i++) {
    for (let j = 0; j < 10; j++) {
      gameGrid[i][j] = null;
    }
  }

  currentPiece = new generateRandomPiece()
  currentPiece.drawSelf();

  // reset next queue
  queue = [];

  populateQueue();

  gameOverDiv.style.visibility = "hidden";

  gameOver = false;
  paused = false;

}

function keyDownHandler(e) {
  // console.log('Keydown: ' + e.key);
  if (gameOver) {
    if (e.key === 'r'){
      resetGame();
    }
    return
  }
  if (e.key === 'p'){
    paused = !paused;
  }

  if (paused){
    return;
  }

  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  } else if (e.key === "Up" || e.key === "ArrowUp") {
    upPressed = true;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed = true;
  } else if (e.key === 'd' ) {
    currentPiece.rotateCCW();
    drawPlayfield();
  } else if (e.key === 'f') {
    currentPiece.rotateCW();
    drawPlayfield();
  } else if (e.key === ' ') {
    currentPiece.hardDrop();
    lockPieceIntoGridAndContinue();
  } else if (e.key === 'Shift' && !holdPreviouslyUsed) {
    holdPreviouslyUsed = true;
    if (holdPiece !== null) { //if hold has a piece
      let tempPiece = currentPiece;
      currentPiece = holdPiece;
      holdPiece = tempPiece;
    } else { //if hold has no piece
      holdPiece = currentPiece;
      updateQueue();
      drawNextQueue();
      //currentPiece = generateRandomPiece(); //must change for hold bar
    }
    holdPiece.moveToHoldGrid();
    holdPiece.drawSelf(); //need to show something
    currentPiece.moveToPlayfieldGrid();
    currentPiece.drawSelf();
  }
}

function keyUpHandler(e) {
  // console.log('Keyup: ' + e.key);

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

function startGame() {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  resetBtn.addEventListener('click', resetGame);
  resetBtn.addEventListener('keydown', resetGame);

  setInterval(draw, 50);
}

startGame();

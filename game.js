import * as pieces from "./piece.js";

import { Grid } from "./grid.js";

const playfieldCanvas = document.getElementById("playfield");

const holdAreaCanvas = document.getElementById('holdArea');

const nextQueueCanvas = document.getElementById('nextQueue');

const gameOverDiv = document.getElementById('gameOverDiv');
const gameOverDivHeight = gameOverDiv.offsetHeight;
const gameContainer = document.getElementById('game');
const gameContainerHeight = gameContainer.offsetHeight;

const resetBtn = document.getElementById('resetBtn');

gameOverDiv.style.top = `${gameContainerHeight / 2 - gameOverDivHeight / 2}px`

let rightPressed = false;
let leftPressed = false;
//let upPressed = false;
let downPressed = false;

// let startingDelay = 300;
// let autoDownDelay = startingDelay;

let totalLinesCleared = 0;

/**
 * Global game tick.
 * For overall timing of things.
 * Increments on every refresh.
 */
let gameTick = 0;

/**
 * When to check for held keys. Updates based on last key pressed (to allow for delay before repeating)
 */
let tickToRepeatHeldKey = -1;

/**
 * How long to wait before starting to repeat movement
 */
const INITIAL_HELD_KEY_CHECK_DELAY = 8;

/**
 * How many ticks to wait between key replays
 */
const HELD_KEY_DELAY = 2;

/**
 * Used to auto-drop piece
 */
let ticksElapsed = 0;

/**
 * Starting drop delay speed
 */
const INITIAL_TICKS_TILL_MOVE_DOWN = 30;

let ticksUntilMoveDown = INITIAL_TICKS_TILL_MOVE_DOWN;

/**
 * For toggling things related to debugging the rotation
 */
const DEBUG_ROTATION = false;

/**
 * For toggling auto-move-down "gravity"
 */
const GRAVITY = true;


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
 * @param {pieces[]} queue
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
 * Refires movement being held down, with correct delay.
 *
 * Called by redraw
 */
function handleHeldMovement() {
  // up and down use older update approach (on refresh)

  // if (upPressed) {
  //   currentPiece.moveUp();
  //   console.log('Refiring Up')
  // }
  if (downPressed) {
    currentPiece.softDrop();
    console.log('Refiring Down')
  }

  // left and right use update based on timing
  if (gameTick < tickToRepeatHeldKey)
    return;

  if (rightPressed) {
    console.log('Refiring Right')
    currentPiece.moveRight();
  }
  if (leftPressed) {
    console.log('Refiring Left')
    currentPiece.moveLeft();
  }

  // update to prevent repeat from occurring too quickly.
  tickToRepeatHeldKey = gameTick + HELD_KEY_DELAY;
}


function drawPlayfield() {
  if (paused)  //  shouldn't update if paused
    return;

  playfieldGrid.draw();

  drawPlayFieldState();

  drawShadow();

  currentPiece.drawSelf();

  if (DEBUG_ROTATION) {
    currentPiece.drawPieceCenter(); // for debugging, remove eventually
  }
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
  currentPiece.drawShadow();
}

/**
 * @param {number} level
 * @return {number} ticks before auto-move-down
 */
function autoMoveDownDelay(level) {
  return INITIAL_TICKS_TILL_MOVE_DOWN - 2 * level;
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
  ticksUntilMoveDown = autoMoveDownDelay(Math.floor(totalLinesCleared/5));
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

/**
 * Amount to wait before locking piece
 */
const LOCK_DELAY = 20;

let tickToLockPiece = -1;
let minCenterY = -1;


function draw() {
  if (paused || gameOver) return;

  gameTick++;

  if (GRAVITY) {

    // logic to handle automatic movedown after timer expires & piece lock

    ticksElapsed++;

    // console.log("gameTick: " + gameTick)
    // console.log("tickToLockPiece: " + tickToLockPiece)

    if (tickToLockPiece !== -1 && gameTick >= tickToLockPiece) {
      // piece locking
      // console.log('in here')
      //try movedown again
      // let moveDownSucceeded = currentPiece.softDrop();
      if (currentPiece.checkIsOnSurface()) {
        // console.log('locking')
        lockPieceIntoGridAndContinue();
        tickToLockPiece = -1;
        minCenterY = -1;
      } else {
        // move down succeeded, reset lock down timer
        // ticksElapsed = 0;
        tickToLockPiece = gameTick + LOCK_DELAY;
      }

    }

    if (ticksElapsed >= ticksUntilMoveDown) {
      // gravity
      // timer expired for moving down
      // console.log('also here')
      ticksElapsed = 0;
      let moveDownSucceeded = currentPiece.softDrop();

      if (!moveDownSucceeded) {
        // piece has hit a surface, should begin countdown for locking piece down

        if (minCenterY === -1) { // hasn't hit surface previously
          // console.log('has not hit surface previously')
          minCenterY = currentPiece.centerY;
          tickToLockPiece = gameTick + LOCK_DELAY; // start countdown for locking piece
        } else { // hit surface after having previously hit surface
          if (minCenterY > currentPiece.centerY) { // the surface is lower / different
            // console.log('has hit lower surface')
            minCenterY = currentPiece.centerY;
            tickToLockPiece = gameTick + LOCK_DELAY; // reset countdown for locking piece
          }
        }


      }
    }
  }

  handleHeldMovement();
  drawPlayfield();
  drawHoldArea();
  drawNextQueue();
}

function triggerGameOver() {
  gameOver = true;
  gameOverDiv.style.visibility = "visible";
  console.log('Game over')
}

function lockPieceIntoGridAndContinue() {
  currentPiece.pieceToGrid();
  lineClear();
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

  gameTick = 0;
  tickToRepeatHeldKey = -1;

  ticksElapsed = 0;

  ticksUntilMoveDown = INITIAL_TICKS_TILL_MOVE_DOWN

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

/**
 * For handling movement with delay properly.
 * Set relevant variables
 */
function handleMovementDelay(keypress) {

  if (keypress === 'left') {
    if (leftPressed) {
      // console.log('left OS repeat ignored');
      return;
    }
    currentPiece.moveLeft();
    leftPressed = true;
  }
  if (keypress === 'right') {
    if (rightPressed) {
      // console.log('right OS repeat ignored')
      return;
    }
    currentPiece.moveRight();
    rightPressed = true;
  }

  drawPlayfield();
  tickToRepeatHeldKey = gameTick + INITIAL_HELD_KEY_CHECK_DELAY;
  console.log(`tickToRepeatHeldKey = ${tickToRepeatHeldKey}`)
}

function keyDownHandler(e) {
  // console.log('Keydown: ' + e.key);
  if (gameOver) {
    if (e.key === 'r'){
      resetGame();
    }
    return
  }
  if (e.key === 'p') {
    paused = !paused;
  }

  if (paused) {
    return;
  }

  if (e.key === "Right" || e.key === "ArrowRight") {
    handleMovementDelay("right");
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    handleMovementDelay("left");
  } /** else if (e.key === "Up" || e.key === "ArrowUp") {
    upPressed = true;
    currentPiece.moveUp();
    // handleMovementDelay('up');
  } */ else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed = true;
    currentPiece.softDrop();
    // handleMovementDelay('down');
  } else if (e.key === 'd') {
    currentPiece.rotateCCW();
    drawPlayfield();
  } else if (e.key === 'f') {
    currentPiece.rotateCW();
    drawPlayfield();
  } else if (e.key === ' ') {
    currentPiece.hardDrop();
    lockPieceIntoGridAndContinue();
    drawPlayfield();
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
  } /* else if (e.key === "Up" || e.key === "ArrowUp") {
    upPressed = false;
  } */ else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed = false;
  }
}

function startGame() {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  resetBtn.addEventListener('click', resetGame);
  resetBtn.addEventListener('keydown', resetGame);

  setInterval(draw, 16.66);  // 60 fps = 16.66 ms delay

}

startGame();

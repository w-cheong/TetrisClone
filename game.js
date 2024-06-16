const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;

let rightPressed = false;
let leftPressed = false;
// 10 by 20
let playfieldWidth = canvas.width*.4;
let playfieldHeight = canvas.height;

let playfieldStartX = canvas.width*.3;
let playfieldStartY = 0;

let gridWidth = 10;
let gridHeight = 20;

let gridPieceWidth = playfieldWidth/gridWidth;
let gridPieceHeight = playfieldHeight/gridHeight;

let gameGrid = [[null, null, null, null, null, null, null, null, null, null], // 23
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
                [null, null, null, null, null, "yellow", null, null, null, null]]; // 1

/*
    ......x...
    ....xxx...
*/



function drawPlayfield(){

  ctx.beginPath();

  // overall playfield
  ctx.rect(
    playfieldStartX,
    playfieldStartY,
    playfieldWidth,
    playfieldHeight
  )
  ctx.fillStyle = "#000000";
  ctx.fill();

  // draw grid within playfield
  for (let c = 0; c < gridWidth; c++) {
    for (let r = 0; r < gridHeight; r++) {
      ctx.strokeStyle = "gray";
      ctx.strokeRect(
        playfieldStartX + c*gridPieceWidth,
        playfieldStartY + r*gridPieceHeight,
        gridPieceWidth, gridPieceHeight);
    }
  }

  drawPlayFieldState();

  ctx.closePath();
}


function drawPlayFieldState()
{
  //check array for if the position on the playfield should be filled
  //if filled call drawGridPiece() to fill the color in. 
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 10; j++) {
      let element = gameGrid[gameGrid.length - i-1][j];
      if (element != null) {
        drawGridPiece(i + 1, j + 1, element);
        console.log(element);
      }
    }
  }
}


// r = row counted from bottom (1 to 20)
// c = column counted from left (1 to 10)
// color = string denoting the color to use
function drawGridPiece(r,c,color)
{
  ctx.fillStyle = color;
  ctx.fillRect(playfieldStartX + gridPieceWidth*(c-1),
    playfieldStartY + gridPieceHeight*(20-r),
    gridPieceWidth,
    gridPieceHeight);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayfield();
}

function startGame() {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
  }

  const interval = setInterval(draw, 10);

}

startGame();
// document.getElementById("runButton").addEventListener("click", function () {
//   startGame();
//   this.disabled = true;
// });
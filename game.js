const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;

let rightPressed = false;
let leftPressed = false;

function drawPlayfield(){
  ctx.beginPath();
  ctx.rect(
    canvas.width*.3,
    0,
    canvas.width*.4,
    canvas.height
  )
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// function drawBall() {
//   ctx.beginPath();
//   ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
//   ctx.fillStyle = "#0095DD";
//   ctx.fill();
//   ctx.closePath();
// }

// function drawPaddle() {
//   ctx.beginPath();
//   ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
//   ctx.fillStyle = "#0095DD";
//   ctx.fill();
//   ctx.closePath();
// }


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
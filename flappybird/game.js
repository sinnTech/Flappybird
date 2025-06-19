
const game = document.getElementById("game");
const bird = document.getElementById("bird");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");
const gameOverScreen = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");
const finalHighScoreDisplay = document.getElementById("final-high-score");

// ====== GAME VARIABLES ======
let birdY = 300;
let birdVelocity = 0;
let gravity = 0.5;
let pipes = [];
let score = 0;
let highScore = localStorage.getItem("flappyHighScore") || 0;
let gameRunning = true;
let pipeGap = 150;
let frames = 0;

// ====== INITIAL SETUP ======
highScoreDisplay.textContent = `High Score: ${highScore}`;
createClouds();

// ====== JUMP MECHANICS ======
function jump(e) {
  if (e.code === "Space") e.preventDefault(); // Stop spacebar from scrolling
  if (!gameRunning) return;
  
  birdVelocity = -10;
  bird.classList.add("flap");
  setTimeout(() => bird.classList.remove("flap"), 150);
}

// ====== PIPE GENERATION ======
function createPipe(topHeight) {
  const topPipe = document.createElement("div");
  topPipe.className = "pipe";
  topPipe.style.height = topHeight + "px";
  topPipe.style.left = "400px";
  game.appendChild(topPipe);

  const bottomPipe = document.createElement("div");
  bottomPipe.className = "pipe bottom";
  bottomPipe.style.height = (600 - topHeight - pipeGap) + "px";
  bottomPipe.style.left = "400px";
  game.appendChild(bottomPipe);

  pipes.push({ x: 400, topHeight, top: topPipe, bottom: bottomPipe });
}

// ====== CLOUDS (BACKGROUND) ======
function createClouds() {
  for (let i = 0; i < 5; i++) {
    const cloud = document.createElement("div");
    cloud.className = "cloud";
    cloud.style.width = Math.random() * 60 + 40 + "px";
    cloud.style.height = Math.random() * 30 + 20 + "px";
    cloud.style.top = Math.random() * 400 + "px";
    cloud.style.left = Math.random() * 400 + "px";
    game.appendChild(cloud);
  }
}

// ====== GAME LOOP ======
function updateGame() {
  if (!gameRunning) return;

  // 1. Update bird position
  birdVelocity += gravity;
  birdY += birdVelocity;
  bird.style.top = birdY + "px";

  // 2. Generate new pipes
  if (frames % 100 === 0 && pipes.length < 3) {
    createPipe(Math.random() * 300 + 50);
  }
  frames++;

  // 3. Move pipes & check collisions
  pipes.forEach((pipe, index) => {
    pipe.x -= 2;
    pipe.top.style.left = pipe.x + "px";
    pipe.bottom.style.left = pipe.x + "px";

    // Remove off-screen pipes
    if (pipe.x < -60) {
      pipe.top.remove();
      pipe.bottom.remove();
      pipes.splice(index, 1);
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      
      // Update high score
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("flappyHighScore", highScore);
        highScoreDisplay.textContent = `High Score: ${highScore}`;
      }
    }

    // Collision detection
    if (
      birdY < 0 || birdY > 570 || // Hits top/bottom
      (pipe.x < 90 && pipe.x > 30 && // Hits pipe
        (birdY < pipe.topHeight || birdY + 40 > pipe.topHeight + pipeGap))
    ) {
      gameOver();
    }
  });

  requestAnimationFrame(updateGame);
}

// ====== GAME OVER ======
function gameOver() {
  gameRunning = false;
  finalScoreDisplay.textContent = score;
  finalHighScoreDisplay.textContent = highScore;
  gameOverScreen.style.display = "block";
}

// ====== RESTART GAME ======
function restartGame() {
  // 1. Clear pipes
  document.querySelectorAll(".pipe").forEach(pipe => pipe.remove());
  pipes = [];
  
  // 2. Reset bird
  birdY = 300;
  birdVelocity = 0;
  bird.style.top = "300px";
  
  // 3. Reset score
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  
  // 4. Hide game over screen
  gameOverScreen.style.display = "none";
  
  // 5. Restart game
  gameRunning = true;
  frames = 0;
  updateGame();
}

// ====== EVENT LISTENERS ======
document.addEventListener("keydown", jump);
game.addEventListener("mousedown", jump);

// ====== START GAME ======
updateGame();

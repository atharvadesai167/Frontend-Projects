const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const playBtn = document.getElementById("playBtn");

canvas.width = 400;
canvas.height = 600;

// 🎮 Game State
let gameStarted = false;
let animationId;

// 🐦 Bird
let bird;
let pipes;
let frame;
let score;
let gap = 180;

// 🔁 Reset Game
function resetGame() {
    bird = {
        x: 50,
        y: 200,
        width: 20,
        height: 20,
        velocity: 0,
        gravity: 0.4,
        lift: -10
    };

    pipes = [];
    frame = 0;
    score = 0;
}

// 🎮 Controls
function flap() {
    if (!gameStarted) return;
    bird.velocity = bird.lift;
}

document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        flap();
    }
});

document.addEventListener("click", function () {
    flap();
});

// 🐦 Draw Bird
function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// 🚧 Create Pipes
function createPipe() {
    let top = Math.random() * 250;
    pipes.push({
        x: canvas.width,
        top: top,
        bottom: top + gap,
        width: 40
    });
}

// 🚧 Draw Pipes
function drawPipes() {
    ctx.fillStyle = "green";

    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.x -= 1.5;

        // Top pipe
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);

        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height);

        // 💥 Collision
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
        ) {
            gameOver();
        }
    }

    pipes = pipes.filter(pipe => pipe.x > -50);
}

// 🏆 Score
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

// 💀 Game Over
function gameOver() {
    cancelAnimationFrame(animationId);
    gameStarted = false;

    document.body.innerHTML = `
        <h1>Game Over 😢</h1>
        <h2>Score: ${score}</h2>
        <button onclick="location.reload()">Restart</button>
    `;
}

// 🔁 Game Loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    drawBird();

    if (frame % 120 === 0) {
        createPipe();
    }

    drawPipes();
    drawScore();

    score++;
    frame++;

    animationId = requestAnimationFrame(draw);
}

// ▶ START GAME
playBtn.addEventListener("click", function () {
    startScreen.style.display = "none";
    canvas.style.display = "block";

    resetGame();
    gameStarted = true;

    draw();
});
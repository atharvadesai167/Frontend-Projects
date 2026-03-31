const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// 🐦 Bird (EASY SETTINGS)
let bird = {
    x: 50,
    y: 200,
    width: 20,
    height: 20,
    velocity: 0,
    gravity: 0.4,   // slower fall
    lift: -10       // smoother jump
};

// 🚧 Pipes (EASY SETTINGS)
let pipes = [];
let frame = 0;
let score = 0;
let gap = 180;      // bigger gap = easier

// 🎮 Controls (keyboard + mouse)
function flap() {
    bird.velocity = bird.lift;
}

document.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        flap();
    }
});

document.addEventListener("click", flap);

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
        pipe.x -= 1.5;   // slower pipes

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

    // 🧹 Remove old pipes (performance fix)
    pipes = pipes.filter(pipe => pipe.x > -50);
}

// 💀 Game Over (no lag)
function gameOver() {
    document.body.innerHTML = `
        <h1>Game Over 😢</h1>
        <h2>Score: ${score}</h2>
        <button onclick="location.reload()">Restart</button>
    `;
}

// 🏆 Score
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

// 🔁 Game Loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    drawBird();

    // Fewer pipes
    if (frame % 120 === 0) {
        createPipe();
    }

    drawPipes();
    drawScore();

    score++;
    frame++;

    requestAnimationFrame(draw);
}

draw();
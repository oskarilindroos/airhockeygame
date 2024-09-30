const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

// Connect to the WebSocket server
const socket = new WebSocket('ws://localhost:8080');

// Define the initial game state
let gameState = {
    puck: {
        x: 200,
        y: 400,
        vx: 0,
        vy: 0,
        radius: 15
    },
    paddles: [
        {
            x: 200,  // Player 1 paddle
            y: 700,
            vx: 0,
            vy: 0,
            radius: 20
        },
        {
            x: 200,  // Player 2 paddle
            y: 100,
            vx: 0,
            vy: 0,
            radius: 20
        }
    ],
    scores: {
        player1: 0,  // Player 1's score
        player2: 0   // Player 2's score
    }
};

// Handle incoming messages from the server
socket.onmessage = (event) => {
    gameState = JSON.parse(event.data);
    drawGame(gameState);

    const player1Score = gameState.scores.player1;
    const player2Score = gameState.scores.player2;

    const player1ScoreElement = document.getElementById('player1-score');
    const player2ScoreElement = document.getElementById('player2-score');

    if (player1ScoreElement && player2ScoreElement) {
        player1ScoreElement.innerText = 'Blue: ' + player1Score.toString();  // Convert to string
        player2ScoreElement.innerText = 'Red: ' + player2Score.toString();  // Convert to string
    }
    
};

canvas.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;

    const paddleData = {
        x: mouseX,
        y: mouseY
    };

    socket.send(JSON.stringify(paddleData));  // Send paddle position to server
});





// Draw the game state on the canvas
function drawGame(state: any) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the horizontal halfway line
    ctx.strokeStyle = 'gray'; // Set the color of the halfway line
    ctx.lineWidth = 2; // Set the line width
    ctx.beginPath(); // Start drawing path
    ctx.moveTo(0, canvas.height / 2); // Move to the left edge at the halfway point
    ctx.lineTo(canvas.width, canvas.height / 2); // Draw line to the right edge at the halfway point
    ctx.stroke(); // Apply the stroke to draw the line
    
    // Draw paddles
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(state.paddles[0].x, state.paddles[0].y, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(state.paddles[1].x, state.paddles[1].y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw puck
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(state.puck.x, state.puck.y, 15, 0, Math.PI * 2);
    ctx.fill();




}

// Initial draw
drawGame(gameState);

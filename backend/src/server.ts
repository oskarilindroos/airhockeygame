import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import { createServer } from 'http';

// Create an Express server
const app = express();
const server = createServer(app);
const PORT = 8080;

const wss = new WebSocketServer({ server });

const canvasWidth = 400;
const canvasHeight = 800;

// Define constants for game mechanics
const SCORING_AREA_HEIGHT = 10; // Height of the scoring area
const SCORING_AREA_WIDTH = canvasWidth * 0.25; // 25% of the canvas width

// Initial game state
const gameState = {
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
            y: 500,
            vx: 0,
            vy: 0,
            radius: 20
        },
        {
            x: 200,  // Player 2 paddle
            y: 200,
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
// Scoring areas
const topScoringArea = {
    x: (canvasWidth / 2) - (SCORING_AREA_WIDTH / 2),
    y: 0,
    width: SCORING_AREA_WIDTH,
    height: SCORING_AREA_HEIGHT
};

const bottomScoringArea = {
    x: (canvasWidth / 2) - (SCORING_AREA_WIDTH / 2),
    y: canvasHeight - SCORING_AREA_HEIGHT,
    width: SCORING_AREA_WIDTH,
    height: SCORING_AREA_HEIGHT
};

// Broadcasting function
function broadcastGameState() {
    const gameStateString = JSON.stringify(gameState);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(gameStateString);
        }
    });
}

let playerCount = 0;

const HALF_COURT_Y = canvasHeight / 2;

wss.on('connection', (ws) => {
    const playerId = playerCount % 2;  // Player 0 or 1
    playerCount++;

    resetPuck();

    ws.on('message', (data) => {
        const message = data.toString();
        const paddleData = JSON.parse(message);

        // Update the corresponding player's paddle
        if (playerId === 0) { // Player 1 (bottom paddle)
            // Restrict movement to below halfway line
            if (paddleData.y > HALF_COURT_Y) {
                gameState.paddles[playerId].x = paddleData.x; // Update x position
                gameState.paddles[playerId].y = paddleData.y; // Update y position
            } else {
                gameState.paddles[playerId].y = HALF_COURT_Y; // Restrict to halfway line
            }
        } else { // Player 2 (top paddle)
            // Restrict movement to above halfway line
            if (paddleData.y < HALF_COURT_Y) {
                gameState.paddles[playerId].x = paddleData.x; // Update x position
                gameState.paddles[playerId].y = paddleData.y; // Update y position
            } else {
                gameState.paddles[playerId].y = HALF_COURT_Y; // Restrict to halfway line
            }
        }

    });

    ws.on('close', () => {
        console.log(`Player ${playerId + 1} disconnected.`);
    });
});

function handlePaddleCollision(paddle: {x: number, y: number, radius: number}) {
    const distX = gameState.puck.x - paddle.x;
    const distY = gameState.puck.y - paddle.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < paddle.radius + gameState.puck.radius) {
        // Calculate the angle of collision
        const angle = Math.atan2(distY, distX);

        // Reflect the puck's velocity based on the collision
        gameState.puck.vx = Math.cos(angle) * maxSpeed;
        gameState.puck.vy = Math.sin(angle) * maxSpeed;
    }
}



const friction = 0.99;
const maxSpeed = 7;

function updatePhysics() {
    const puck = gameState.puck;

    // Update puck position
    puck.x += puck.vx;
    puck.y += puck.vy;

    

    // Apply friction
    puck.vx *= friction;
    puck.vy *= friction;

    // Cap speed
    if (Math.abs(puck.vx) > maxSpeed) {
        puck.vx = maxSpeed * Math.sign(puck.vx);
    }
    if (Math.abs(puck.vy) > maxSpeed) {
        puck.vy = maxSpeed * Math.sign(puck.vy);
    }

    // Wall collisions
    if (puck.x - puck.radius < 0 || puck.x + puck.radius > 400) { // Assuming canvas width is 400
        puck.vx = -puck.vx;
    }
    if (puck.y - puck.radius < 0 || puck.y + puck.radius > 800) { // Assuming canvas height is 800
        puck.vy = -puck.vy;
    }

    gameState.paddles.forEach(handlePaddleCollision);
    checkGoal();
    broadcastGameState();
}


let player1Score = 0;
let player2Score = 0;

function checkGoal() {
    const puck = gameState.puck;

    // Check if the puck is in the top scoring area (Player 2 scores)
    if (puck.y - puck.radius <= topScoringArea.height && 
        puck.x >= topScoringArea.x && 
        puck.x <= topScoringArea.x + topScoringArea.width) {
        gameState.scores.player2++;
        console.log('Player 2 scored!');
        resetPuck();
    }

    // Check if the puck is in the bottom scoring area (Player 1 scores)
    if (puck.y + puck.radius >= bottomScoringArea.y && 
        puck.x >= bottomScoringArea.x && 
        puck.x <= bottomScoringArea.x + bottomScoringArea.width) {
        gameState.scores.player1++;
        console.log('Player 1 scored!');
        resetPuck();
    }
}

// Reset puck position after scoring
function resetPuck() {
    gameState.puck.x = canvasWidth / 2;
    gameState.puck.y = canvasHeight / 2;
    gameState.puck.vx = 0;
    gameState.puck.vy = 0;
}

function gameLoop() {
    updatePhysics();   // Update puck and paddle physics
    checkGoal();  
    broadcastGameState();  // Send updated game state to clients
}

// Run the game loop 60 times per second
setInterval(gameLoop, 1000 / 60);







// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

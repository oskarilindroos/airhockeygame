import { io } from "socket.io-client";
import { drawCenterCircle, drawCenterLine, drawGoals } from "./graphics";
import { Player } from "./Player";
import { Puck } from "./Puck";
import "./style.css";
import { GameState } from "./types/GameState";

// Create the canvas element
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <h1 id="headerText">Welcome to AirHockey!</h1>
    <button id="createGame" class="dynamic-button">Create Game</button>
    <button id="joinGame" class="dynamic-button">Join Game</button>
  <p id="roomId"></p>
  <h4 id="scoreline"></h4>
  <canvas class="hidden" width="300px" height="600px" id="gameCanvas">
    <p>Your browser does not support the canvas element.</p>
  </canvas>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas")!;
const createGameButton = document.querySelector<HTMLButtonElement>("#createGame")!;
const joinGameButton = document.querySelector<HTMLButtonElement>("#joinGame")!;
const headerText = document.querySelector<HTMLTextAreaElement>("#headerText")!;
const roomIdElement = document.querySelector<HTMLDivElement>("#roomId")!;
const scorelineElement = document.querySelector<HTMLDivElement>("#scoreline")!;

const socket = io(import.meta.env.VITE_API_URL);

const ctx = canvas.getContext("2d")!;

let roomId = "";
let isPlayerOne = false;

// The initial game state
const player = new Player(canvas.width / 2, canvas.height - 40, 20, "green");
const opponent = new Player(canvas.width / 2, 40, 20, "red");
const puck = new Puck(canvas.width / 2, canvas.height / 2, 15, "black");
let gameOver: boolean = false;

let gameState: GameState = {
  puck: puck,
  players: [player],
};

let isMouseDown = false;

const startGame = () => {
  console.log("Starting game...");
  createGameButton.classList.add("hidden");
  joinGameButton.classList.add("hidden");
  headerText.classList.add("hidden");

  // Create the canvas
  canvas.classList.remove("hidden");

  // Display the room ID
  roomIdElement.textContent = `Room ID: ${roomId}`;

  createGameButton.classList.add("hidden");
  joinGameButton.classList.add("hidden");
};

const createGameRoom = async () => {
  console.log("Creating game room...");
  isPlayerOne = true;

  // Create a new game room
  socket.emit("create room");

  // Listen for the room created event
  socket.once("room created", (newRoomId) => {
    console.log(`Game room created with roomId: ${roomId}`);
    roomId = newRoomId;
    startGame();
  });
};

createGameButton.addEventListener("click", createGameRoom);

joinGameButton.addEventListener("click", () => {
  roomId = prompt("Enter the room ID") || "";

  if (!roomId) {
    return;
  }

  socket.emit("join room", roomId);

  socket.once("room not found", () => {
    alert("Room not found");
  });

  socket.once("room full", () => {
    alert("Room is full");
  });

  socket.once("room joined", () => {
    startGame();
  });
});

canvas.addEventListener("mousedown", () => {
  isMouseDown = true;
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

// NOTE:Touch events simulate mouse events
canvas.addEventListener("touchstart", () => {
  isMouseDown = true;
  canvas.dispatchEvent(new MouseEvent("mousedown"));
});

canvas.addEventListener("touchend", () => {
  isMouseDown = false;
  canvas.dispatchEvent(new MouseEvent("mouseup"));
});

canvas.addEventListener("touchmove", (event) => {
  player.handleTouchMove(event, canvas, isMouseDown);
});

canvas.addEventListener("mousemove", (event) => {
  player.handleMouseMove(event, canvas, isMouseDown);

  // Emit the player movement to the server
  socket.emit("player move", {
    roomId,
    playerId: socket.id,
    location: {
      x: isPlayerOne ? player.x : canvas.width - player.x,
      y: isPlayerOne ? player.y : canvas.height - player.y,
      xPrev: isPlayerOne ? player.xPrev : canvas.width - player.xPrev,
      yPrev: isPlayerOne ? player.yPrev : canvas.height - player.yPrev,
    },
  });
});

// Listen for when a user joins the room
socket.on("user joined", (userId) => {
  console.log(`User (${userId}) joined the room`);
});

// Listen for game state updates from the server
socket.on("gameState updated", (data) => {
  gameState = data;

  // Update the scoreline
  scorelineElement.textContent = `Player 1: ${gameState.players[0].score} | Player 2: ${gameState.players[1].score}`;

  puck.x = gameState.puck.x;
  puck.y = gameState.puck.y;

  gameState.players.forEach((player) => {
    if (player.id === socket.id) {
      return;
    }

    opponent.x = player.x;
    opponent.y = player.y;
  });
});

// Listen for game over event
socket.on("game over", (data) => {
  gameOver = true;
  alert(`Game over! Player ${data.players[0].score === 5 ? 1 : 2} wins!`);
  window.location.reload();
});

// Main game loop
const update = () => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGoals(canvas, ctx);
  drawCenterLine(canvas, ctx);
  drawCenterCircle(canvas, ctx);

  player.draw(ctx);

  ctx.save();

  // Flip the image when drawing from player 2's perspective
  if (!isPlayerOne) {
    ctx.translate(canvas.width, canvas.height);
    ctx.rotate(Math.PI);
  }

  puck.draw(ctx);
  opponent.draw(ctx);

  ctx.restore();

  requestAnimationFrame(update);
};

// Start the game loop
if (!gameOver) {
  update();
}
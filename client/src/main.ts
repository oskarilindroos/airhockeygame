import { io } from "socket.io-client";
import { drawCenterCircle, drawCenterLine, drawGoals } from "./graphics";
import { Player } from "./Player";
import { Puck } from "./Puck";
import "./style.css";
import { GameState } from "./types/GameState";

// Create the canvas element
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<button id="createGame">Create Game</button>
<button id="joinGame">Join Game</button>
<p id="roomId"></p>
<canvas class="hidden" width="300px" height="600px" id="gameCanvas">
  <p>Your browser does not support the canvas element.</p>
</canvas>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas")!;
const createGameButton =
  document.querySelector<HTMLButtonElement>("#createGame")!;
const joinGameButton = document.querySelector<HTMLButtonElement>("#joinGame")!;
const roomIdElement = document.querySelector<HTMLDivElement>("#roomId")!;

const socket = io(import.meta.env.VITE_API_URL);

const ctx = canvas.getContext("2d")!;

let roomId = "";

// The initial game state
const player = new Player(canvas.width / 2, canvas.height - 40, 20, "green");
const opponent = new Player(canvas.width / 2, 40, 20, "red");
const puck = new Puck(canvas.width / 2, canvas.height / 2, 15, "black");

let gameState: GameState = {
  puck: puck,
  players: [player],
};

let isMouseDown = false;

const startGame = () => {
  console.log("Starting game...");
  createGameButton.classList.add("hidden");
  joinGameButton.classList.add("hidden");

  // Create the canvas
  canvas.classList.remove("hidden");

  // Display the room ID
  roomIdElement.textContent = `Room ID: ${roomId}`;

  createGameButton.classList.add("hidden");
  joinGameButton.classList.add("hidden");
};

const createGameRoom = async () => {
  console.log("Creating game room...");

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
      x: player.x,
      y: player.y,
      xPrev: player.xPrev,
      yPrev: player.yPrev,
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

// Main game loop
const update = () => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGoals(canvas, ctx);
  drawCenterLine(canvas, ctx);
  drawCenterCircle(canvas, ctx);

  player.draw(ctx);
  opponent.draw(ctx);
  puck.draw(ctx);

  requestAnimationFrame(update);
};

// Start the game loop
update();

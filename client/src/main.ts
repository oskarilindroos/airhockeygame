import { io } from "socket.io-client";
import { createGame } from "./api/games";
import { drawCenterCircle, drawCenterLine, drawGoals } from "./graphics";
import { Player } from "./Player";
import { Puck } from "./Puck";
import "./style.css";

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

const player = new Player(canvas.width / 2, canvas.height - 40, 20, "green");
const opponent = new Player(canvas.width / 2, 40, 20, "red");
const puck = new Puck(canvas.width / 2, canvas.height / 2, 15, "black");

let roomId = "";

let isMouseDown = false;

const startGame = (roomId: string) => {
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

  roomId = await createGame();
  console.log(`Game room created with roomId: ${roomId}`);

  socket.emit("create room", roomId);

  startGame(roomId);
};

createGameButton.addEventListener("click", createGameRoom);

joinGameButton.addEventListener("click", () => {
  roomId = prompt("Enter the room ID") || "";
  console.log(roomId);

  if (!roomId) {
    return;
  }

  socket.emit("join room", roomId);

  socket.once("room not found", () => {
    alert("Room not found");
  });

  socket.once("room joined", () => {
    startGame(roomId);
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

  // Emit the player move event to the server
  socket.emit("player move", {
    roomId,
    x: player.x,
    y: player.y,
  });
});

// Main game loop
const update = () => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGoals(canvas, ctx);
  drawCenterLine(canvas, ctx);
  drawCenterCircle(canvas, ctx);

  // Checks if one player hits the puck
  if (puck.playerCollisionCheck(player)) {
    //Make sure no puck/player penetration happens
    puck.playerPenetrationResponse(player);
    //Add player velocity to puck
    puck.playerCollisionResponse(player);
  }

  // Check if opponent hits the puck
  //if (puck.playerCollisionCheck(opponent)) {
  //  //Make sure no puck/player penetration
  //  puck.playerPenetrationResponse(opponent);
  //  //Add player velocity to puck
  //  puck.playerCollisionResponse(opponent);
  //}

  //Calculate what position the puck should be in in the frame
  puck.calcPosition(canvas.width, canvas.height);

  // Draw the players at the new position<AAA<
  player.draw(ctx);
  opponent.draw(ctx);
  puck.draw(ctx);

  requestAnimationFrame(update);
};

// Listen for when a user joins the room
socket.on("user joined", (userId) => {
  console.log(`User (${userId}) joined the room`);
});

// Listen for player move events
socket.on("player move", (data) => {
  // Mirror the opponent's position
  // TODO: Should be done server side
  opponent.x = canvas.width - data.x;
  opponent.y = canvas.height - data.y;
});

// Start the game loop
update();

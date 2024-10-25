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

//const socket = new WebSocket("ws://localhost:8080");
//let socketConnected: boolean = false; //Makes sure we don't try to send messages before the connection is made. Every sending should check this!!

//Give data a label, so the reciever knows what kind of data it is
//const labelData = (label: String, data: any) => {
//  return {label, data};
//}

//socket.onopen = () => {
//  console.log("Connected to the server");
//  socket.send(JSON.stringify(labelData("radiusMatch", {player, opponent, puck})))
//  socketConnected = true;
//};
//
//socket.onmessage = (event) => {
//  const data = JSON.parse(event.data);
//
//  //Use data based on label
//  switch (data.label) {
//    case "opponent":
//      {
//        //opponent.x = data.data.x;
//        //opponent.y = data.data.y;
//        break;
//      }
//
//    case "puck":
//      {
//        puck.x = data.data.x;
//        puck.y = data.data.y;
//        break;
//      }
//
//    case "message":
//      {
//        console.log("Message from server:", data.data)
//        break;
//      }
//
//    default:
//      break;
//  }
//};
//
//socket.onclose = () => {
//  console.log("Disconnected from the server");
//};
//
//socket.onerror = (error) => {
//  console.error("Error:", error);
//};

const player = new Player(canvas.width / 2, canvas.height - 40, 20, "green");
const opponent = new Player(canvas.width / 2, 40, 20, "red");
const puck = new Puck(canvas.width / 2, canvas.height / 2, 15, "black");

let roomId = "";
let gameState: GameState = {};

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

  // Create a new game room
  socket.emit("create room");

  // Listen for the room created event
  socket.once("room created", (roomId) => {
    console.log(`Game room created with roomId: ${roomId}`);
    startGame(roomId);
  });
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

  socket.once("room full", () => {
    alert("Room is full");
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
    playerId: socket.id,
    location: { x: player.x, y: player.y },
  });
});

// Main game loop
const update = () => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGoals(canvas, ctx);
  drawCenterLine(canvas, ctx);
  drawCenterCircle(canvas, ctx);

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

// Listen for real-time game state updates
socket.on("gameState updated", (gameState) => {
  gameState = gameState;

  puck.x = gameState.puck.x;
  puck.y = gameState.puck.y;
});

// Listen for player move events
//socket.on("player move", (data) => {
//  // Mirror the opponent's position
//  // TODO: Should be done server side
//  opponent.x = canvas.width - data.x;
//  opponent.y = canvas.height - data.y;
//});

// Start the game loop
update();

import { drawCenterCircle, drawCenterLine, drawGoals } from "./graphics";
import { Player } from "./Player";
import { Puck } from "./Puck";
import "./style.css";

// Create the canvas element
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<canvas width="300px" height="600px" id="gameCanvas">
  <p>Your browser does not support the canvas element.</p>
</canvas>`;

const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas")!;
const ctx = canvas.getContext("2d")!;

const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
  console.log("Connected to the server");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  opponent.x = data.x;
  opponent.y = data.y;
  console.log("Message from server:", data);
};

socket.onclose = () => {
  console.log("Disconnected from the server");
};

socket.onerror = (error) => {
  console.error("Error:", error);
};

// Create the game objects
const player = new Player();
player.x = canvas.width / 2;
player.y = canvas.height - 40;
player.color = "green";
player.radius = 20;

const opponent = new Player();
opponent.x = canvas.width / 2;
opponent.y = 40;
opponent.color = "red";
opponent.radius = 20;

const puck = new Puck();
puck.x = canvas.width / 2;
puck.y = canvas.height / 2;
puck.color = "black";
puck.radius = 16;

let isMouseDown = false;

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
});

const renderGraphics = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGoals(canvas, ctx);
  drawCenterLine(canvas, ctx);
  drawCenterCircle(canvas, ctx);
  puck.draw(ctx);
  player.draw(ctx);
  opponent.draw(ctx);
};

// Main game loop
const update = () => {
  renderGraphics();

  puck.move();
  puck.handleWallCollision(canvas);
  puck.handlePlayerCollision(player);

  requestAnimationFrame(update);
};

// Start the game loop
update();

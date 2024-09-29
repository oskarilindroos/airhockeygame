import { Player } from "./Player";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<canvas width="300px" height="600px" id="gameCanvas"/>`;

const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas")!;
const ctx = canvas.getContext("2d")!;

// Instantiate a new player at the center of the canvas
const player = new Player(canvas.width / 2, canvas.height / 2, 24, "green");

let isMouseDown = false;

// Add event listeners to track mouse and touch actions
canvas.addEventListener("mousedown", () => {
  isMouseDown = true; // Set flag to true when mouse is pressed
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false; // Reset flag when mouse button is released
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
  event.preventDefault();
  if (!isMouseDown) return;

  canvas.dispatchEvent(
    new MouseEvent("mousemove", {
      clientX: event.touches[0].clientX,
      clientY: event.touches[0].clientY,
    }),
  );
});

canvas.addEventListener("mousemove", (event) => {
  if (!isMouseDown) return; // Only move player if mouse is held down

  const rect = canvas.getBoundingClientRect(); // Get canvas bounds
  const mouseX = event.clientX - rect.left; // Mouse X relative to the canvas
  const mouseY = event.clientY - rect.top; // Mouse Y relative to the canvas

  // Limit player to canvas bounds
  // TODO: The limit should actually be the center line, not the whole canvas
  if (mouseX - player.radius >= 0 && mouseX + player.radius <= canvas.width) {
    player.x = mouseX;
  }

  if (mouseY - player.radius >= 0 && mouseY + player.radius <= canvas.height) {
    player.y = mouseY;
  }
});

// Main draw loop
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player at the new position
  player.draw(ctx);

  // Continue the animation loop
  requestAnimationFrame(draw);
}

// Start the game loop
draw();

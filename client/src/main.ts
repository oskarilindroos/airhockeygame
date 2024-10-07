import { Player } from "./Player";
import { Puck } from "./Puck";
import "./style.css";


// Create the canvas element
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<canvas width="300px" height="600px" id="gameCanvas">
  <p>Your browser does not support the canvas element.</p>
</canvas>
`;

const mouseXDisplay = document.getElementById("mouseX");
const mouseYDisplay = document.getElementById("mouseY");

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

const player = new Player(canvas.width / 2, canvas.height - 40, 20, "green");
const opponent = new Player(canvas.width / 2, 40, 20, "red");
const puck = new Puck(canvas.width / 2, canvas.height/2 + 50, 15, "black", 0, 0);

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
  event.preventDefault(); // Prevents scrolling the page
  if (!isMouseDown) return;

  canvas.dispatchEvent(
    new MouseEvent("mousemove", {
      clientX: event.touches[0].clientX,
      clientY: event.touches[0].clientY,
    }),
  );
});

canvas.addEventListener("mousemove", (event) => {
  //if (!isMouseDown) return; // Only move player if mouse is held down

  const rect = canvas.getBoundingClientRect(); // Get canvas bounds
  const mouseX = event.clientX - rect.left; // Mouse X relative to the canvas
  const mouseY = event.clientY - rect.top; // Mouse Y relative to the canvas

  // console.log("mouseX", mouseX);
  // console.log("mouseY", mouseY);
  // console.log("player.x", player.x);
  // console.log("player.y", player.y);

  // Limits the player movement to the left and right boundaries of the canvas
  if (mouseX >= player.radius && mouseX + player.radius <= canvas.width) {
    player.x = mouseX;
  } else if (mouseX < player.radius) {
    // Keep the player from going off the left edge
    player.x = player.radius;
  } else {
    // Prevent the player from going off the right edge
    player.x = canvas.width - player.radius;
  }

  // Limits the player movement to the bottom half of the canvas
  if (
    mouseY >= canvas.height / 2 + player.radius &&
    mouseY + player.radius <= canvas.height
  ) {
    player.y = mouseY;
  } else if (mouseY < canvas.height / 2 + player.radius) {
    // Keep the player at the top of the bottom half
    player.y = canvas.height / 2 + player.radius;
  } else {
    // Prevent player from going below the canvas bottom
    player.y = canvas.height - player.radius;
  }
});

// TODO: Refactor these to separate file
// Or the whole playing field could just be a texture that is loaded on top of the canvas
const drawCenterLine = () => {
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
};
const drawCenterCircle = () => {
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
  ctx.stroke();
};
const drawGoals = () => {
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 0, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();
};

// Main game loop
const update = () => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  puck.update(canvas, [player, opponent])
  player.xSpeed = (player.x - player.previousPos.x);
  player.ySpeed = (player.y - player.previousPos.y);


  if (!(mouseXDisplay == null || mouseYDisplay == null)){
    mouseXDisplay.innerText = `${player.xSpeed}`;
    mouseYDisplay.innerText = `${player.ySpeed}`;
  }

  player.previousPos = {x: player.x, y: player.y};



  drawGoals();
  drawCenterLine();
  drawCenterCircle();

  // Draw the players at the new position
  player.draw(ctx);
  opponent.draw(ctx);
  puck.draw(ctx)

  requestAnimationFrame(update);
};

// Start the game loop
update();

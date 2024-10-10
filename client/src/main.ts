import { drawCenterCircle, drawCenterLine, drawGoals } from "./graphics";
import { Player } from "./Player";
import { Puck } from "./Puck"
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
  //console.log("Message from server:", data);
};

socket.onclose = () => {
  console.log("Disconnected from the server");
};

socket.onerror = (error) => {
  console.error("Error:", error);
};

const player = new Player(canvas.width / 2, canvas.height - 40, 20, "green");
const opponent = new Player(canvas.width / 2, 40, 20, "red");

const puck = new Puck(canvas.width / 2, canvas.height / 2 + 50, 15, "black");

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
  if (!isMouseDown) return; // Only move player if mouse is held down

  const rect = canvas.getBoundingClientRect(); // Get canvas bounds
  const mouseX = event.clientX - rect.left; // Mouse X relative to the canvas
  const mouseY = event.clientY - rect.top; // Mouse Y relative to the canvas

  // console.log("mouseX", mouseX);
  // console.log("mouseY", mouseY);
  // console.log("player.x", player.x);
  // console.log("player.y", player.y);

  // Limits the player movement to the left and right boundaries of the canvas
  if (mouseX >= player.radius && mouseX + player.radius <= canvas.width) {
    player.xOld = player.x;
    player.x = mouseX;
  } else if (mouseX < player.radius) {
    // Keep the player from going off the left edge
    player.xOld = player.x;
    player.x = player.radius;
  } else {
    // Prevent the player from going off the right edge
    player.xOld = player.x;
    player.x = canvas.width - player.radius;
  }

  // Limits the player movement to the bottom half of the canvas
  if (
    mouseY >= canvas.height / 2 + player.radius &&
    mouseY + player.radius <= canvas.height
  ) {
    player.yOld = player.y;
    player.y = mouseY;
  } else if (mouseY < canvas.height / 2 + player.radius) {
    // Keep the player at the top of the bottom half
    player.yOld = player.y;
    player.y = canvas.height / 2 + player.radius;
  } else {
    // Prevent player from going below the canvas bottom
    player.yOld = player.y;
    player.y = canvas.height - player.radius;
  }
});

// Main game loop
const update = () => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGoals(canvas, ctx);
  drawCenterLine(canvas, ctx);
  drawCenterCircle(canvas, ctx);

  // Checks if one player hits the puck
  if (puck.hitCheck(player)) {
    //Make sure no penetration happens
    puck.penetration_resolution_player(player);
    //Add player velocity to puck
    puck.collision_response_player(player);
  }

  // Check if opponent hits the puck
  //if (puck.hitCheck(opponent)) {
  //  puck.pen_res_bb(opponent);
  //  puck.coll_res_bb(opponent);
  //}

  //Calculate what position the puck should be in in the frame
  puck.calcPosition(canvas.width, canvas.height);

  // Draw the players at the new position<AAA<
  player.draw(ctx);
  opponent.draw(ctx);
  puck.draw(ctx);

  requestAnimationFrame(update);
};

// Start the game loop
update();

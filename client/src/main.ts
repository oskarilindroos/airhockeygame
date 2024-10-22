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
let socketConnected: boolean = false; //Makes sure we don't try to send messages before the connection is made. Every sending should check this!!

//Give data a label, so the reciever knows what kind of data it is
const labelData = (label: String, data: any) => {
  return {label, data};
}

socket.onopen = () => {
  console.log("Connected to the server");
  socketConnected = true;
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  //Use data based on label
  switch (data.label) {
    case "opponent":
      {
        //opponent.x = data.data.x;
        //opponent.y = data.data.y;
        break;
      }

    case "puck":
      {
        puck.x = data.data.x;
        puck.y = data.data.y;
        break;
      }

    case "message":
      {
        console.log("Message from server:", data.data)
        break;
      }

    default:
      break;
  }
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
  player.handleTouchMove(event, canvas, isMouseDown);
});

canvas.addEventListener("mousemove", (event) => {
  player.handleMouseMove(event, canvas, isMouseDown);
});

// Main game loop
const update = () => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGoals(canvas, ctx);
  drawCenterLine(canvas, ctx);
  drawCenterCircle(canvas, ctx);

  // Checks if one player hits the puck
  //if (puck.playerCollisionCheck(player)) {
  //  //Make sure no puck/player penetration happens
  //  puck.playerPenetrationResponse(player);
  //  //Add player velocity to puck
  //  puck.playerCollisionResponse(player);
  //}

  // Check if opponent hits the puck
  //if (puck.hitCheck(opponent)) {
  //  puck.penetration_resolution_player(opponent);
  //  puck.collision_response_player(opponent);
  //}

  //Calculate what position the puck should be in in the frame
  //puck.calcPosition(canvas.width, canvas.height);

  //send playerdata to the server
  if (socketConnected) {
    socket.send(JSON.stringify(labelData("player", player)))
  }

  // Draw the players at the new position<AAA<
  player.draw(ctx);
  opponent.draw(ctx);
  puck.draw(ctx);

  requestAnimationFrame(update);
};

// Start the game loop
update();

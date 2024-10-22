import { WebSocketServer } from "ws";
import { Puck } from "./Puck"

const canvasSize = { width: 300, height: 600 };
const wss = new WebSocketServer({ port: 8080 });

const generateRandomPositionWithinCanvas = () => {
  const x = Math.floor(Math.random() * canvasSize.width);
  const y = Math.floor((Math.random() * canvasSize.height) / 2);
  return {x, y };
};

const labelData = (label: String, data: any) => {
  return {label, data};
}

const puck = new Puck(canvasSize.width / 2, canvasSize.height / 2 + 50, 15, "black");

wss.on("connection", (ws) => {
  // Send a random position to the client every at around 60 times per second
  setInterval(() => {
    const position = generateRandomPositionWithinCanvas();
    ws.send(JSON.stringify(labelData("opponent", position)));

    //Calculate what position the puck should be in in the frame
    puck.calcPosition(canvasSize.width, canvasSize.height);
    ws.send(JSON.stringify(labelData("puck", puck)));
  }, 16.6);

  //Recieves a message from the client
  ws.on('message', (message) => {
    try {
      // Convert the message from Buffer to string and parse it as JSON
      const data = JSON.parse(message.toString());

      console.log('Received from client: ', data);

      // Checks if one player hits the puck
      if (puck.playerCollisionCheck(data)) {
        //Make sure no puck/player penetration happens
        puck.playerPenetrationResponse(data);
        //Add player velocity to puck
        puck.playerCollisionResponse(data);
      }

    } catch (err) {
      console.log('Error parsing message:', err);
    }
  });

});



console.log("WebSocket server started at ws://localhost:8080");

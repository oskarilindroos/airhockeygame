import { WebSocketServer } from "ws";
import { Puck } from "./Puck"
import { Player } from "./Player"

const canvasSize = { width: 300, height: 600 };
const wss = new WebSocketServer({ port: 8080 });

const generateRandomPositionWithinCanvas = () => {
  const x = Math.floor(Math.random() * canvasSize.width);
  const y = Math.floor((Math.random() * canvasSize.height) / 2);
  return { x, y };
};

//Give data a label, so the reciever knows what kind of data it is
const labelData = (label: String, data: any) => {
  return { label, data };
}

const puck = new Puck(canvasSize.width / 2, canvasSize.height / 2 + 50, 15, "black");
const playerOne = new Player(canvasSize.width / 2, canvasSize.height - 40, 20, "green");
const PlayerTwo = new Player(canvasSize.width / 2, 40, 20, "red");

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
      //Convert the message from Buffer to string and parse it as JSON
      const data = JSON.parse(message.toString());

      //Use data based on label
      switch (data.label) {
        case "player":
          {
            playerOne.setLocation(data.data)
            // Checks if player hits the puck
            if (puck.playerCollisionCheck(playerOne)) {
              //Make sure no puck/player penetration happens
              puck.playerPenetrationResponse(playerOne);
              //Add player velocity to puck
              puck.playerCollisionResponse(playerOne);
            }
            break;
          }

        case "message":
          {
            console.log("Message from client:", data.data)
            break;
          }

        default:
          break;
      }

    } catch (err) {
      console.log('Error parsing message:', err);
    }
  });

});



console.log("WebSocket server started at ws://localhost:8080");

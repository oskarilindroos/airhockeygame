import { WebSocketServer } from "ws";

const canvasSize = { width: 300, height: 600 };
const wss = new WebSocketServer({ port: 8080 });

const generateRandomPositionWithinCanvas = () => {
  const x = Math.floor(Math.random() * canvasSize.width);
  const y = Math.floor((Math.random() * canvasSize.height) / 2);
  return { x, y };
};

wss.on("connection", (ws) => {
  // Send a random position to the client every at around 60 times per second
  setInterval(() => {
    const position = generateRandomPositionWithinCanvas();
    ws.send(JSON.stringify(position));
  }, 16.6);

  //Recieves a message from the client
  ws.on('message', (message) => {
    try {
        // Convert the message from Buffer to string and parse it as JSON
        const data = JSON.parse(message.toString());
        
        // Check if it's an array
        if (Array.isArray(data)) {
            console.log('Received an array from client:', data);
        } else {
            console.log('Received from client: ', data);
        }
    } catch (err) {
        console.log('Error parsing message:', err);
    }
});

});



console.log("WebSocket server started at ws://localhost:8080");

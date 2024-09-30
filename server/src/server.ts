import { WebSocketServer } from "ws";

const canvasSize = { width: 300, height: 600 };
const wss = new WebSocketServer({ port: 8080 });

const generateRandomPositionWithinCanvas = () => {
  const x = Math.floor(Math.random() * canvasSize.width);
  const y = Math.floor((Math.random() * canvasSize.height) / 2);
  return { x, y };
};

wss.on("connection", (ws) => {
  // Send a random position to the client every 100ms
  setInterval(() => {
    const position = generateRandomPositionWithinCanvas();
    ws.send(JSON.stringify(position));
  }, 100);
});

console.log("WebSocket server started at ws://localhost:8080");

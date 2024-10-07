import { server as WebSocketServer, connection } from 'websocket';
import * as http from 'http';

const port = 8080;

// Create an HTTP server
const server = http.createServer((request, response) => {
    console.log(`${new Date()} Received request for ${request.url}`);
    response.writeHead(404);
});

// Listen on the specified port
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// Create a WebSocket server on top of the HTTP server
const wss = new WebSocketServer({
    httpServer: server
});

wss.on('request', (request) => {
    const connection: connection = request.accept(null, request.origin);
    console.log('Connection accepted.');

    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            const data = JSON.parse(message.utf8Data);
            const x = data.x;
            const y = data.y;
            connection.sendUTF(`X: ${x}, Y: ${y}`);
        }
    });

    connection.on('close', (reasonCode, description) => {
        console.log('Client has disconnected.');
    });
});
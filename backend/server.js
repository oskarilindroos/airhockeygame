"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("websocket");
const http = __importStar(require("http"));
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
const wss = new websocket_1.server({
    httpServer: server
});
wss.on('request', (request) => {
    const connection = request.accept(null, request.origin);
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

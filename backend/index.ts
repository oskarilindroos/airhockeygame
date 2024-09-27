const http = require("http");
const WebSocketServer = require("websocket").server;
let connection = null;

const httpServer = http.createServer((req, res) => {
    console.log("Request received");
});

const websocket = new WebSocketServer({
    "httpServer": httpServer
})

httpServer.listen(8080, () =>{
    console.log("Server listening");
})

websocket.on("request", request=> {
    connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("Websocket open"));
    connection.on("close", () => console.log("Websocket closed"));
    connection.on("message", message => {
        console.log(`Received message "${message.utf8Data}", ${new Date(Date.now()).toLocaleTimeString()}`);
    });

    setInterval(() => {
        connection.send("Hello from server");
    }, 2000)
});
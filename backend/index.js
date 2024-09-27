var http = require("http");
var WebSocketServer = require("websocket").server;
var connection = null;
var httpServer = http.createServer(function (req, res) {
    console.log("Request received");
});
var websocket = new WebSocketServer({
    "httpServer": httpServer
});
httpServer.listen(8080, function () {
    console.log("Server listening");
});
websocket.on("request", function (request) {
    connection = request.accept(null, request.origin);
    connection.on("open", function () { return console.log("Websocket open"); });
    connection.on("close", function () { return console.log("Websocket closed"); });
    connection.on("message", function (message) {
        console.log("Received message \"".concat(message.utf8Data, "\", ").concat(new Date(Date.now()).toLocaleTimeString()));
    });
    setInterval(function () {
        connection.send("Hello from server");
    }, 2000);
});

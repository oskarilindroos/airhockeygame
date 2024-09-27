var http = require("http");
var httpServer = http.createServer(function (req, res) {
    console.log("Request received");
});
httpServer.listen(8080, function () {
    console.log("Server listening");
});

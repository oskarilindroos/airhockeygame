const http = require("http");

const httpServer = http.createServer((req, res) => {
    console.log("Request received");
});

httpServer.listen(8080, () =>{
    console.log("Server listening");
})
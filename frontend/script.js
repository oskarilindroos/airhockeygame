var Paddle = /** @class */ (function () {
    function Paddle(xPos, yPos, radius, color) {
        this.color = color;
        this.radius = radius;
        this.xPos = xPos;
        this.yPos = yPos;
    }
    Paddle.prototype.draw = function (ctx) {
        if (!ctx) {
            return;
        }
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    };
    return Paddle;
}());
var canvas = document.getElementById("gameWindow");
var ctx = canvas.getContext("2d");
var playAreaWidth = 200;
var playAreaHeight = 400;
var frameRate = 60;
var clearScreen = function (ctx) {
    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, playAreaWidth, playAreaHeight);
};
canvas.width = playAreaWidth;
canvas.height = playAreaHeight;
var myPaddle = new Paddle(100, 100, 20, "black");
setInterval(function () {
    clearScreen(ctx);
    myPaddle.draw(ctx);
}, 1000 / frameRate);

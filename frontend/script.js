var Paddle = /** @class */ (function () {
    function Paddle(xPos, yPos, radius, color) {
        this.color = color;
        this.radius = radius;
        this.xPos = xPos;
        this.yPos = yPos;
    }
    Paddle.prototype.draw = function (myCtx) {
        if (!myCtx) {
            return;
        }
        myCtx.beginPath();
        myCtx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
        myCtx.fillStyle = this.color;
        myCtx.fill();
    };
    return Paddle;
}());
var canvas = document.getElementById("gameWindow");
var ctx = canvas.getContext("2d");
var playAreaWidth = 200;
var playAreaHeight = 400;
canvas.width = playAreaWidth;
canvas.height = playAreaHeight;
var myPaddle = new Paddle(100, 100, 20, "black");
myPaddle.draw(ctx);

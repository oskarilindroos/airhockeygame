class Paddle {
    color: string;
    radius: number;
    xPos: number;
    yPos: number;

    constructor(xPos: number, yPos: number, radius: number, color: string ) {
        this.color = color;
        this.radius = radius;
        this.xPos = xPos;
        this.yPos = yPos;
    }

    draw(myCtx: CanvasRenderingContext2D | null): void {

        if (!myCtx){
            return
        }

        myCtx.beginPath();
        myCtx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
        myCtx.fillStyle = this.color;
        myCtx.fill();
    }
}

const canvas = document.getElementById("gameWindow") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const playAreaWidth = 200;
const playAreaHeight = 400;

canvas.width = playAreaWidth;
canvas.height = playAreaHeight;

const myPaddle = new Paddle(100, 100, 20, "black");
myPaddle.draw(ctx);

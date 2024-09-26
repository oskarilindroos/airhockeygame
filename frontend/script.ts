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

    draw(ctx: CanvasRenderingContext2D | null): void {

        if(!ctx){
            return
        }

        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

const canvas = document.getElementById("gameWindow") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const playAreaWidth = 200;
const playAreaHeight = 400;

const frameRate = 60;

const clearScreen = (ctx: CanvasRenderingContext2D | null) =>{
    ctx?.clearRect(0, 0, playAreaWidth, playAreaHeight);
}

canvas.width = playAreaWidth;
canvas.height = playAreaHeight;

const myPaddle = new Paddle(100, 100, 20, "black");

setInterval(() => {
    clearScreen(ctx);
    myPaddle.draw(ctx);
}, 1000 / frameRate)

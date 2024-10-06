export class GameObject {

        constructor(
          public x: number,
          public y: number,
          public radius: number,
          public color: string,
          public xSpeed:number = 0,
          public ySpeed:number = 0
        ) {}

        draw(ctx: CanvasRenderingContext2D) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.closePath();
        }

        distance(other: GameObject){
          const xDifference = this.x - other.x;
          const yDifference = this.y - other.y;
          return Math.sqrt(Math.pow(xDifference, 2) + Math.pow(yDifference, 2));
        }
}
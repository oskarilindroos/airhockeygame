import { Vector } from "./Vector";

export class Player {
  public xOld: number = 0;
  public yOld: number = 0;

  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public color: string,
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  velocity(){
    return new Vector(this.x - this.xOld, this.y - this.yOld);
  }
}

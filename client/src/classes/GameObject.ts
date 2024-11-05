export class GameObject {
    constructor(
        public x: number,
        public y: number,
        public radius: number,
        public color: string,
      ) {}
    
      /**
       * Draws the GameObject to it's correct x and y location
       * @param ctx 
       */
      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
}
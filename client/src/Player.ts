export class Player {
  public speedX: number = 0;
  public speedY: number = 0;
  private lastX: number;
  private lastY: number;

  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public color: string
  ) {
    // Store the initial position for speed calculations
    this.lastX = x;
    this.lastY = y;
  }

  // Method to draw the player on the canvas
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  // Method to update the player's speed based on movement
  updateSpeed() {
    // Calculate speed based on the change in position
    this.speedX = this.x - this.lastX;
    this.speedY = this.y - this.lastY;

    // Update the last position
    this.lastX = this.x;
    this.lastY = this.y;
  }

  // Method to get the player's total speed (magnitude)
  getSpeed(): number {
    return Math.sqrt(this.speedX * this.speedY + this.speedY * this.speedY);
  }
}

import { Player } from "./Player";

export class Ball {
  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public speedX: number = 0,  // Start stationary
    public speedY: number = 0,  // Start stationary
    public color: string
  ) {}

  // Draw the ball
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  // Update ball's position
  update(canvas: HTMLCanvasElement) {
    if (this.speedX !== 0 || this.speedY !== 0) {
      this.x += this.speedX;
      this.y += this.speedY;

      // Boundary checks for left and right walls
    if (this.x - this.radius < 0) {
        this.x = this.radius; // Keep it at the left edge
        this.speedX = -this.speedX; // Reverse horizontal direction
    }
    if (this.x + this.radius > canvas.width) {
        this.x = canvas.width - this.radius; // Keep it at the right edge
        this.speedX = -this.speedX; // Reverse horizontal direction
    }

    // Boundary checks for top and bottom walls
    if (this.y - this.radius < 0) {
        this.y = this.radius; // Keep it at the top edge
        this.speedY = -this.speedY; // Reverse vertical direction
    }
    if (this.y + this.radius > canvas.height) {
        this.y = canvas.height - this.radius; // Keep it at the bottom edge
        this.speedY = -this.speedY; // Reverse vertical direction
    }

      // Ball bounces off walls
    if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
        this.speedX = -this.speedX;
    }
    if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
        this.speedY = -this.speedY;
    }

      // Simulate friction
      this.speedX *= 0.995;
      this.speedY *= 0.995;

      // Stop the ball if its speed gets too low
      if (Math.abs(this.speedX) < 0.1) this.speedX = 0;
      if (Math.abs(this.speedY) < 0.1) this.speedY = 0;
    }
  }

  // Check for collision and kick the ball
  checkCollision(player: Player) {
    const distX = this.x - player.x;
    const distY = this.y - player.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < this.radius + player.radius) {
      // Determine the angle of collision
      const angle = Math.atan2(distY, distX);

      if(player.speedX === 0 && player.speedY === 0) {
        this.speedX = -this.speedX;
        this.speedY = -this.speedY;
      } else {

        // Kick the ball using the player's velocity
        this.speedX = player.speedX + Math.cos(angle) * player.speedX / 2;  // Adjust speed multiplier
        this.speedY = player.speedY + Math.sin(angle) * player.speedY / 2;  // Adjust speed multiplier
      }

      // Prevent the player from overlapping with the ball by adjusting positions
      const overlap = this.radius + player.radius - distance;
      this.x += Math.cos(angle) * overlap;
      this.y += Math.sin(angle) * overlap;

      return true;
    }
    return false;
  }
}

import { Player } from "./Player"; // Assuming Player class is imported

export class Puck {
  x: number;
  y: number;
  radius: number;
  dx: number; // Velocity along x-axis
  dy: number; // Velocity along y-axis
  speed: number; // Speed factor
  friction: number; // Friction factor
  maxSpeed: number; // Maximum speed to cap

  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = 0;
    this.dy = 0;
    this.speed = 3;
    this.friction = 0.998; // A value slightly below 1 reduces speed gradually
    this.maxSpeed = 5; // Limit the maximum speed to 10 units per frame
  }

  // Draw the puck on the canvas
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  }

  // Update puck position and handle collisions with canvas boundaries
  update(canvas: HTMLCanvasElement) {
    // Apply friction
    this.dx *= this.friction;
    this.dy *= this.friction;

    // Update puck position based on current velocity
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    // Cap the speed of the puck to avoid excessive velocity
    if (Math.abs(this.dx) > this.maxSpeed) {
      this.dx = this.maxSpeed * Math.sign(this.dx);
    }
    if (Math.abs(this.dy) > this.maxSpeed) {
      this.dy = this.maxSpeed * Math.sign(this.dy);
    }

    // Check for collisions with canvas boundaries and reverse direction
    if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
      this.dx = -this.dx; // Reverse x velocity (horizontal bounce)
    }
    if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
      this.dy = -this.dy; // Reverse y velocity (vertical bounce)
    }
  }

  // Collision detection and response with a player
  checkCollisionWithPlayer(player: Player) {
    const distX = this.x - player.x;
    const distY = this.y - player.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < this.radius + player.radius) {
      // Reverse the puck's direction
      this.dx = -this.dx;
      this.dy = -this.dy;

      // Optional: Add some variation based on where it hit the player
      const angle = Math.atan2(distY, distX); // Angle between puck and player

      // Adjust puck's velocity based on hit angle
      this.dx += Math.cos(angle) * 1.5; // 1.5 is a factor to add some deflection
      this.dy += Math.sin(angle) * 1.5;

      // Make sure the speed stays within limits
      const speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      if (speed > this.maxSpeed) {
        const scalingFactor = this.maxSpeed / speed;
        this.dx *= scalingFactor;
        this.dy *= scalingFactor;
      }
    }
  }
}

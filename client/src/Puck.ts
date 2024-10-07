import { Circle } from "./Circle";
import { Player } from "./Player";

export class Puck extends Circle {
  public vx = 0;
  public vy = 0;
  private friction = 0.99;
  private maxSpeed = 20;
  private mass = 1;

  move() {
    // Move puck
    this.x += this.vx;
    this.y += this.vy;

    // Apply friction
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Stop puck if it's moving very slow
    if (Math.abs(this.vx) < 0.1) {
      this.vx = 0;
    }
    if (Math.abs(this.vy) < 0.1) {
      this.vy = 0;
    }

    // Limit speed
    if (this.vx > this.maxSpeed) {
      this.vx = this.maxSpeed;
    } else if (this.vx < -this.maxSpeed) {
      this.vx = -this.maxSpeed;
    }

    if (this.vy > this.maxSpeed) {
      this.vy = this.maxSpeed;
    } else if (this.vy < -this.maxSpeed) {
      this.vy = -this.maxSpeed;
    }
  }

  handleWallCollision(canvas: HTMLCanvasElement) {
    // Check collision with top and bottom walls
    if (this.y - this.radius <= 0) {
      this.y = this.radius; // Reset position to inside the canvas
      this.vy *= -1; // Reverse the velocity
    } else if (this.y + this.radius >= canvas.height) {
      this.y = canvas.height - this.radius; // Reset position to inside the canvas
      this.vy *= -1; // Reverse the velocity
    }

    // Check collision with left and right walls
    if (this.x - this.radius <= 0) {
      this.x = this.radius; // Reset position to inside the canvas
      this.vx *= -1; // Reverse the velocity
    } else if (this.x + this.radius >= canvas.width) {
      this.x = canvas.width - this.radius; // Reset position to inside the canvas
      this.vx *= -1; // Reverse the velocity
    }
  }

  handlePlayerCollision(player: Player) {
    // Calculate the distance between the puck and the player
    let distanceX = this.x - player.x;
    let distanceY = this.y - player.y;
    let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    let addedRadius = this.radius + player.radius; // Sum of puck and player radii

    // Check if the puck and player are overlapping
    if (distance < addedRadius) {
      // Calculate the collision angle, sine, and cosine
      let angle = Math.atan2(distanceY, distanceX);
      let sin = Math.sin(angle);
      let cos = Math.cos(angle);

      // Rotate player's position
      let pos0 = { x: 0, y: 0 };
      // Rotate puck's position
      let pos1 = this.rotate(distanceX, distanceY, sin, cos, true);

      // Rotate player's velocity
      let vel0 = this.rotate(player.vx, player.vy, sin, cos, true);
      // Rotate puck's velocity
      let vel1 = this.rotate(this.vx, this.vy, sin, cos, true);

      // Collision reaction - calculate the total velocity difference in the x direction
      let velocityXTotal = vel0.x - vel1.x;

      // Update velocities based on an elastic collision formula
      vel0.x =
        ((player.mass - this.mass) * vel0.x + 2 * this.mass * vel1.x) /
        (player.mass + this.mass);
      vel1.x = velocityXTotal + vel0.x;

      // Prevent objects from getting stuck together by resolving overlap
      let absV = Math.abs(vel0.x) + Math.abs(vel1.x);
      let overlap = player.radius + this.radius - Math.abs(pos0.x - pos1.x);

      // Update positions to account for overlap
      pos0.x += (vel0.x / absV) * overlap;
      pos1.x += (vel1.x / absV) * overlap;

      // Rotate positions back to the original coordinate system
      let pos0F = this.rotate(pos0.x, pos0.y, sin, cos, false);
      let pos1F = this.rotate(pos1.x, pos1.y, sin, cos, false);

      // Adjust positions on the screen
      this.x = player.x + pos1F.x;
      this.y = player.y + pos1F.y;
      player.x = player.x + pos0F.x;
      player.y = player.y + pos0F.y;

      // Rotate velocities back to the original coordinate system
      // let vel0F = this.rotate(vel0.x, vel0.y, sin, cos, false);
      let vel1F = this.rotate(vel1.x, vel1.y, sin, cos, false);

      // Update the velocities of the player and puck
      // player.vx = vel0F.x;
      // player.vy = vel0F.y;
      this.vx = vel1F.x;
      this.vy = vel1F.y;
    }
  }

  private rotate(
    x: number,
    y: number,
    sin: number,
    cos: number,
    reverse: boolean,
  ) {
    return reverse
      ? { x: x * cos + y * sin, y: y * cos - x * sin } // Reverse rotation (back to original space)
      : { x: x * cos - y * sin, y: y * cos + x * sin }; // Normal rotation
  }
}

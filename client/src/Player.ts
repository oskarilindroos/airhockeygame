import { Circle } from "./Circle";

export class Player extends Circle {
  public vx = 0;
  public vy = 0;
  public mass = 50;

  handleMouseMove(
    event: MouseEvent,
    canvas: HTMLCanvasElement,
    isMouseDown: boolean,
  ) {
    if (!isMouseDown) {
      this.vx = 0;
      this.vy = 0;
      return;
    }

    const rect = canvas.getBoundingClientRect(); // Get canvas bounds
    const mouseX = event.clientX - rect.left; // Mouse X relative to the canvas
    const mouseY = event.clientY - rect.top; // Mouse Y relative to the canvas

    // Calculate velocity based on the difference between the new mouse position and the player's current position
    this.vx = mouseX - this.x;
    this.vy = mouseY - this.y;

    // Limit player position to inside the canvas and below the center line
    this.x = Math.min(
      Math.max(this.radius, mouseX),
      canvas.width - this.radius,
    );
    this.y = Math.min(
      Math.max(canvas.height / 2 + this.radius, mouseY),
      canvas.height - this.radius,
    );
  }

  handleTouchMove(
    event: TouchEvent,
    canvas: HTMLCanvasElement,
    isMouseDown: boolean,
  ) {
    event.preventDefault(); // Prevents scrolling the page

    if (!isMouseDown) {
      this.vx = 0;
      this.vy = 0;
      return;
    }

    canvas.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY,
      }),
    );
  }
}

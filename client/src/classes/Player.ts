import { GameObject } from "./GameObject";
import { Vector } from "./Vector";

const CLICK_ZONE = 10;

export class Player extends GameObject {
  //x and y from previous frame. Used for calculating velocity
  public xPrev: number = 0;
  public yPrev: number = 0;

  public id: string = "";

  private clickRadius = this.radius + CLICK_ZONE;
  private mouseOffset = new Vector(0,0);


  handleMouseClick(
    event: MouseEvent,
    canvas: HTMLCanvasElement,
  ){
    const rect = canvas.getBoundingClientRect(); // Get canvas bounds
    const mouseX = event.clientX - rect.left; // Mouse X relative to the canvas
    const mouseY = event.clientY - rect.top; // Mouse Y relative to the canvas

    const mousePosition = new Vector(mouseX, mouseY);
    this.mouseOffset = mousePosition.subtr(new Vector(this.x, this.y));

    return this.mouseOffset.mag() <= this.clickRadius;
  }

  handleMouseMove(
    event: MouseEvent,
    canvas: HTMLCanvasElement,
    isMouseDown: boolean,
  ) {
    if (!isMouseDown) {
      this.xPrev = this.x;
      this.yPrev = this.y;
      return;
    }

    const rect = canvas.getBoundingClientRect(); // Get canvas bounds
    const mouseX = event.clientX - rect.left; // Mouse X relative to the canvas
    const mouseY = event.clientY - rect.top; // Mouse Y relative to the canvas

    const adjustedMouseX = mouseX - this.mouseOffset.x;
    const adjustedMouseY = mouseY - this.mouseOffset.y;

    // Calculate velocity based on the difference between the new mouse position and the player's current position
    this.xPrev = this.x;
    this.yPrev = this.y;

    // Limit player position to inside the canvas and below the center line
    this.x = Math.min(
      Math.max(this.radius, adjustedMouseX),
      canvas.width - this.radius,
    );
    this.y = Math.min(
      Math.max(canvas.height / 2 + this.radius, adjustedMouseY),
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
      this.xPrev = this.x;
      this.yPrev = this.y;
      return;
    }

    canvas.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY,
      }),
    );
  }

  velocity() {
    return new Vector(this.x - this.xPrev, this.y - this.yPrev);
  }
}

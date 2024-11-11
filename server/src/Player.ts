import { GameObject } from "./GameObject";
import { Vector } from "./Vector";

export class Player extends GameObject {
  //x and y from previous frame. Used for calculating velocity
  public xPrev: number = 0;
  public yPrev: number = 0;

  // Unique identifier for the player (socket id)
  public id: string = "";

  public score: number = 0;

  constructor(x: number, y: number, radius: number, color: string, id: string) {
    super(x, y, radius, color);
    this.id = id;
  }

  /**
   * Sets the location of the player
   * @param data
   */
  setLocation(data: any) {
    this.x = data.x;
    this.y = data.y;
    this.xPrev = data.xPrev;
    this.yPrev = data.yPrev;
  }

  increaseScore() {
    this.score += 1;
  }

  velocity() {
    return new Vector(this.x - this.xPrev, this.y - this.yPrev);
  }
}

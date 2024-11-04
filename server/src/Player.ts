import { GameObject } from "./GameObject";
import { Vector } from "./Vector";

export class Player extends GameObject {
  //x and y from previous frame. Used for calculating velocity
  public xPrev: number = 0;
  public yPrev: number = 0;

  // Unique identifier for the player (socket id)
  public id: string = "";

  // Score of the player
  public score: number = 0;

  constructor(x: number, y: number, radius: number, color: string, id: string, score: number) {
    super(x, y, radius, color);
    this.id = id;
    this.score = score;
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

  velocity() {
    return new Vector(this.x - this.xPrev, this.y - this.yPrev);
  }

  /**
   * Sets the score of the player
   * @param score
   */
  increaseScore() {
    this.score += 1;
  }
}

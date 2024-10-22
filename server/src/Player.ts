import { GameObject } from "./GameObject";
import { Vector } from "./Vector";

export class Player extends GameObject {
  //x and y from previous frame. Used for calculating velocity
  public xPrev: number = 0;
  public yPrev: number = 0;

  setLocation(data: any){
    this.x = data.x;
    this.y = data.y;
    this.xPrev = data.xPrev;
    this.yPrev = data.yPrev;
  }

  velocity(){
    return new Vector(this.x - this.xPrev, this.y - this.yPrev);
  }
}

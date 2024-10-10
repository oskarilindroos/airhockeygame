import { GameObject } from "./GameObject";
import { Vector } from "./Vector";

export class Player extends GameObject {
  public xOld: number = 0;
  public yOld: number = 0;

  velocity(){
    return new Vector(this.x - this.xOld, this.y - this.yOld);
  }
}

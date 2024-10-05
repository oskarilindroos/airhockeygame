import { GameObject } from "./GameObject";

export class Puck extends GameObject {
    move(){
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }
}
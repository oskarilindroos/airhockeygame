import { GameObject } from "./GameObject";

export class Puck extends GameObject {
    move(){
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    collisionCheck(canvas: HTMLCanvasElement, players: GameObject[]){

        if (this.x <= this.radius || this.x >= canvas.width - this.radius){
            this.xSpeed *= -1;
        }

        if (this.y <= this.radius || this.y >= canvas.height - this.radius){
            this.ySpeed *= -1;
        }

        for (let player of players){
            if (this.distance(player) <= this.radius + player.radius){
                console.log(`Collision!`)
            }
        }
    }

    update(canvas: HTMLCanvasElement, players: GameObject[]){
        this.collisionCheck(canvas, players);
        this.move();
    }
}
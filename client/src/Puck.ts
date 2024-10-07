import { GameObject } from "./GameObject";
import { VectorFunctions } from "./VectorFunctions";

export class Puck extends GameObject {
    move(){
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    collisionEffect(player: GameObject){

        const sumOfRadii = this.radius + player.radius;
        const distance = this.distance(player);

        const normalVectorX = (this.x - player.x) / distance;
        const normalVectorY = (this.y - player.y) / distance;
        const normalVectorAngle = VectorFunctions.angle(normalVectorX, normalVectorY);

        // Move outside the boundaries of the paddle
        this.x = player.x + VectorFunctions.xComponent(normalVectorAngle, sumOfRadii);
        this.y = player.y + VectorFunctions.yComponent(normalVectorAngle, sumOfRadii);
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
                this.collisionEffect(player)
            }
        }
    }



    update(canvas: HTMLCanvasElement, players: GameObject[]){
        this.collisionCheck(canvas, players);
        this.move();
    }
}
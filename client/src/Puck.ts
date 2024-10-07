import { GameObject } from "./GameObject";
import { PhysicsConstants } from "./PhysicsConstants";
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
        // this.x = player.x + VectorFunctions.xComponent(normalVectorAngle, sumOfRadii);
        // this.y = player.y + VectorFunctions.yComponent(normalVectorAngle, sumOfRadii);

        // Calculate new velocity
        const relativeSpeed = (this.xSpeed - player.xSpeed) * normalVectorX + (this.ySpeed - player.ySpeed) * normalVectorY;

        this.xSpeed -= (PhysicsConstants.elasticity + 1) * relativeSpeed * normalVectorX;
        this.ySpeed -= (PhysicsConstants.elasticity + 1) * relativeSpeed * normalVectorY;

        if(VectorFunctions.magnitude(this.xSpeed, this.ySpeed) > PhysicsConstants.maxSpeed){
            this.xSpeed = VectorFunctions.xComponent(normalVectorAngle, PhysicsConstants.maxSpeed)
            this.ySpeed = VectorFunctions.yComponent(normalVectorAngle, PhysicsConstants.maxSpeed)
        }

        console.log(VectorFunctions.magnitude(this.xSpeed, this.ySpeed))
    }

    collisionCheck(canvas: HTMLCanvasElement, players: GameObject[]){

        if (this.x <= this.radius || this.x >= canvas.width - this.radius){
            this.x = this.x <= this.radius ? this.radius + 1 : canvas.width - this.radius - 1;
            //this.xSpeed *= -1
            this.xSpeed *= -1 * PhysicsConstants.elasticity;
            this.ySpeed*= PhysicsConstants.elasticity;
        }

        if (this.y <= this.radius || this.y >= canvas.height - this.radius){
            this.y = this.y <= this.radius ? this.radius + 1 : canvas.height - this.radius - 1;
            //this.ySpeed *= -1
            this.ySpeed *= -1 * PhysicsConstants.elasticity;
            this.xSpeed *= PhysicsConstants.elasticity;
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
        this.xSpeed *= 1 - PhysicsConstants.friction;
        this.ySpeed *= 1 - PhysicsConstants.friction;
    }
}
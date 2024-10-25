import { Vector } from "./Vector";
import { Player } from "./Player";
import { GameObject } from "./GameObject";

export class Puck extends GameObject {
    public velocity: Vector = new Vector(0, 0);
    public friction: number = 0.0;

    /**
     * Calculates the location of the puck in the current frame based on velocity
     * @param areaWidth 
     * @param areaHeight 
     */
    calcPosition(areaWidth: number, areaHeight: number) {
        let hitWall: boolean = false;

        //Stops puck from going out of bounds left
        if ((this.x - this.radius) <= 0) {
            this.x = 1 + this.radius;
            this.velocity.x = -this.velocity.x;
            hitWall = true; //Add a bit of friction
        }

        //Stops puck from going out of bounds right
        if ((this.x + this.radius) >= areaWidth) {
            this.x = areaWidth - 1 - this.radius;
            this.velocity.x = -this.velocity.x;
            hitWall = true; //Add a bit of friction
        }

        //Stops puck from going out of bounds top
        if ((this.y - this.radius) <= 0) {
            this.y = 1 + this.radius;
            this.velocity.y = -this.velocity.y;
            hitWall = true; //Add a bit of friction
        }

        //Stops puck from going out of bounds bottom
        if ((this.y + this.radius) >= areaHeight) {
            this.y = areaHeight - 1 - this.radius;
            this.velocity.y = -this.velocity.y;
            hitWall = true; //Add a bit of friction
        }

        //reduce puck velocity with friction
        if (hitWall) {
            this.friction = 0.2
        }


        //Add friction
        this.velocity.x *= 1 - this.friction;
        this.velocity.y *= 1 - this.friction;


        //Add velocity
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

        //Remove friction (It's floating. Add air friction later?)
        this.friction = 0.0;
    }

    /**
     * Checks if a player hits the puck 
     * @param player 
     * @returns true or false.
     */
    playerCollisionCheck(player: Player) {
        //Setup vectors
        let puckVec: Vector = new Vector(this.x, this.y);
        let hitVec: Vector = new Vector(player.x, player.y);

        //Check if the player touches the puck
        return ((this.radius + player.radius) >= (puckVec.subtr(hitVec).mag()));
    }

    /**
     * Stops the puck from entering inside the player
     * @param player 
     */
    playerPenetrationResponse(player: Player) {
        //Setup vectors
        let puckVec: Vector = new Vector(this.x, this.y);
        let hitVec: Vector = new Vector(player.x, player.y);

        //calculate
        let dist: Vector = puckVec.subtr(hitVec);
        let pen_depth: number = this.radius + player.radius - dist.mag();
        let pen_res: Vector = dist.unit().mult(pen_depth / 2);

        //Affect puck position
        puckVec = puckVec.add(pen_res);

        //Move puck with vector
        this.x = puckVec.x;
        this.y = puckVec.y;
    }


    /**
     * Transfer's the players vector to the puck in a realistic manner
     * @param player 
     */
    playerCollisionResponse(player: Player) {
        //Setup vectors
        let puckVec: Vector = new Vector(this.x, this.y);
        let hitVec: Vector = new Vector(player.x, player.y);

        //Calculate where there puck should fly
        let normal: Vector = puckVec.subtr(hitVec).unit();
        let relVel: Vector = this.velocity.subtr(player.velocity());
        let sepVel: number = Vector.dot(relVel, normal);
        let new_sepVel: number = -sepVel;
        let sepVelVec: Vector = normal.mult(new_sepVel);

        //Add puck velocity
        this.velocity = this.velocity.add(sepVelVec);

        //Temporary fix for the "planet effect" TODO: make the standing still collision better somehow
        if (player.velocity().x > 0.5 || player.velocity().y > 0.5) {
            this.friction = 0.1;
        }
    }
}

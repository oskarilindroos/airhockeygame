import { Vector } from "./Vector";
import { Player } from "./Player";

export class Puck {
    public velocity: Vector = new Vector(0, 0);
    public friction: number = 0.0;

    constructor(
        public x: number,
        public y: number,
        public radius: number,
        public color: string,
    ) { }

    draw(ctx: CanvasRenderingContext2D, areaWidth: number, areaHeight: number, drawOnly: boolean) {

        //We do the physics here
        if (!drawOnly) {
            this.friction = 0.0;
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
        }

        //Draw the puck to it's location
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    hitCheck(player: Player) {
        //Setup vectors
        let puckVec: Vector = new Vector(this.x, this.y);
        let hitVec: Vector = new Vector(player.x, player.y);

        //Check if the player touches the puck
        return ((this.radius + player.radius) >= (puckVec.subtr(hitVec).mag()));
    }

    //Stops penetration
    pen_res_bb(player: Player) {
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


    //Sends the puck flying
    coll_res_bb(player: Player) {
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
    }
}

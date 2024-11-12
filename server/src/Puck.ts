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
   * @param players
   */
  calcPosition(areaWidth: number, areaHeight: number, players: Player[]) {
    let hitWall: boolean = false;

    //Stops puck from going out of bounds left
    if (this.x - this.radius <= 0) {
      this.x = 1 + this.radius;
      this.velocity.x = -this.velocity.x;
      hitWall = true; //Add a bit of friction
    }

    //Stops puck from going out of bounds right
    if (this.x + this.radius >= areaWidth) {
      this.x = areaWidth - 1 - this.radius;
      this.velocity.x = -this.velocity.x;
      hitWall = true; //Add a bit of friction
    }

    //Stops puck from going out of bounds top
    if (this.y - this.radius <= 0) {
      if(this.goalCollisionCheck(areaHeight, areaWidth)) {
        this.resetPuck(areaWidth, areaHeight, players[0]);
      } else {
        this.y = 1 + this.radius;
        this.velocity.y = -this.velocity.y;
        hitWall = true; //Add a bit of friction
      }
    }

    //Stops puck from going out of bounds bottom
  if (this.y + this.radius >= areaHeight) {
      if(this.goalCollisionCheck(areaHeight, areaWidth)) {
        this.resetPuck(areaWidth, areaHeight, players[1]);
      } else {
        this.y = areaHeight - 1 - this.radius;
        this.velocity.y = -this.velocity.y;
        hitWall = true; //Add a bit of friction
      }
    }

    //reduce puck velocity with friction
    if (hitWall) {
      this.friction = 0.2;
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
    const puckVec: Vector = new Vector(this.x, this.y);
    const hitVec: Vector = new Vector(player.x, player.y);

    //Check if the player touches the puck
    return this.radius + player.radius >= puckVec.subtr(hitVec).mag();
  }

  /**
   * Stops the puck from entering inside the player
   * @param player
   */
  playerPenetrationResponse(player: Player) {
    //Setup vectors
    let puckVec: Vector = new Vector(this.x, this.y);
    const hitVec: Vector = new Vector(player.x, player.y);

    //calculate
    const dist: Vector = puckVec.subtr(hitVec);
    const pen_depth: number = this.radius + player.radius - dist.mag();
    const pen_res: Vector = dist.unit().mult(pen_depth / 2);

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
    const puckVec: Vector = new Vector(this.x, this.y);
    const hitVec: Vector = new Vector(player.x, player.y);

    //Calculate where there puck should fly
    const normal: Vector = puckVec.subtr(hitVec).unit();
    const relVel: Vector = this.velocity.subtr(player.velocity());
    const sepVel: number = Vector.dot(relVel, normal);
    const new_sepVel: number = -sepVel;
    const sepVelVec: Vector = normal.mult(new_sepVel);

    //Add puck velocity
    this.velocity = this.velocity.add(sepVelVec);

    //Temporary fix for the "planet effect" TODO: make the standing still collision better somehow
    if (player.velocity().x > 0.5 || player.velocity().y > 0.5) {
      this.friction = 0.1;
    }
  }

  /**
   * Check if puck hits the goal
   * @param areaWidth
   * @param areaHeight
   * @param player
   */
  goalCollisionCheck(areaHeight: number, areaWidth: number) {
      // Check if puck hits the top of play area and is within goal boundaries
    if (this.y - this.radius <= 0 &&
      this.x > areaWidth / 2 - 50 &&
      this.x < areaWidth / 2 + 50) {
      return true;
    }

    // Check if puck hits the bottom of play area and is within goal boundaries
    if (this.y + this.radius >= areaHeight &&
      this.x > areaWidth / 2 - 50 &&
      this.x < areaWidth / 2 + 50) {
      return true;
    }
    return false;
  }

    /**
   * Reset puck after player scores
   * @param areaWidth
   * @param areaHeight
   * @param player
   */

  resetPuck(areaWidth: number, areaHeight: number, player: Player) {
    //Set puck position
    this.x = areaWidth / 2;
    this.y = areaHeight / 2

    //Set puck velocity
    this.velocity = new Vector(0, 0);

    //Set puck friction
    this.friction = 0.0;

    player.increaseScore();
  }
}

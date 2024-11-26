import { Vector } from "./Vector";
import { Player } from "./Player";
import { GameObject } from "./GameObject";
import { GameState } from "./types/GameState";

const COL_CD_FRAMES = 4;

export class Puck extends GameObject {
  public velocity: Vector = new Vector(0, 0);
  public friction: number = 0.0;
  private colCooldown: number = COL_CD_FRAMES;

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
      if (this.goalCollisionCheck(areaHeight, areaWidth)) {
        this.resetPuck(areaWidth, areaHeight, players[0], true);
      } else {
        this.y = 1 + this.radius;
        this.velocity.y = -this.velocity.y;
        hitWall = true; //Add a bit of friction
      }
    }

    //Stops puck from going out of bounds bottom
    if (this.y + this.radius >= areaHeight) {
      if (this.goalCollisionCheck(areaHeight, areaWidth)) {
        this.resetPuck(areaWidth, areaHeight, players[1], false);
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

    //Add velocity
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;

    //Add friction
    this.velocity.x = this.velocity.x * (1 - this.friction);
    this.velocity.y = this.velocity.y * (1 - this.friction);


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

    //Newton's third law (kinda) Basically this takes the vector from puck center to player center, the puck's path vector and calculates the angle between them. Then it rotates puck's path vector by that angle
    //Calculate angle. This video explains: https://www.youtube.com/watch?v=dYPRYO8QhxU&t
    const normalTimesVel: number = (this.velocity.x * normal.x) + (this.velocity.y * normal.y);
    const normalHypot: number = Math.hypot(normal.x, normal.y);
    const velHypot: number = Math.hypot(this.velocity.x, this.velocity.y);
    let angle: number = Math.acos(normalTimesVel / (normalHypot * velHypot));
    let thirdLaw: Vector = new Vector(0, 0);

    if (isNaN(angle) == false) {
      //Explaining this math: https://www.youtube.com/watch?v=7j5yW5QDC2U
      thirdLaw.x = ((Math.cos(angle) * thirdLaw.x) - (Math.sin(angle) * thirdLaw.x));
      thirdLaw.y = ((Math.sin(angle) * thirdLaw.y) + (Math.cos(angle) * thirdLaw.y));

      //In true newton's thid law, this should be added to the vector, but somehow it bugs the system, so this makes it bounce instead
      this.velocity = thirdLaw;
    }

    const stillLimit: number = 2;
    //make the standing still collision better
    if (player.velocity().x < stillLimit && player.velocity().x > -stillLimit && player.velocity().y < stillLimit && player.velocity().y > -stillLimit) {
      this.friction = 0.6;
    }

    //Add puck velocity
    this.velocity = this.velocity.add(sepVelVec);
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
 * @param oneScored //True if player one scored, false if player two scored
 */
  resetPuck(areaWidth: number, areaHeight: number, player: Player, oneScored: boolean) {

    //Set puck position based on who scored
    if (oneScored) {
      this.x = areaWidth / 2;
      this.y = areaHeight / 2 - 50;
    }
    else {
      this.x = areaWidth / 2;
      this.y = areaHeight / 2 + 50;
    }

    //Set puck velocity
    this.velocity = new Vector(0, 0);

    //Set puck friction
    this.friction = 0.0;

    player.increaseScore();
  }

  /**
   * Puck update function called every frame
   * @param state
   * @param GAME_AREA
   */
  update(state: GameState, GAME_AREA: {width: number, height: number}){
    const players = state.players;

    //Cooldown count
    if(this.colCooldown < COL_CD_FRAMES)
      {
        this.colCooldown = this.colCooldown+1;
      }

      // Puck collision detection
      for (const player of players) {
        if (this.playerCollisionCheck(player)) {
          this.playerPenetrationResponse(player);
          //If not on cooldown, let the velocity stuff happen
          if(this.colCooldown >= COL_CD_FRAMES)
          {
            this.playerCollisionResponse(player);
            this.colCooldown = 0;
          }
        }
      }

      // Update puck position
      this.calcPosition(GAME_AREA.width, GAME_AREA.height, players);
  }
}

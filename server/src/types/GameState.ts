import { Player } from "../Player";
import { Puck } from "../Puck";

export interface GameState {
  players: Player[];
  puck: Puck;
}

export type GameStates = {
  [roomId: string]: GameState;
};

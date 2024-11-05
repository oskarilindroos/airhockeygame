import { Player } from "../classes/Player";
import { Puck } from "../classes//Puck";

export interface GameState {
  players: Player[];
  puck: Puck;
}

export type GameStates = {
  [roomId: string]: GameState;
};

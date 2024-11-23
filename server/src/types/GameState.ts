import { Player } from "../Player";
import { Puck } from "../Puck";

export interface GameState {
  players: Player[];
  puck: Puck;
  timeLeft: number;
  gameInterval: NodeJS.Timeout | null,
  timerInterval: NodeJS.Timeout | null
}

export type GameStates = {
  [roomId: string]: GameState;
};

import { Player } from "../Player";
import { Puck } from "../Puck";

//export type PlayerState = {
//  x: number;
//  y: number;
//  //isReady: boolean;
//};
//
//export type PuckState = {
//  x: number;
//  y: number;
//};
//
export interface GameState {
  players: Player[];
  puck: Puck;
}

export type GameStates = {
  [roomId: string]: GameState;
};

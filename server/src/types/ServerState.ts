import { Server } from "socket.io";
import { GameStates } from "./GameState";
import { LobbyStates } from "./LobbyState";
import { Timers } from "./Timers";

export type ServerState = {
    gameStates: GameStates,
    lobbyStates: LobbyStates
    timers: Timers,
    io: Server;
}
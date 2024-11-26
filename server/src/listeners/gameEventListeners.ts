import { Server } from "socket.io";
import { GameStates } from "../types/GameState";
import { gameFunctions } from "../GameFunctions";
import { LobbyStates } from "../types/LobbyState";
import { Timers } from "../types/Timers";

export const gameEventListeners = {
    playerMove: (data: any, gameStates: GameStates) => {
        const { roomId, playerId, location } = data;

        if (!gameStates[roomId]) {
          return;
        }

        // Find the player in the game state
        const player = gameStates[roomId].players.find(
          (player) => player.id === playerId,
        );

        if (!player) {
          return;
        }

        // Update the player's location
        player.setLocation(location);
    },

    startGame: (roomId: string, io: Server, gameStates: GameStates, lobbyStates: LobbyStates, timers: Timers) =>{
        io.in(roomId).emit("game started");
        gameFunctions.startGame(roomId, gameStates, lobbyStates, timers, io)
    },
}
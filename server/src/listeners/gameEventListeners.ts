import { Server } from "socket.io";
import { Player } from "../Player";
import { GameStates } from "../types/GameState";

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

    startGame: (roomId: string, io: Server, startGameFunction: (roomId: string) => void) =>{
        io.in(roomId).emit("game started");
        startGameFunction(roomId);
    },
}
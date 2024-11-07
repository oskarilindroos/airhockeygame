import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { GameStates } from "../types/GameState";
import { LobbyStates } from "../types/LobbyState";
import { Puck } from "../Puck";
import { Player } from "../Player";

export const addListenerCreateRoom = (
  socket: Socket,
  gameStates: GameStates,
  GAME_AREA: {width: number, height: number},
  lobbyStates: LobbyStates) => {
     // Handle creating a room
  socket.on("create room", () => {
    const roomId = uuidv4(); // Generate a unique room ID

    // Initialize the game state if it doesn't exist
    if (!gameStates[roomId]) {
      const puck = new Puck(
        GAME_AREA.width / 2,
        GAME_AREA.height / 2,
        15,
        "black",
      );

      // NOTE: Player 1 is always the one that created the room
      const playerOne = new Player(
        GAME_AREA.width / 2,
        GAME_AREA.height - 40,
        20,
        "green",
        socket.id,
      );

      gameStates[roomId] = {
        puck,
        players: [playerOne],
        timeLeft: 300,
      };
    }

    // Initialize lobby state
    if (!lobbyStates[roomId]){
      lobbyStates[roomId] = {};
      lobbyStates[roomId][socket.id] = {isReady: false};
    }

    // Join the newly created room
    socket.join(roomId);
    socket.emit("room created", {roomId, lobbyState: lobbyStates[roomId]});
    console.log("Room created with ID:", roomId);
  });
}
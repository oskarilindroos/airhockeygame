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

    // Initialize lobby state
    if (!lobbyStates[roomId]){
      lobbyStates[roomId] = {playerReadyStatus: {}, playerOne: socket.id, playerTwo: ''};
      lobbyStates[roomId].playerReadyStatus[socket.id] = {isReady: false};
    }

    // Join the newly created room
    socket.join(roomId);
    socket.emit("room created", {roomId, lobbyState: lobbyStates[roomId]});
    console.log("Room created with ID:", roomId);
  });
}
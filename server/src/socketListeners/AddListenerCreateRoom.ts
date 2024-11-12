import { Socket } from "socket.io";
import { GameStates } from "../types/GameState";
import { LobbyStates } from "../types/LobbyState";
import { generateRandomString } from "../utils/random";

export const addListenerCreateRoom = (
  socket: Socket,
  gameStates: GameStates,
  GAME_AREA: { width: number; height: number },
  lobbyStates: LobbyStates,
) => {
  // Handle creating a room
  socket.on("create room", () => {
    const roomId = generateRandomString(6); // Generate a unique room ID

    // Initialize lobby state
    if (!lobbyStates[roomId]) {
      lobbyStates[roomId] = {
        playerReadyStatus: {},
        playerOne: socket.id,
        playerTwo: "",
      };
      lobbyStates[roomId].playerReadyStatus[socket.id] = { isReady: false };
    }

    // Join the newly created room
    socket.join(roomId);
    socket.emit("room created", { roomId, lobbyState: lobbyStates[roomId] });
    console.log("Room created with ID:", roomId);
  });
};


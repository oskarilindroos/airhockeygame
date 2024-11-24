import { Server, Socket } from "socket.io";
import { LobbyStates } from "../types/LobbyState";
import { generateRandomString } from "../utils/random";
import { GameStates } from "../types/GameState";
import { disconnect } from "process";

export const roomEventListeners = {
  createRoom: function(socket: Socket, lobbyStates: LobbyStates) {
    // Handle creating a room
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
  },

  disconnecting: function(socket: Socket, roomId: string, lobbyStates: LobbyStates, io: Server, gameStates: GameStates, gameOver: (roomId : string, reason: string) => void){
    let rooms = Array.from(socket.rooms);

    // socket.rooms always contains socket ID, but we don't want it
    rooms = rooms.filter((id) => id !== socket.id);

    for (const roomId of rooms) {
      this.leaveRoom(socket, roomId, lobbyStates, io, gameStates, gameOver);
    }

    console.log(`user ${socket.id} disconnected`);
  },

  joinRoom: function(roomId: string, socket: Socket, lobbyStates: LobbyStates, io: Server) {
    // Check if room exists
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) {
      socket.emit("room not found");
      return;
    }

    // Check if room is full
    if (room.size >= 2) {
      socket.emit("room full");
      return;
    }

    // Add the joined player to the lobby state
    const lobbyState = lobbyStates[roomId];
    lobbyState.playerTwo = socket.id;
    lobbyState.playerReadyStatus[socket.id] = { isReady: false };

    // Join the room
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Broadcast to all clients in the room that a new user has joined
    socket.to(roomId).emit("user joined", socket.id, lobbyState);

    // Emit to the client that the room has been joined
    socket.emit("room joined", lobbyState);
  },

  leaveRoom: function(socket: Socket, roomId: string, lobbyStates: LobbyStates, io: Server, gameStates: GameStates, gameOver: (roomId : string, reason: string) => void) {
    const lobbyState = lobbyStates[roomId];

    // Make remaining player "player 1" or "host"
    const roomSize = io.sockets.adapter.rooms.get(roomId)?.size;
    if (socket.id === lobbyState.playerOne && roomSize === 2) {
      lobbyState.playerOne = lobbyState.playerTwo;
    }

    lobbyState.playerTwo = "";
    delete lobbyState.playerReadyStatus[socket.id];
    socket.to(roomId).emit("user left", lobbyState, socket.id);

    if (gameStates[roomId]) {
      const players = gameStates[roomId].players;
      players[0].score = 1;
      players[1].score = 0;
      gameOver(roomId, "Your oppnent left the game");
    }

    socket.leave(roomId);
  },

  readyStatusChanged: function(roomId: string, isReady: boolean, lobbyStates: LobbyStates, socket: Socket){
    lobbyStates[roomId].playerReadyStatus[socket.id].isReady = isReady;
    socket.to(roomId).emit("lobby updated", lobbyStates[roomId]);
  }

}

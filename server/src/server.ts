import express from "express";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import cors from "cors";
import { Puck } from "./Puck";
import { Player } from "./Player";
import { GameStates } from "./types/GameState";
import { LobbyStates } from "./types/LobbyState";

import { addListenerCreateRoom } from "./socketListeners/AddListenerCreateRoom"

const GAME_AREA = { width: 300, height: 600 };

const gameStates: GameStates = {};
const lobbyStates: LobbyStates = {};

// Read PORT from .env or default to 5000
const PORT = process.env.PORT || 5000;

// CORS origins must be set
if (process.env.CORS_ORIGINS === undefined) {
  throw new Error("CORS_ORIGINS environment variable is required");
}

const allowedOrigins = process.env.CORS_ORIGINS.split(",");
console.log("Allowed origins:", allowedOrigins);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Enable the admin UI for socket.io
instrument(io, {
  auth: false,
  mode: "development",
});

// CORS middleware
app.use(cors({ origin: allowedOrigins }));

// Logger middleware
app.use(morgan("dev"));

app.get("/healthcheck", (_req, res) => {
  res.status(200).send("OK");
});

// Websocket connections
io.on("connection", (socket) => {
  console.log("user connected");

  addListenerCreateRoom(socket, gameStates, GAME_AREA, lobbyStates);

  // Handle joining a room
  socket.on("join room", async (roomId) => {
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
    lobbyState.playerReadyStatus[socket.id] = {isReady: false};

    // Join the room
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Broadcast to all clients in the room that a new user has joined
    socket.to(roomId).emit("user joined", socket.id, lobbyState);

    // Emit to the client that the room has been joined
    socket.emit("room joined", lobbyState);
  });

  const initializeGameState = (roomId: string) => {
        // Initialize the game state if it doesn't exist
        if (!gameStates[roomId]) {
          const puck = new Puck(
            GAME_AREA.width / 2, GAME_AREA.height / 2, 15, "black"
          );

          // NOTE: Player 1 is always the one that created the room
          const playerOne = new Player(
            GAME_AREA.width / 2, GAME_AREA.height - 40, 20, "green", socket.id
          );

          const playerTwo = new Player(
            GAME_AREA.width / 2, 40, 20, "red", lobbyStates[roomId].playerTwo
          );

          gameStates[roomId] = {
            puck,
            players: [playerOne, playerTwo],
            timeLeft: 300,
          };
        }
  }

  const startGame = (roomId: string) =>{
    initializeGameState(roomId);
    const FPS = 60;

    // Start the game loop for the room
    const gameInterval = setInterval(() => {
      const puck = gameStates[roomId].puck;
      const state = gameStates[roomId];

      // Puck collision detection
      for (const player of gameStates[roomId].players) {
        if (puck.playerCollisionCheck(player)) {
          puck.playerPenetrationResponse(player);
          puck.playerCollisionResponse(player);
        }
      }

      // Update puck position
      puck.calcPosition(GAME_AREA.width, GAME_AREA.height);

      io.to(roomId).emit("gameState updated", state);
    }, 1000 / FPS);


      // Separate Timer Interval
      const timerInterval = setInterval(() => {
        const state = gameStates[roomId];
        if (!state) return;

        if (state.timeLeft <= 0) {
          io.to(roomId).emit("game over", { reason: "Time's up!" });
          clearInterval(gameInterval);
          clearInterval(timerInterval);
          delete gameStates[roomId];
        } else {
          state.timeLeft--;
          io.to(roomId).emit("timer updated", { timeLeft: state.timeLeft });
        }
      }, 1000); // 1000 ms = 1 second
  }

  // Handle leaving a room
  socket.on("leave room", (roomId) => {
    const roomSize = io.sockets.adapter.rooms.get(roomId)?.size;
    const lobbyState = lobbyStates[roomId];
    if (socket.id === lobbyState.playerOne && roomSize === 2){
      lobbyState.playerOne = lobbyState.playerTwo;
    }
    lobbyState.playerTwo = '';
    delete lobbyState.playerReadyStatus[socket.id];
    socket.leave(roomId);
    socket.to(roomId).emit("user left", lobbyState);
  });


  // Handle player movement
  socket.on("player move", (data) => {
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
  });

  socket.on("ready status changed", (roomId: string, isReady:  boolean) =>{
    lobbyStates[roomId].playerReadyStatus[socket.id].isReady = isReady;
    socket.to(roomId).emit("lobby updated", lobbyStates[roomId])
  })

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


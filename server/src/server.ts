import express from "express";
import morgan from "morgan";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import cors from "cors";
import { Puck } from "./Puck";
import { Player } from "./Player";
import { GameStates } from "./types/GameState";
import { LobbyStates } from "./types/LobbyState";
import { Timers } from "./types/Timers";
import * as listeners from "./listeners/index"

const GAME_AREA = { width: 300, height: 600 };
const TIME_LIMIT_SEC = 300;

const gameStates: GameStates = {};
const lobbyStates: LobbyStates = {};
const timers: Timers = {};

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
  auth: {
    type: "basic",
    username: process.env.SOCKET_IO_USERNAME!,
    password: process.env.SOCKET_IO_PASSWORD!,
  },
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
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

  socket.on("create room", () => listeners.roomEventListeners.createRoom(socket, lobbyStates));
  socket.on("join room", (roomId: string) => listeners.roomEventListeners.joinRoom(roomId, socket, lobbyStates, io));
  socket.on("leave room", (roomId: string) => listeners.roomEventListeners.leaveRoom(socket, roomId, lobbyStates, io, gameStates, gameOver));
  socket.on("ready status changed", (roomId: string, isReady: boolean) => listeners.roomEventListeners.readyStatusChanged(roomId, isReady,lobbyStates, socket));
  socket.on("disconnecting", () => listeners.roomEventListeners.disconnecting(socket, lobbyStates, io, gameStates, gameOver));

  socket.on("start game", (roomId: string) => listeners.gameEventListeners.startGame(roomId, io, startGame));
  socket.on("player move", (data) => listeners.gameEventListeners.playerMove(data, gameStates));

});

const gameOver = (roomId: string, reason: string) => {
  const gameInterval = timers[roomId].gameInterval;
  const timerInterval = timers[roomId].timerInterval;

  clearInterval(gameInterval ?? undefined);
  clearInterval(timerInterval ?? undefined);

  const gameState = gameStates[roomId];
  const lobbyState = lobbyStates[roomId];

  if (lobbyState.playerTwo !== "") {
    lobbyState.playerReadyStatus[lobbyState.playerTwo].isReady = false;
  }
  lobbyState.playerReadyStatus[lobbyState.playerOne].isReady = false;
  io.in(roomId).emit("game over", { reason: reason }, lobbyState, gameState);
  delete gameStates[roomId];
  delete timers[roomId];
};

const initializeGameState = (roomId: string) => {
  // Initialize the game state if it doesn't exist
  if (!gameStates[roomId]) {
    const lobbyState = lobbyStates[roomId];
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
      lobbyState.playerOne,
    );

    const playerTwo = new Player(
      GAME_AREA.width / 2,
      40,
      20,
      "red",
      lobbyState.playerTwo,
    );

    gameStates[roomId] = {
      puck,
      players: [playerOne, playerTwo],
      timeLeft: TIME_LIMIT_SEC,
    };

    timers[roomId] = {
      gameInterval: null,
      timerInterval: null
    }
  }
};

const startGame = (roomId: string) => {
  initializeGameState(roomId);
  const FPS = 60;

  //Having a cooldown on touching the puck fixes TONS of bugs. Most bugs are due to multiple collisions, because of the fast framerate
  const COL_CD_FRAMES = 4;
  let colCooldown: number = COL_CD_FRAMES;

  // Start the game loop for the room
  timers[roomId].gameInterval = setInterval(() => {

    if (!gameStates[roomId]){
      return;
    }

    const state = gameStates[roomId];
    const puck = state.puck;
    const players = state.players;

    //Cooldown count
    if(colCooldown < COL_CD_FRAMES)
    {
      colCooldown = colCooldown+1;
    }

    // Puck collision detection
    for (const player of players) {
      if (puck.playerCollisionCheck(player)) {
        puck.playerPenetrationResponse(player);
        //If not on cooldown, let the velocity stuff happen
        if(colCooldown >= COL_CD_FRAMES)
        {
          puck.playerCollisionResponse(player);
          colCooldown = 0;
        }
      }
    }

    // Update puck position
    puck.calcPosition(GAME_AREA.width, GAME_AREA.height, players);

    // Check if socre limit is hit
    if (players[0].score === 5 || players[1].score === 5) {
      gameOver(roomId, "Score limit reached!")
      return;
    }

    io.to(roomId).emit("gameState updated", state);
  }, 1000 / FPS);

  // Separate Timer Interval
  timers[roomId].timerInterval = setInterval(() => {
    const state = gameStates[roomId];
    if (!state) return;

    if (state.timeLeft <= 0) {
      gameOver(roomId, "Time's up!");
    } else {
      state.timeLeft--;
      io.to(roomId).emit("timer updated", { timeLeft: state.timeLeft });
    }
  }, 1000); // 1000 ms = 1 second
};

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express from "express";
import morgan from "morgan";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import cors from "cors";
import { GameStates } from "./types/GameState";
import { LobbyStates } from "./types/LobbyState";
import { Timers } from "./types/Timers";
import * as listeners from "./listeners/index"

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
  socket.on("leave room", (roomId: string) => listeners.roomEventListeners.leaveRoom(socket, roomId, lobbyStates, io, gameStates, timers));
  socket.on("ready status changed", (roomId: string, isReady: boolean) => listeners.roomEventListeners.readyStatusChanged(roomId, isReady,lobbyStates, socket));
  socket.on("disconnecting", () => listeners.roomEventListeners.disconnecting(socket, lobbyStates, io, gameStates, timers));

  socket.on("start game", (roomId: string) => listeners.gameEventListeners.startGame(roomId, io, gameStates, lobbyStates, timers));
  socket.on("player move", (data) => listeners.gameEventListeners.playerMove(data, gameStates));

});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

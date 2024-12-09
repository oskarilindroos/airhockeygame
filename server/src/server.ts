import express from "express";
import morgan from "morgan";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import cors from "cors";
import * as listeners from "./listeners/index"


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
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
});

// CORS middleware
app.use(cors({ origin: allowedOrigins }));

// Logger middleware
app.use(morgan("dev"));

app.get("/healthcheck", (_req, res) => {
  res.status(200).send("OK");
});

const serverState = {
  gameStates : {},
  lobbyStates: {},
  timers: {},
  io
}

// Websocket connections
io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("create room", () => listeners.roomEventListeners.createRoom(socket, serverState));
  socket.on("join room", (roomId: string) => listeners.roomEventListeners.joinRoom(roomId, socket, serverState));
  socket.on("leave room", (roomId: string) => listeners.roomEventListeners.leaveRoom(socket, roomId, serverState));
  socket.on("ready status changed", (roomId: string, isReady: boolean) => listeners.roomEventListeners.readyStatusChanged(roomId, isReady, serverState.lobbyStates, socket));
  socket.on("disconnecting", () => listeners.roomEventListeners.disconnecting(socket, serverState));

  socket.on("start game", (roomId: string) => listeners.gameEventListeners.startGame(roomId, serverState));
  socket.on("player move", (data) => listeners.gameEventListeners.playerMove(data, serverState.gameStates));

});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express from "express";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import cors from "cors";

// Read PORT from .env or default to 5000
const PORT = process.env.PORT || 5000;

// CORS origins must be set
if (process.env.CORS_ORIGINS === undefined) {
  throw new Error("CORS_ORIGINS environment variable is required");
}

const allowedOrigins = process.env.CORS_ORIGINS.split(",");

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

// Create a new game room with a unique id
// TODO: Connect to db?
app.get("/games/create", (_req, res) => {
  const roomId = uuidv4();
  res.send({ roomId });
});

// Websocket connections
io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("create room", async (roomId) => {
    socket.join(roomId);
  });

  socket.on("join room", async (roomId) => {
    // Check if room exists
    const room = io.sockets.adapter.rooms.get(roomId);

    if (room === undefined) {
      console.log("room not found");
      socket.emit("room not found");
      return;
    }

    socket.join(roomId);

    socket.to(roomId).emit("user joined", socket.id);
    socket.emit("room joined", socket.id);
  });

  socket.on("player move", (data) => {
    socket.to(data.roomId).emit("player move", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

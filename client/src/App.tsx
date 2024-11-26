"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  drawCenterCircle,
  drawCenterLine,
  drawGoals,
} from "./classes/graphics";
import { PostGameScreen } from "./components/PostGameScreen";
import { Player } from "./classes/Player";
import { Puck } from "./classes/Puck";
import { GameState } from "./types/GameState";

import Lobby from "./components/Lobby";
import "./App.css";
import { LobbyState } from "./types/LobbyState";
import { UseLobbyContext } from "./contextProviders/LobbyContextProvider";
import MainMenu from "./components/MainMenu";
import JoinLobbyModal from "./components/JoinLobbyModal";

export default function AirHockey() {
  const CANVAS_WIDTH = 300;
  const CANVAS_HEIGHT = 600;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40, 20, "green");
  const opponent = new Player(CANVAS_WIDTH / 2, 40, 20, "red");
  const puck = new Puck(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 15, "black");

  const [isPlayerOne, setIsPlayerOne] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isPostGameScreenOpen, setIsPostGameScreenOpen] =
    useState<boolean>(false);
  const [timerDisplay, setTimerDisplay] = useState<string>("5:00");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showJoinLobbyModal, setShowJoinLobbyModal] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const {
    isInLobby,
    roomId,
    setLobbyState,
    setOpponentId,
    setIsInLobby,
    setIsReady,
    setPlayerId,
    setRoomId,
  } = UseLobbyContext();

  const addUserLeftListener = () => {
    // Listen for when a user leaves the room
    socket?.once("user left", (lobbyState: LobbyState, socketId: string) => {
      setOpponentId("");
      setLobbyState(lobbyState);
      console.log(`User ${socketId} left`);
      setIsPlayerOne(true);
    });
  };

  const returnToLobby = () => {
    setGameStarted(false);
    setIsInLobby(true);
    console.log(`'in lobby' status changed to: ${isInLobby}`);
    setIsPostGameScreenOpen(false);
  };

  const addLobbyListeners = () => {
    socket?.on("lobby updated", (state: LobbyState) => {
      setLobbyState(state);
    });

    // Listen for when a user joins the room
    socket?.on("user joined", (socketId: string, lobbyState: LobbyState) => {
      console.log(`User (${socketId}) joined the room`);
      setOpponentId(socketId);
      setLobbyState(lobbyState);

      addUserLeftListener();
    });

    socket?.on("game started", () => {
      // Listen for the game over event
      socket?.once(
        "game over",
        (
          { reason }: { reason: string },
          lobbyState: LobbyState,
          gameState: GameState,
        ) => {
          setLobbyState(lobbyState);
          setGameState(gameState);
          setIsReady(false);
          setIsPostGameScreenOpen(true);
          alert(`Game Over: ${reason}`);
          setTimerDisplay("0:00"); // Reset timer display
        },
      );
      setGameStarted(true);
      setIsInLobby(false);
    });
  };

  useEffect(() => {
    // Create the socket connection
    if (socket === null) {
      const newSocket = io(import.meta.env.VITE_API_URL || "");
      setSocket(newSocket);

      if (newSocket.id) {
        setPlayerId(newSocket.id);
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    if (!socket || !gameStarted) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isMouseDown = false;

    const handleMouseDown = (event: MouseEvent) => {
      isMouseDown = player.handleMouseClick(event, canvas);
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      player.handleMouseMove(event, canvas, isMouseDown);

      // Emit the player movement to the server
      socket.emit("player move", {
        roomId,
        playerId: socket.id,
        location: {
          x: isPlayerOne ? player.x : canvas.width - player.x,
          y: isPlayerOne ? player.y : canvas.height - player.y,
          xPrev: isPlayerOne ? player.xPrev : canvas.width - player.xPrev,
          yPrev: isPlayerOne ? player.yPrev : canvas.height - player.yPrev,
        },
      });
    };

    // NOTE: Touch events simulate mouse events
    const handleTouchStart = () => {
      isMouseDown = true;
      canvas.dispatchEvent(new MouseEvent("mousedown"));
    };

    const handleTouchEnd = () => {
      isMouseDown = false;
      canvas.dispatchEvent(new MouseEvent("mouseup"));
    };

    const handleTouchMove = (event: TouchEvent) => {
      player.handleTouchMove(event, canvas, isMouseDown);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchmove", handleTouchMove);

    // Listen for game state updates from the server
    socket.on("gameState updated", (data: GameState) => {
      setGameState(data);
      puck.x = data.puck.x;
      puck.y = data.puck.y;

      data.players.forEach((playerData) => {
        if (playerData.id === socket.id) return;
        opponent.x = playerData.x;
        opponent.y = playerData.y;
      });
    });

    // Listen for the timer update from the server
    socket.on("timer updated", ({ timeLeft }: { timeLeft: number }) => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;

      // Format the time as MM:SS and display it
      setTimerDisplay(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
    });

    // Main game loop
    const update = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawGoals(canvas, ctx);
      drawCenterLine(canvas, ctx);
      drawCenterCircle(canvas, ctx);

      player.draw(ctx);

      ctx.save();

      // Flip the image when drawing from player 2's perspective
      if (!isPlayerOne) {
        ctx.translate(canvas.width, canvas.height);
        ctx.rotate(Math.PI);
      }

      puck.draw(ctx);
      opponent.draw(ctx);

      ctx.restore();

      requestAnimationFrame(update);
    };

    // Start the game loop
    update();

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gameStarted]);

  const createGameLobby = () => {
    setIsReady(false);
    if (!socket) return;
    console.log("Creating game room...");
    setIsPlayerOne(true);

    // Create a new game room
    socket.emit("create room");

    // Listen for the room created event
    socket.once(
      "room created",
      ({ roomId, lobbyState }: { roomId: string; lobbyState: LobbyState }) => {
        console.log(`Game room created with roomId: ${roomId}`);
        setRoomId(roomId);
        setLobbyState(lobbyState);
        setIsInLobby(true);
      },
    );

    addLobbyListeners();
  };

  const joinGameLobby = () => {
    setIsPlayerOne(false);
    setIsReady(false);
    if (!socket) return;

    setShowJoinLobbyModal(true);

    //if (!inviteLink) return;
  };

  const leaveGameLobby = () => {
    socket?.emit("leave room", roomId);
    socket?.removeAllListeners();
    setIsInLobby(false);
  };

  const toggleReady = () => {
    setIsReady((prev) => {
      const newState = !prev;
      socket?.emit("ready status changed", roomId, newState);
      return newState;
    });
  };

  const startGame = () => {
    setIsReady(false);
    socket?.emit("start game", roomId);
  };

  if (isInLobby) {
    return (
      <>
        <Lobby
          exitLobby={leaveGameLobby}
          toggleReady={toggleReady}
          startGame={startGame}
        />
      </>
    );
  }

  return (
    <div className="bodyReact">
      <div className="app">
        {!gameStarted ? (
          <>
            <MainMenu
              onCreateLobby={createGameLobby}
              onJoinLobby={joinGameLobby}
            />
            <JoinLobbyModal
              isOpen={showJoinLobbyModal}
              onClose={() => setShowJoinLobbyModal(false)}
              onJoin={() => {
                if (!socket) return;
                socket.emit("join room", inviteLink);

                socket.once("room not found", () => {
                  alert("Room not found");
                });

                socket.once("room full", () => {
                  alert("Room is full");
                });

                socket.once("room joined", (lobbyState: LobbyState) => {
                  setRoomId(inviteLink);
                  setOpponentId(lobbyState.playerOne);
                  setLobbyState(lobbyState);
                  setIsInLobby(true);
                  addUserLeftListener();
                });

                addLobbyListeners();
              }}
              inviteLink={inviteLink}
              setInviteLink={setInviteLink}
            />
          </>
        ) : (
          <>
            <PostGameScreen
              open={isPostGameScreenOpen}
              gameState={gameState}
              returnToLobby={returnToLobby}
              isPlayerOne={isPlayerOne}
            />

            <p id="roomId">Room ID: {roomId}</p>
            <p id="Score">
              {gameState?.players[0]?.score ?? 0} :{" "}
              {gameState?.players[1]?.score ?? 0}
            </p>
            <h2 id="gameTimer">{timerDisplay}</h2>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              id="gameCanvas"
              className="app"
            >
              Your browser does not support the canvas element.
            </canvas>
          </>
        )}
      </div>
    </div>
  );
}

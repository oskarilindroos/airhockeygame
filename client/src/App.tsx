'use client'

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { drawCenterCircle, drawCenterLine, drawGoals } from "./classes/graphics";
import { Player } from "./classes/Player";
import { Puck } from "./classes/Puck";
import { GameState } from "./types/GameState"
import './App.css'


export default function AirHockey() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [isPlayerOne, setIsPlayerOne] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [timerDisplay, setTimerDisplay] = useState<string>('5:00');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    // Create the socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || '');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // The initial game state
    const player = new Player(canvas.width / 2, canvas.height - 40, 20, "green");
    const opponent = new Player(canvas.width / 2, 40, 20, "red");
    const puck = new Puck(canvas.width / 2, canvas.height / 2, 15, "black");

    setGameState({
      puck: puck,
      players: [player],
    });

    let isMouseDown = false;

    const handleMouseDown = () => {
      isMouseDown = true;
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

    // Listen for when a user joins the room
    socket.on("user joined", (userId: string) => {
      console.log(`User (${userId}) joined the room`);
    });

    // Listen for game state updates from the server
    socket.on("gameState updated", (data: GameState) => {
      setGameState(data);

      puck.x = data.puck.x;
      puck.y = data.puck.y;

      //This takes cares of "gameState not used" error.
      if(gameState != null)
      {
        console.log("gamestate not null");
      }

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

    // Listen for the game over event
    socket.on("game over", ({ reason }: { reason: string }) => {
      alert(`Game Over: ${reason}`);
      setTimerDisplay("0:00"); // Reset timer display
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
  }, [socket, roomId, isPlayerOne, gameStarted]);

  const createGameRoom = () => {
    if (!socket) return;
    console.log("Creating game room...");
    setIsPlayerOne(true);

    // Create a new game room
    socket.emit("create room");

    // Listen for the room created event
    socket.once("room created", (newRoomId: string) => {
      console.log(`Game room created with roomId: ${newRoomId}`);
      setRoomId(newRoomId);
      setGameStarted(true);
    });
  };

  const joinGameRoom = () => {
    if (!socket) return;
    const inputRoomId = prompt("Enter the room ID") || "";

    if (!inputRoomId) return;

    socket.emit("join room", inputRoomId);

    socket.once("room not found", () => {
      alert("Room not found");
    });

    socket.once("room full", () => {
      alert("Room is full");
    });

    socket.once("room joined", () => {
      setRoomId(inputRoomId);
      setGameStarted(true);
    });
  };


  return (
    <div className="bodyReact">
      <div className="app">
        {!gameStarted ? (
          <>
            <h1 id="headerText">Welcome to AirHockey!</h1>

            <button
              onClick={createGameRoom}
              id="createGame"
              className="dynamic-button"
            >
              Create Game
            </button>
            <button
              onClick={joinGameRoom}
              id="joinGame"
              className="dynamic-button"
            >
              Join Game
            </button>
          </>
        ) : (
          <>
            <p id="roomId">Room ID: {roomId}</p>
            <p id="Score">
              {gameState?.players[0]?.score ?? 0} : {gameState?.players[1]?.score ?? 0}
            </p>
            <h2 id="gameTimer">{timerDisplay}</h2>
            <canvas
              ref={canvasRef}
              width={300}
              height={600}
              id="gameCanvas"
            >
              Your browser does not support the canvas element.
            </canvas>
          </>
        )}
      </div>
    </div>


  );
}
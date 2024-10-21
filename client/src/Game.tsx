// src/Game.tsx
import React, { useEffect, useRef } from 'react';
import { drawCenterCircle, drawCenterLine, drawGoals } from './graphics';
import { Player } from './Player';
import { Puck } from './Puck';
import './style.css';

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const playerRef = useRef<Player | null>(null);
  const opponentRef = useRef<Player | null>(null);
  const puckRef = useRef<Puck | null>(null);
  const isMouseDownRef = useRef<boolean>(false);

  // Initialize the game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create WebSocket connection
    const socket = new WebSocket('ws://localhost:8080');
    socketRef.current = socket;

    // Initialize players and puck
    const player = new Player(canvas.width / 2, canvas.height - 40, 20, 'green');
    const opponent = new Player(canvas.width / 2, 40, 20, 'red');
    const puck = new Puck(canvas.width / 2, canvas.height / 2 + 50, 15, 'black');
    playerRef.current = player;
    opponentRef.current = opponent;
    puckRef.current = puck;

    // WebSocket event handlers
    socket.onopen = () => {
      console.log('Connected to the server');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (opponentRef.current) {
        opponentRef.current.x = data.x;
        opponentRef.current.y = data.y;
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from the server');
    };

    socket.onerror = (error) => {
      console.error('Error:', error);
    };

    // Event handlers for mouse and touch events
    const handleMouseDown = () => {
      isMouseDownRef.current = true;
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (playerRef.current) {
        playerRef.current.handleMouseMove(event, canvas, isMouseDownRef.current);
      }
    };

    const handleTouchStart = () => {
      isMouseDownRef.current = true;
    };

    const handleTouchEnd = () => {
      isMouseDownRef.current = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (playerRef.current) {
        playerRef.current.handleTouchMove(event, canvas, isMouseDownRef.current);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchmove', handleTouchMove);

    // Main game loop
    const update = () => {
      if (!ctx || !playerRef.current || !opponentRef.current || !puckRef.current) return;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawGoals(canvas, ctx);
      drawCenterLine(canvas, ctx);
      drawCenterCircle(canvas, ctx);

      // Check if the player collides with the puck
      if (puckRef.current.playerCollisionCheck(playerRef.current)) {
        puckRef.current.playerPenetrationResponse(playerRef.current);
        puckRef.current.playerCollisionResponse(playerRef.current);
      }

      // Calculate puck position
      puckRef.current.calcPosition(canvas.width, canvas.height);

      // Draw players and puck
      playerRef.current.draw(ctx);
      opponentRef.current.draw(ctx);
      puckRef.current.draw(ctx);

      requestAnimationFrame(update);
    };

    // Start the game loop
    update();

    // Clean up event listeners and WebSocket connection when the component unmounts
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchmove', handleTouchMove);

      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width="300" height="600" id="gameCanvas">
        <p>Your browser does not support the canvas element.</p>
      </canvas>
    </div>
  );
};

export default Game;

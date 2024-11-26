import { Server } from "socket.io";
import { GameArea } from "./types/GameArea";
import { GameStates } from "./types/GameState";
import { LobbyStates } from "./types/LobbyState";
import { Puck } from "./Puck";
import { Player } from "./Player";
import { Timers } from "./types/Timers";

const TIME_LIMIT_SEC = 300;

export const GameFunctions = {
    initializeGameState: function(roomId: string, gameStates: GameStates, GAME_AREA: GameArea, lobbyStates: LobbyStates, timers: Timers){
        if (!gameStates[roomId]) {
            const lobbyState = lobbyStates[roomId];
            const puck = new Puck(
              GAME_AREA.width / 2,
              GAME_AREA.height / 2 + 50, //Starts the game on the side of player one
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
    },

    gameOver: function (roomId: string, reason: string, timers: Timers, gameStates: GameStates, lobbyStates: LobbyStates, io: Server){
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
    },

    mainLoop: function(gameStates: GameStates, roomId: string, GAME_AREA: GameArea, timers: Timers, lobbyStates: LobbyStates, io: Server){

        if (!gameStates[roomId]){
            return;
          }
          const state = gameStates[roomId];

          const puck = state.puck;
          const players = state.players;

          puck.update(state, GAME_AREA);

          // Check if socre limit is hit
          if (players[0].score === 5 || players[1].score === 5) {
            this.gameOver(roomId, "Score limit reached!", timers, gameStates, lobbyStates, io);
            return;
          }
    },

    timerLoop: function(gameStates: GameStates, io: Server, roomId: string, timers: Timers, lobbyStates: LobbyStates){
        if (!gameStates[roomId]){
            return;
          }
          const state = gameStates[roomId];

          if (state.timeLeft <= 0) {
            this.gameOver(roomId, "Time's up!", timers, gameStates, lobbyStates, io);
          } else {
            state.timeLeft--;
            io.to(roomId).emit("timer updated", { timeLeft: state.timeLeft });
          }
    }
}
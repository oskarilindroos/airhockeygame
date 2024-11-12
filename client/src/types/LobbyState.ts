export type PlayerReadyStatus={
  [socketId: string]: {isReady: boolean}
}

export type LobbyState = {
  playerReadyStatus: PlayerReadyStatus,
  playerOne: string, // "Host"
  playerTwo: string // "Guest"
}

export type LobbyStates = {
  [roomId: string]: LobbyState
};

export type LobbyState = {
  [socketId: string]: {isReady: boolean}
}

export type LobbyStates = {
  [roomId: string]: LobbyState
};

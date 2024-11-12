import { LobbyState } from "./LobbyState"

export type LobbyContextType = {
    roomId:string,
    playerId:string,
    opponentId: string,
    isReady:boolean,
    isInLobby:boolean,
    lobbyState:LobbyState,
    setLobbyState: React.Dispatch<React.SetStateAction<LobbyState>>,
    setOpponentId: React.Dispatch<React.SetStateAction<string>>,
    setIsInLobby: React.Dispatch<React.SetStateAction<boolean>>,
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>,
    setPlayerId: React.Dispatch<React.SetStateAction<string>>,
    setRoomId: React.Dispatch<React.SetStateAction<string>>
};
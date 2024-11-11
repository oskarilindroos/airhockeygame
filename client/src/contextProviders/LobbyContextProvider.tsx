import { createContext, useState, useContext} from "react"
import { LobbyState } from "../../../server/src/types/LobbyState";
import { LobbyContextType } from "../types/LobbyContextType";

const lobbyContext = createContext<LobbyContextType | undefined>(undefined);

export const LobbyContextProvider = ({children}:{children:React.ReactNode}) => {
    const [lobbyState, setLobbyState] = useState<LobbyState>({playerReadyStatus: {}, playerOne: '', playerTwo: ''});
    const [opponentId, setOpponentId] = useState<string>('');
    const [isInLobby, setIsInLobby] = useState<boolean>(false);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [playerId, setPlayerId] = useState<string>('');
    const [roomId, setRoomId] = useState<string>('');

    return(
        <lobbyContext.Provider value={{lobbyState, opponentId, isInLobby, isReady, playerId, roomId, setLobbyState,
            setOpponentId,
            setIsInLobby,
            setIsReady,
            setPlayerId,
            setRoomId,}}>
            {children}
        </lobbyContext.Provider>
    )
}

export const UseLobbyContext = () => {
    const context = useContext(lobbyContext);
    if (!context) {
      throw new Error("useLobbyContext must be used within a LobbyContextProvider");
    }
    return context;
  };
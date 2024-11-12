import { UseLobbyContext } from '../contextProviders/LobbyContextProvider';
import '../Lobby.css'
import { useEffect, useState } from 'react';



const Lobby = (
    {exitLobby, toggleReady, startGame}:{exitLobby: () => void, toggleReady: () => void, startGame: () => void}
) =>{
    const {lobbyState, opponentId, isReady, roomId,} = UseLobbyContext();
    const [opponentReady, setOpponentReady] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState(false)

    const handleCopyRoomId = () => {
        navigator.clipboard.writeText(roomId)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      }

    useEffect(() =>{
        if (opponentId !== ''){
            setOpponentReady(lobbyState.playerReadyStatus[opponentId].isReady);
        } else {
            setOpponentReady(false);
        }
    },
    [lobbyState, opponentId]);

    return(
        <div className="screen-container">
            <div className="lobby-container">
                <div className="header-container">
                    <h2 className="header-title">Game Lobby</h2>
                    <div className="room-id-container">
                        <span className="room-id">Room ID: {roomId}</span>
                        <button className="button button-blue" onClick={handleCopyRoomId}>
                            {isCopied ? <span>Copied!</span> : <span>Copy</span>}
                        </button>
                    </div>
                </div>

                <div className="player-list">

                    <div className="player-item">
                        <span className="player-name">You</span>
                        <span className={`status-text ${isReady ? 'status-ready' : 'status-not-ready'}`}
                        >
                            {`${isReady ? 'Ready ✅' : 'Not Ready ❌'}`}
                        </span>
                    </div>

                    {opponentId !== '' ?
                        <div className="player-item">
                            <span className="player-name">Opponent</span>
                            <span className={`status-text ${opponentReady ? 'status-ready' : 'status-not-ready'}`}
                            >
                                {`${opponentReady ? 'Ready ✅' : 'Not Ready ❌'}`}
                            </span>
                        </div>
                        :
                        <></>
                    }

                </div>

                <div className="footer-container">
                    <button
                    className="button button-red"
                    onClick={exitLobby}
                    >
                    Leave Lobby
                    </button>

                    <button
                    className={`button ${isReady ? 'button-yellow' : 'button-green'}`}
                    onClick={toggleReady}
                    >
                    {isReady ? 'Cancel Ready' : 'Ready Up'}
                    </button>

                    <button
                    className="button button-green"
                    onClick={startGame}
                    disabled={!(isReady && opponentReady)}
                    >
                    Start game
                    </button>
                </div>
            </div>
        </div>
      );
}

export default Lobby;
import { UseLobbyContext } from '../contextProviders/LobbyContextProvider';
import '../App.css'
import { useEffect, useState } from 'react';



const Lobby = (
    {exitLobby, toggleReady, startGame}:{exitLobby: () => void, toggleReady: () => void, startGame: () => void}
) =>{
    const {lobbyState, opponentId, isReady, roomId,} = UseLobbyContext();
    const [opponentReady, setOpponentReady] = useState<boolean>(false);

    useEffect(() =>{
        if (opponentId !== ''){
            setOpponentReady(lobbyState.playerReadyStatus[opponentId].isReady);
        } else {
            setOpponentReady(false);
        }
    },
    [lobbyState, opponentId]);

    return(
        <div className="bodyReact">
            <div className="app">
                <div>
                    <h2 className="text-3xl font-bold text-blue-400">Game Lobby</h2>
                    <p>Room ID: {roomId}</p>
                </div>

                <div className="space-y-4 mb-6">

                    <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                        <span className="text-xl text-white">{`You: ${isReady ? 'Ready' : 'Not Ready'}`}</span>
                    </div>

                    {opponentId !== '' ?
                        <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                            <span className="text-xl text-white">{`Opponent: ${opponentReady ? 'Ready' : 'Not Ready'}`}</span>
                        </div>
                        :
                        <></>
                    }

                </div>

                <div className="flex justify-between">
                    <button
                    className="dynamic-button"
                    id='exitLobby'
                    onClick={exitLobby}
                    >
                    Leave Lobby
                    </button>

                    <button
                    className="dynamic-button"
                    id='toggleReady'
                    onClick={toggleReady}
                    >
                    {isReady ? 'Cancel Ready' : 'Ready Up'}
                    </button>

                    <button
                    className="dynamic-button"
                    id='startGame'
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
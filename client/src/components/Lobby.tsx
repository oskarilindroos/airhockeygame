import { UseLobbyContext } from '../contextProviders/LobbyContextProvider';
import '../App.css'



const Lobby = (
    {exitLobby, toggleReady}:{exitLobby: () => void, toggleReady: () => void}
) =>{
    const {lobbyState, opponentId, isReady, roomId,} = UseLobbyContext();
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
                            <span className="text-xl text-white">{`Opponent: ${lobbyState.playerReadyStatus[opponentId].isReady ? 'Ready' : 'Not Ready'}`}</span>
                        </div>
                        :
                        <></>
                    }

                </div>

                <div className="flex justify-between">
                    <button
                    className="dynamic-button"
                    style={{backgroundColor:" #ff5722"}}
                    onClick={exitLobby}
                    >
                    Leave Lobby
                    </button>

                    <button
                    className="dynamic-button"
                    style={{backgroundColor:"#3f51b5"}}
                    onClick={toggleReady}
                    >
                    {isReady ? 'Cancel Ready' : 'Ready Up'}
                    </button>
                </div>
            </div>
        </div>
      );
}

export default Lobby;
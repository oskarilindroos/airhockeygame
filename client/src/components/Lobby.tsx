import '../App.css'

type Props = {
    roomId:string,
    readyStatus:boolean[],
    toggleReady: () => void,
    exitLobby: () => void
}


const Lobby = ( {roomId, readyStatus ,toggleReady, exitLobby}: Props) =>{
    return(
        <div className="bodyReact">
            <div className="app">
                <div>
                    <h2 className="text-3xl font-bold text-blue-400">Game Lobby</h2>
                    <p>Room ID: {roomId}</p>
                </div>

                <div className="space-y-4 mb-6">
                    {readyStatus?.map((isReady, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                        <span className="text-xl text-white">{`Player ${i + 1}: ${isReady ? 'Ready' : 'Not Ready'}`}</span>
                    </div>
                    ))}
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
                    {readyStatus[0] ? 'Cancel Ready' : 'Ready Up'}
                    </button>
                </div>
            </div>
        </div>
      );
}

export default Lobby;
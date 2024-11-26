import "../MainMenu.css";

interface MainMenuProps {
  onCreateLobby: () => void;
  onJoinLobby: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onJoinLobby, onCreateLobby }) => {
  return (
    <div className="game-container">
      <div className="game-menu">
        <div className="game-title">
          <h1>Air Hockey</h1>
        </div>
        <div className="button-container">
          <button
            className="game-button create-room-button"
            onClick={onCreateLobby}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v8"></path>
              <path d="M8 12h8"></path>
            </svg>
            <span>Create a Lobby</span>
          </button>

          <button
            className="game-button join-room-button"
            onClick={onJoinLobby}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Join a Lobby</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;

import "../JoinLobbyModal.css";

interface JoinLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: () => void;
  inviteLink: string;
  setInviteLink: (link: string) => void;
}

const JoinLobbyModal: React.FC<JoinLobbyModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  inviteLink,
  setInviteLink,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Join a Lobby</h2>
        <p className="modal-description">
          Enter the room ID to join an existing game room.
        </p>
        <input
          type="text"
          placeholder="Paste invite link here"
          value={inviteLink}
          onChange={(e) => setInviteLink(e.target.value)}
          className="modal-input"
        />
        <div className="modal-buttons">
          <button onClick={onClose} className="modal-button cancel-button">
            Cancel
          </button>
          <button
            onClick={onJoin}
            disabled={!inviteLink}
            className="modal-button join-button"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinLobbyModal;

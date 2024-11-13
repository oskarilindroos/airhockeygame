import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { GameState } from '../types/GameState';

type Props = {
    open:boolean,
    gameState: GameState|null
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const PostGameScreen = ({open, gameState}:Props) => {
    const playerOneScore = gameState?.players[0].score;
    const playerTwoScore = gameState?.players[1].score;

  return (
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            GAME OVER
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {`${playerOneScore ?? 0} - ${playerTwoScore ?? 0}`}
          </Typography>
        </Box>
      </Modal>
  );
}

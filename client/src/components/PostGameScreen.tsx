import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { GameState } from '../types/GameState';
import { useEffect, useState } from 'react';

type Props = {
    open:boolean,
    gameState: GameState|null,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
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

export const PostGameScreen = ({open, gameState, setOpen}:Props) => {
    const playerOneScore = gameState?.players[0].score;
    const playerTwoScore = gameState?.players[1].score;

    const INITIAL_COUNTDOWN = 5

    const [countdown, setCountdown] = useState<number>(INITIAL_COUNTDOWN);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setOpen(false);
        }
    }, [countdown, setOpen]);


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
          <Typography sx={{ mt: 2 }}>
            {`${playerOneScore ?? 0} - ${playerTwoScore ?? 0}`}
          </Typography>
          <Typography>
            Returning to lobby in: {countdown}
          </Typography>
        </Box>
      </Modal>
  );
}

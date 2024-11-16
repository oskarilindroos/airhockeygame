import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { GameState } from '../types/GameState';
import { useEffect, useState } from 'react';


type Props = {
    open:boolean,
    gameState: GameState|null,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    isPlayerOne: boolean
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  backgroundImage: 'linear-gradient(135deg, rgba(40, 0, 77,0.75), rgba(40, 0, 77,1))',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
  color: '#ffffff'
};

const INITIAL_COUNTDOWN = 5

export const PostGameScreen = ({open, gameState, setOpen, isPlayerOne}:Props) => {
    const playerOneScore = gameState?.players[0].score ?? 0;
    const playerTwoScore = gameState?.players[1].score ?? 0;

    let result = '';

    let scoreDifference = playerOneScore - playerTwoScore;
    if (!isPlayerOne){
        scoreDifference *= -1
    }

    let resultTextColor :string;

    if (scoreDifference > 0){
        result = 'YOU WON!';
        resultTextColor = '#009933';
    } else if (scoreDifference < 0 ){
        result = 'YOU LOST!';
        resultTextColor = '#ff0000';
    } else {
        result = 'DRAW!';
        resultTextColor = '#ffffff';
    }

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
      >
        <Box sx={style}>
          <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold' }}>
            GAME OVER
          </Typography>
          <Typography variant="h4" sx={{ my: 2, color: resultTextColor, fontWeight: 'bold' }}>
            {result}
          </Typography>
          <Typography variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>
            {`${isPlayerOne? playerOneScore : playerTwoScore}
             -
             ${isPlayerOne? playerTwoScore : playerOneScore}`}
          </Typography>
          <Typography>
            <Typography variant='h5'>Returning to lobby in:</Typography>
            <Typography variant='h5'>{countdown}</Typography>
          </Typography>
        </Box>
      </Modal>
  );
}

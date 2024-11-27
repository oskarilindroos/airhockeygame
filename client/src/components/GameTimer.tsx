import React from 'react';
import './GameTimer.css';

interface GameTimerProps {
  timerDisplay: string;
  ownScore: number,
  oppnentScore: number
}

const GameTimer: React.FC<GameTimerProps> = ({ timerDisplay, ownScore, oppnentScore }) => {
  return <div className='timer-container'>
    <h2 className='score-display own-score'>{ownScore}</h2>
    <h2 id="gameTimer">{timerDisplay}</h2>
    <h2 className='score-display opponent-score'>{oppnentScore}</h2>
  </div>
};

export default GameTimer;

import React from 'react';
import './GameTimer.css';

interface GameTimerProps {
  timerDisplay: string;
}

const GameTimer: React.FC<GameTimerProps> = ({ timerDisplay }) => {
  return <h2 id="gameTimer">{timerDisplay}</h2>;
};

export default GameTimer;

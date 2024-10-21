// src/MainMenu.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainMenu.css'; // Import your CSS file

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="main-menu">
      <h1 className="title">Welcome to Airhockey</h1>
      <div className="button-container">
        <button className="menu-button" onClick={() => navigate('/host')}>
          Host a Game
        </button>
        <button className="menu-button" onClick={() => navigate('/join')}>
          Join a Game
        </button>
      </div>
    </div>
  );
};

export default MainMenu;

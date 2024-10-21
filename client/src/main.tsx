// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './MainMenu';
import Game from './Game';

// Create a root container to use the new React 18 API
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/host" element={<Game />} />
        <Route path="/join" element={<Game />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

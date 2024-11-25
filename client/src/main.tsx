import { createRoot } from 'react-dom/client'
import { LobbyContextProvider } from './contextProviders/LobbyContextProvider.tsx'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <LobbyContextProvider>
      <App />
    </LobbyContextProvider>,
)

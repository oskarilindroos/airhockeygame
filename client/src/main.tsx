import { createRoot } from 'react-dom/client'
import { LobbyContextProvider } from './contextProviders/LobbyContextProvider.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <LobbyContextProvider>
      <App />
    </LobbyContextProvider>,
)

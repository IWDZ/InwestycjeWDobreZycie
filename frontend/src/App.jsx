import { useState } from 'react'
import './style/lobby.css'
import "./services/socket.ts"
import { LobbyService } from './components/LobbyService.tsx';

export default function App() {
  const [lobbyServiceOpen, setLobbyServiceOpen] = useState(true);

  return (
    <>
      {lobbyServiceOpen && (
        <LobbyService></LobbyService>
      )}
    </>
  )
}
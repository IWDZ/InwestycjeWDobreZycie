import { useEffect, useState } from 'react'
import './style/lobby.css'
import './style/error.css'
import './style/room.css'
import './style/game.css'
import { LobbyService } from './components/LobbyService.tsx';
import { useRef } from "react";
import { ErrorNotif, ErrorNotifRef } from "./components/ErrorNotif";
import { GameService } from './components/GameService.tsx';

export const errorNotif = { current: null as ErrorNotifRef | null };

export default function App() {
  const [lobbyServiceOpen, setLobbyServiceOpen] = useState(true);
  const [gameServiceOpen, setGameServiceOpen] = useState(false);
  const [shouldStartGame, setShouldStartGame] = useState(false)
  const ref = useRef<ErrorNotifRef>(null);

  function onStart() {
    setLobbyServiceOpen(false)
    setGameServiceOpen(true)
    setShouldStartGame(true)
  }

  function onFinish() { }

  useEffect(() => {
    errorNotif.current = ref.current;
  }, []);


  return (
    <>
      <ErrorNotif ref={ref} />
      {lobbyServiceOpen && (
        <LobbyService onStart={onStart} onFinish={onFinish}></LobbyService>
      )}
      {gameServiceOpen && (
        <GameService shouldStart={shouldStartGame} />
      )}
    </>
  )
}
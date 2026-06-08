import { useEffect, useState } from 'react'
import './style/lobby.css'
import './style/error.css'
import './style/room.css'
import './style/game.css'
import { LobbyService, LobbyServiceRef } from './components/LobbyService.tsx';
import { useRef } from "react";
import { ErrorNotif, ErrorNotifRef } from "./components/ErrorNotif";
import { GameService } from './components/GameService.tsx';
import { loadingScreen, LoadingScreen, LoadingScreenRef } from './components/LoadingScreen.tsx';
import { GameEnd } from './components/GameEnd.tsx';

export const errorNotif = { current: null as ErrorNotifRef | null };

type AppState = "lobby" | "game" | "gamend";

export default function App() {
  const [appState, setAppState] = useState<AppState>("lobby");
  
  const loadingRef = useRef<LoadingScreenRef>(null);
  const ref = useRef<ErrorNotifRef>(null);
  const lobbyRef = useRef<LobbyServiceRef>(null);

  useEffect(() => {
    errorNotif.current = ref.current;
    loadingScreen.current = loadingRef.current;
  }, []);

  function onStart() {
    setAppState("game");
  }

  function onGameEnd() {
    setAppState("gamend");
  }

  function onBackToLobby() {
    lobbyRef.current?.reset();
    setAppState("lobby");
  }

  return (
    <>
      <ErrorNotif ref={ref} />
      {appState === "lobby" && (
        <LobbyService ref={lobbyRef} onStart={onStart} onFinish={onBackToLobby} />
      )}
      {appState === "game" && (
        <GameService shouldStart={true} onGameEnd={onGameEnd} />
      )}
      {appState === "gamend" && (
        <GameEnd onBackToLobby={onBackToLobby} />
      )}
      <LoadingScreen ref={loadingRef} onClick={onBackToLobby} />
    </>
  );
}
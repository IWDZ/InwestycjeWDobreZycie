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
import { subscribeError } from './services/ErrorToast.ts'

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

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    return subscribeError(setErrorMessage);
  }, []);

  return (
    <>
      {errorMessage && (
        <div className="global-error-message">{errorMessage}</div>
      )}
      {infoMessage && (
        <div className="global-info-message">{infoMessage}</div>
      )}
      <ErrorNotif ref={ref} />
      {appState === "lobby" && (
        <LobbyService ref={lobbyRef} onStart={onStart} onFinish={onBackToLobby} />
      )}
      {appState === "game" && (
        <GameService shouldStart={true} onGameEnd={onGameEnd} />
      )}
      {appState === "gamend" && (
        <GameEnd onBackToLobby={onBackToLobby} isNuked={false} />
      )}
      <LoadingScreen ref={loadingRef} onClick={onBackToLobby} />
    </>
  );
}
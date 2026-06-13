import { useEffect, useState } from "react";
import "./style/lobby.css";
import "./style/error.css";
import "./style/room.css";
import "./style/game.css";
import { LobbyService, LobbyServiceRef } from "./components/LobbyService.tsx";
import { useRef } from "react";
import { GameService } from "./components/GameService.tsx";
import {
  loadingScreen,
  LoadingScreen,
  LoadingScreenRef,
} from "./components/LoadingScreen.tsx";
import { GameEnd } from "./components/GameEnd.tsx";
import { subscribe, Notification } from "./services/ErrorManager.ts";
import TestMenu from "./components/TestMenu.tsx";

type AppState = "lobby" | "game" | "gamend";

export default function App() {
  const [appState, setAppState] = useState<AppState>("lobby");

  const loadingRef = useRef<LoadingScreenRef>(null);
  const lobbyRef = useRef<LobbyServiceRef>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadingScreen.current = loadingRef.current;
  }, []);

  function onStart() {
    setAppState("game");
  }

  function onGameEnd() {
    setAppState("gamend");
  }

  function handleNotifs(notifs: Notification[]) {
    console.log("handleNotifs()")
    setNotifications(notifs);
  }

  function onBackToLobby() {
    lobbyRef.current?.reset();
    setAppState("lobby");
  }

  useEffect(() => {
    return subscribe(handleNotifs);
  }, []);

  return (
    <>
      <div className="toast-container">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={
              notif.type == "error"
                ? "global-error-message"
                : "global-info-message"
            }
          >
            {notif.message}
          </div>
        ))}
      </div>

      {appState === "lobby" && (
        <LobbyService
          ref={lobbyRef}
          onStart={onStart}
          onFinish={onBackToLobby}
        />
      )}
      {appState === "game" && (
        <>
          <GameService shouldStart={true} onGameEnd={onGameEnd} />
          {import.meta.env.VITE_MODE === "test" && <TestMenu/>}
        </>
      )}
      {appState === "gamend" && (
        <GameEnd onBackToLobby={onBackToLobby} isNuked={false} />
      )}
      <LoadingScreen ref={loadingRef} onClick={onBackToLobby} />
    </>
  );
}

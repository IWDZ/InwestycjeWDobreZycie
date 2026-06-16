import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { RoomService } from "./RoomService";
import { RoomManager } from "../services/RoomManager";

import { soundManager } from "../services/SoundManager";
import { showError } from "../services/ErrorManager";
import { locale, useLocale } from "../locale/Locale";
import { en } from "../locale/strings/en";
import { pl } from "../locale/strings/pl";
import { jp } from "../locale/strings/jp";

import { faGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClientSettings } from "./ClientSettings";

export const roomManager = new RoomManager();

interface MainMenuServiceProps {
  onStart: () => void;
  onFinish: () => void;
}

export interface MainMenuServiceRef {
  reset: () => void;
}

export const MainMenuService = forwardRef<MainMenuServiceRef, MainMenuServiceProps>(
  ({ onStart, onFinish }, ref) => {
    const l = useLocale();

    const [createOpen, setCreateOpen] = useState(false);
    const [createRoomButtonActive, setCreateRoomButtonActive] = useState(true);
    const [joinRoomButtonActive, setJoinRoomButtonActive] = useState(true);
    const [joinOpen, setJoinOpen] = useState(false);
    const [roomStatusOpen, setRoomStatusOpen] = useState(false);
    const [username, setUsername] = useState(import.meta.env.VITE_MODE === "test" ? "test" : "");
    const [maxPlayers, setMaxPlayers] = useState(import.meta.env.VITE_MODE === "test" ? 1 : 2);
    const [joinCode, setJoinCode] = useState("");
    const [modalOpen, setModalOpen] = useState(true);
    
    const [settingsOpen, setSettingsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      reset,
    }));

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closeTopModal();
        }
      };
    
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [settingsOpen, createOpen, joinOpen, roomStatusOpen]);

    function reset() {
      setCreateOpen(false);
      setJoinOpen(false);
      leaveRoom();
    }

    function leaveRoom() {
      setModalOpen(true);
      setRoomStatusOpen(false);
      setJoinRoomButtonActive(true);
      setCreateRoomButtonActive(true);
    }

    function closeTopModal() {
      if (settingsOpen) return setSettingsOpen(false);
      if (createOpen) return setCreateOpen(false);
      if (joinOpen) return setJoinOpen(false);
    }

    async function createRoom() {
      setCreateRoomButtonActive(false);
      const result = await roomManager.createRoom(username, maxPlayers);
      if (result.ok) {
        setRoomStatusOpen(true);
        soundManager.play("joinroom");
        setCreateOpen(false);
        setModalOpen(false);
        roomManager.username = username;
      } else {
        showError(result.error);
        setCreateRoomButtonActive(true);
      }
    }

    async function joinRoom() {
      setJoinRoomButtonActive(false);
      const result = await roomManager.joinRoom(username, joinCode);
      if (result.ok) {
        setRoomStatusOpen(true);
        setJoinOpen(false);
        setModalOpen(false);
        roomManager.username = username;
      } else {
        showError(result.error);
        setJoinRoomButtonActive(true);
      }
    }

    return (
      <>
        {modalOpen && (
          <div className="modal">
            <h1>IWDŻ</h1>
            <p>{l.t("mainmenu.subtitle")}</p>
            <div className="btn-container">
              <button
                className="btn-create"
                onClick={() => setCreateOpen(true)}
              >
                {l.t("mainmenu.creategame")}
              </button>
              <button className="btn-join" onClick={() => setJoinOpen(true)}>
                {l.t("mainmenu.joingame")}
              </button>
            </div>
            <div className="client-settings-button-modal">
              <p className="client-settings-button" onClick={() => setSettingsOpen(true)}><FontAwesomeIcon icon={faGear}/></p>
            </div>
          </div>
        )}

        {createOpen && (
          <div className="dialog-overlay active">
            <div className="dialog-box">
              <h2>{l.t("mainmenu.creategame")}</h2>
              <input
                type="text"
                placeholder={l.t("mainmenu.playername")}
                maxLength={20}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="number"
                placeholder={l.t("mainmenu.playercount")}
                min={2}
                max={6}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
              />
              <div className="dialog-buttons">
                <button
                  className="btn-confirm"
                  disabled={!createRoomButtonActive}
                  onClick={async () => await createRoom()}
                >
                  {" "}
                  {createRoomButtonActive
                    ? l.t("mainmenu.create")
                    : l.t("mainmenu.creating")}
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setCreateOpen(false)}
                >
                  {l.t("ui.cancel")}
                </button>
              </div>
            </div>
          </div>
        )}

        {roomStatusOpen && (
          <RoomService onLeave={leaveRoom} onStart={onStart}></RoomService>
        )}

        {settingsOpen && (
          <ClientSettings onClose={() => setSettingsOpen(false)}/>
        )}

        {joinOpen && (
          <div className="dialog-overlay active">
            <div className="dialog-box">
              <h2>{l.t("mainmenu.joingame")}</h2>
              <input
                type="text"
                placeholder={l.t("mainmenu.playername")}
                maxLength={20}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="text"
                placeholder={l.t("mainmenu.gamecode")}
                maxLength={10}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />
              <div className="dialog-buttons">
                <button
                  className="btn-confirm"
                  disabled={!joinRoomButtonActive}
                  onClick={async () => await joinRoom()}
                >
                  {joinRoomButtonActive
                    ? l.t("mainmenu.join")
                    : l.t("mainmenu.joining")}
                </button>
                <button
                  className="btn-cancel"
                  style={{ width: "100%" }}
                  onClick={() => setJoinOpen(false)}
                >
                  {l.t("ui.cancel")}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);

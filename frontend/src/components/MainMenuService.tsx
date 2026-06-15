import { forwardRef, useImperativeHandle, useState } from "react";
import { RoomService } from "./RoomService";
import { RoomManager } from "../services/RoomManager";

import { soundManager } from "../services/SoundManager";
import { showError } from "../services/ErrorManager";
import { locale, LocaleName, useLocale } from "../locale/Locale";
import { en } from "../locale/strings/en";
import { pl } from "../locale/strings/pl";
import { jp } from "../locale/strings/jp";

export const roomManager = new RoomManager();

interface MainMenuServiceProps {
  onStart: () => void;
  onFinish: () => void;
}

export interface MainMenuServiceRef {
  reset: () => void;
}

const LOCALES: LocaleName[] = ["en", "pl", "jp"];
const LABELS: Record<LocaleName, string> = { en: "EN", pl: "PL", jp: "JP" };

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
    
    const [open, setOpen] = useState(false);
    const current = LOCALES.find(loc => locale.strings === ({ en, pl, jp } as any)[loc]) ?? "en";

    useImperativeHandle(ref, () => ({
      reset,
    }));

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
            <div style={{ position: "relative", left: -24, bottom: -24}}>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <button
                  onClick={() => setOpen(o => !o)}
                  style={{
                    padding: "3px 8px",
                    fontSize: "0.7rem",
                    border: "1px solid #ddd",
                    borderRadius: 4,
                    background: "#fff",
                    color: "#333",
                    cursor: "pointer",
                  }}
                >
                  🌐 {current.toUpperCase()}
                </button>
                {open && LOCALES.map(loc => (
                  <button
                    key={loc}
                    onClick={() => { locale.setLocale(loc); setOpen(false); }}
                    style={{
                      padding: "3px 7px",
                      fontSize: "0.7rem",
                      fontWeight: current === loc ? 700 : 400,
                      opacity: current === loc ? 1 : 0.4,
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      background: "#fff",
                      color: "#333",
                      cursor: "pointer",
                    }}
                  >
                    {LABELS[loc]}
                  </button>
                ))}
              </div>
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

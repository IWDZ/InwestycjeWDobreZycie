import { forwardRef, useImperativeHandle, useState } from "react";
import { RoomService } from "./RoomService";
import { RoomManager } from "../services/RoomManager";

import { soundManager } from "../services/SoundManager";
import { showError } from "../services/ErrorManager";

export const roomManager = new RoomManager();

interface LobbyServiceProps {
  onStart: () => void;
  onFinish: () => void;
}

export interface LobbyServiceRef {
  reset: () => void;
}

export const LobbyService = forwardRef<LobbyServiceRef, LobbyServiceProps>(
  ({ onStart, onFinish }, ref) => {
    const [createOpen, setCreateOpen] = useState(false);
    const [createRoomButtonActive, setCreateRoomButtonActive] = useState(true);
    const [joinRoomButtonActive, setJoinRoomButtonActive] = useState(true);
    const [joinOpen, setJoinOpen] = useState(false);
    const [roomStatusOpen, setRoomStatusOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [maxPlayers, setMaxPlayers] = useState(2);
    const [joinCode, setJoinCode] = useState("");
    const [modalOpen, setModalOpen] = useState(true);

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
        soundManager.play('joinroom')
        setCreateOpen(false);
        setModalOpen(false);
        roomManager.username = username;
      } else {
        console.error(
          "Wystąpił błąd w tworzeniu pokoju: " + result.error + "\n",
        );
        showError(result.error)
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
        console.error(
          "Wystąpił błąd w dołączaniu do pokoju: " + result.error + "\n",
        );
        showError(result.error)
        setJoinRoomButtonActive(true);
      }
    }

    return (
      <>
        {modalOpen && (
          <div className="modal">
            <h1>IWDŻ</h1>
            <p>Dołącz do gry lub stwórz nową rozgrywkę</p>
            <div className="btn-container">
              <button
                className="btn-create"
                onClick={() => setCreateOpen(true)}
              >
                Stwórz grę
              </button>
              <button className="btn-join" onClick={() => setJoinOpen(true)}>
                Dołącz do gry
              </button>
            </div>
          </div>
        )}

        {createOpen && (
          <div className="dialog-overlay active">
            <div className="dialog-box">
              <h2>Stwórz nową grę</h2>
              <input
                type="text"
                placeholder="Imie gracza"
                maxLength={20}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="number"
                placeholder="Ilość graczy (2-6)"
                min={2}
                max={6}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
              />
              <div className="dialog-buttons">
                <button
                  className="btn-confirm"
                  disabled={!createRoomButtonActive}
                  onClick={async () => await createRoom()}
                >
                  {" "}
                  {createRoomButtonActive ? "Stwórz" : "Tworzenie..."}
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setCreateOpen(false)}
                >
                  Anuluj
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
              <h2>Dołącz do gry</h2>
              <input
                type="text"
                placeholder="Imie gracza"
                maxLength={20}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="text"
                placeholder="Kod gry"
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
                  {joinRoomButtonActive ? "Dołącz" : "Dołączanie"}
                </button>
                <button
                  className="btn-cancel"
                  style={{ width: "100%" }}
                  onClick={() => setJoinOpen(false)}
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);

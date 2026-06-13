import { useEffect, useState } from "react";
import { roomManager } from "./LobbyService";
import { soundManager } from "../services/SoundManager";
import { showError } from "../services/ErrorManager";
import { RoomSettings } from "../services/RoomManager";
import { useLocale } from "../locale/Locale";

interface RoomServiceProps {
  onLeave: () => void;
  onStart: () => void;
}

export function RoomService({ onLeave, onStart }: RoomServiceProps) {
  const l = useLocale();
  
  const [players, setPlayers] = useState<{ name: string; isHost: boolean }[]>(
    [],
  );
  const [isInRoom, setIsInRoom] = useState(roomManager.isInRoom);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<RoomSettings>({
    populationPoolPercent: 60,
    marketVolatilityPercent: 1,
    gameDurationTicks: 240,
  });

  async function startGame() {
    roomManager.updateSettings(settings)
    const response = await roomManager.startGame();
    if (!response.ok) {
      showError(response.error);
    } else {
      onStart();
    }
  }

  async function leaveRoom() {
    const response = await roomManager.leaveRoom();
    if (!response.ok) {
      showError(response.error);
    } else {
      onLeave();
    }
  }

  useEffect(() => {
    setPlayers(roomManager.getPlayers());
    roomManager.onRoomJoined = () => {
      setIsInRoom(true);
      soundManager.play("joinroom");
      setPlayers(roomManager.getPlayers());
    };
    roomManager.onRoomLeft = () => {
      setIsInRoom(false);
      setPlayers([]);
      onLeave();
    };
    roomManager.onPlayersChanged = () => {
      setPlayers(roomManager.getPlayers());
    };
    roomManager.onGameStart = () => onStart();
  }, []);

  const playerSlots = Array.from({ length: 6 }, (_, i) => players[i] ?? null);

  return (
    <>
      {isInRoom && (
        <div className="room-modal">
          <div className="room-header">
            <h1 className="room-title">{l.t("room.room")}</h1>
            <div className="room-id-badge">
              <span className="room-id-label">ID</span>
              <span className="room-id-value">{roomManager.roomId}</span>
            </div>
          </div>

          <div className="player-grid">
            {playerSlots.map((plr, i) =>
              plr ? (
                <div
                  key={i}
                  className={`player-slot occupied${plr.isHost ? " host" : ""}`}
                >
                  <div className="player-avatar">
                    {plr.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="player-name">{plr.name}</span>
                  {plr.isHost && <span className="host-badge">Host</span>}
                </div>
              ) : (
                <div key={i} className="player-slot empty">
                  <div className="player-avatar empty-avatar">?</div>
                  <span className="player-name empty-name">{l.t("room.awaiting")}</span>
                </div>
              ),
            )}
          </div>

          {roomManager.isHost && (
            <div className="settings-section">
              <button
                className="settings-toggle"
                onClick={() => setSettingsOpen((v) => !v)}
              >
                <span>{l.t("room.settings")}</span>
                <span
                  className={`settings-arrow${settingsOpen ? " open" : ""}`}
                >
                  ▼
                </span>
              </button>

              {settingsOpen && (
                <div className="settings-panel">
                  <div className="setting-row">
                    <div className="setting-label-group">
                      <label>{l.t("room.settings.population")}</label>
                      <div className="tooltip-wrapper">
                        <span className="info-icon">ℹ</span>
                        <div className="tooltip-box">
                          {l.t("room.settings.population.info")}
                        </div>
                      </div>
                    </div>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={settings.populationPoolPercent}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          populationPoolPercent: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="setting-row">
                    <div className="setting-label-group">
                      <label>{l.t("room.settings.market")}</label>
                      <div className="tooltip-wrapper">
                        <span className="info-icon">ℹ</span>
                        <div className="tooltip-box">
                          {l.t("room.settings.market.info")}
                        </div>
                      </div>
                    </div>
                    <input
                      type="number"
                      min={0.5}
                      max={5}
                      value={settings.marketVolatilityPercent}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          marketVolatilityPercent: parseFloat(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="setting-row">
                    <div className="setting-label-group">
                      <label>{l.t("room.settings.tick")}</label>
                      <div className="tooltip-wrapper">
                        <span className="info-icon">ℹ</span>
                        <div className="tooltip-box">
                          {l.t("room.settings.tick.info")}
                        </div>
                      </div>
                    </div>
                    <input
                      type="number"
                      min={120}
                      max={600}
                      value={settings.gameDurationTicks}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          gameDurationTicks: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <button className="btn-update">{l.t("ui.update")}</button>
                </div>
              )}
            </div>
          )}

          <div className="room-actions">
            {roomManager.isHost && (
              <button
                className="btn-start"
                onClick={async () => await startGame()}
              >
                {l.t("room.startgame")}
              </button>
            )}
            <button
              className="btn-leave"
              onClick={async () => await leaveRoom()}
            >
              {l.t("ui.leave")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

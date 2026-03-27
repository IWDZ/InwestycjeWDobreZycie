import React, { useEffect, useState } from "react";
import { roomManager, showError } from "./LobbyService";

interface RoomServiceProps {
    onLeave: () => void;
}

interface GameSettings {
    popularityPool: number;
}

export function RoomService({ onLeave }: RoomServiceProps) {
    const [players, setPlayers] = useState<{ name: string; isHost: boolean }[]>([]);
    const [isInRoom, setIsInRoom] = useState(roomManager.isInRoom);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<GameSettings>({
        popularityPool: 100,
    });

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
            setPlayers(roomManager.getPlayers());
        };
        roomManager.onRoomLeft = () => {
            setIsInRoom(false);
            setPlayers([]);
        };
    }, []);

    const playerSlots = Array.from({ length: 6 }, (_, i) => players[i] ?? null);

    return (
        <>
            {isInRoom && (
                <div className="room-modal">
                    <div className="room-header">
                        <h1 className="room-title">Pokój</h1>
                        <div className="room-id-badge">
                            <span className="room-id-label">ID</span>
                            <span className="room-id-value">{roomManager.roomId}</span>
                        </div>
                    </div>

                    <div className="player-grid">
                        {playerSlots.map((plr, i) =>
                            plr ? (
                                <div key={i} className={`player-slot occupied${plr.isHost ? " host" : ""}`}>
                                    <div className="player-avatar">{plr.name.charAt(0).toUpperCase()}</div>
                                    <span className="player-name">{plr.name}</span>
                                    {plr.isHost && <span className="host-badge">Host</span>}
                                </div>
                            ) : (
                                <div key={i} className="player-slot empty">
                                    <div className="player-avatar empty-avatar">?</div>
                                    <span className="player-name empty-name">Oczekiwanie...</span>
                                </div>
                            )
                        )}
                    </div>

                    {roomManager.isHost && (
                        <div className="settings-section">
                            <button
                                className="settings-toggle"
                                onClick={() => setSettingsOpen((v) => !v)}
                            >
                                <span>Ustawienia gry</span>
                                <span className={`settings-arrow${settingsOpen ? " open" : ""}`}>▼</span>
                            </button>

                            {settingsOpen && (
                                <div className="settings-panel">
                                    <div className="setting-row">
                                        <div className="setting-label-group">
                                            <label>Procentowa pula ludności</label>
                                            <div className="tooltip-wrapper">
                                                <span className="info-icon">ℹ</span>
                                                <div className="tooltip-box">
                                                    Określa jaki procent całkowitej populacji bierze udział w rozgrywce.
                                                    Niższa wartość = trudniejsza gra.
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type="number"
                                            min={10}
                                            max={100}
                                            value={settings.popularityPool}
                                            onChange={(e) =>
                                                setSettings((s) => ({ ...s, popularityPool: Number(e.target.value) }))
                                            }
                                        />
                                    </div>
                                    <button className="btn-update">Zaktualizuj</button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="room-actions">
                        {roomManager.isHost && (
                            <button className="btn-start" onClick={() => { }}>
                                Zacznij grę
                            </button>
                        )}
                        <button className="btn-leave" onClick={async () => await leaveRoom()}>
                            Wyjdź
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
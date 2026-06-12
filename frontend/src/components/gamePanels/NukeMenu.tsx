import { useState } from "react";
import { RoomManager } from "../../services/RoomManager";
import { getMaterialColor, getMaterialName, Materials } from "../../services/game/statics/Materials";
import { ws } from "../../services/WebsocketManager";
import { NukeExplosionAnimation, NukeLaunchAnimation } from "./NukeAnimation"

const NUKE_COST_MATERIALS: Partial<Record<Materials, number>> = {
    [Materials.Uranium]: 750,
    [Materials.Steel]: 350,
    [Materials.Coal]: 250,
};
const NUKE_COST_MONEY = 50000;

interface NukeMenuProps {
    roomManager: RoomManager;
    onClose: () => void;
}

export function NukeMenu({ roomManager, onClose }: NukeMenuProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [confirming, setConfirming] = useState(false);
    const [launching, setLaunching] = useState(false);

    const players = roomManager.playerList;

    function handleNuke() {
        if (!selected) return;
        let result = ws.request("send_atomic_bomb", "player_nuke", 
           selected
        );
        if (result.ok) {
          setLaunching(true); 
        }
    }

    if (launching) {
      return <NukeLaunchAnimation target={selected!} onDone={onClose} />;
    }
  
    return (
        <div className="panel-overlay" onClick={onClose}>
            <div
                className="cell-modal"
                style={{ maxWidth: 360, width: "100%" }}
                onClick={e => e.stopPropagation()}
            >
                {!confirming ? (
                    <>
                        <p className="cell-modal-title">☢️ Rakieta Atomowa</p>
                        <p style={{ fontSize: "0.8rem", color: "#888", margin: 0 }}>
                            Wybierz cel ataku nuklearnego.
                        </p>

                        <div className="cell-modal-stats">
                            {players.map(player => (
                                <div
                                    key={player.name}
                                    className="cell-modal-stat"
                                    onClick={() => setSelected(player.name)}
                                    style={{
                                        cursor: "pointer",
                                        borderColor: selected === player.name ? "#e03030" : undefined,
                                        background: selected === player.name ? "#fdf3f2" : undefined,
                                        transition: "all 0.15s",
                                    }}
                                >
                                    <span className="cell-modal-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        {player.name}
                                    </span>
                                    {selected === player.name && (
                                        <span style={{ fontSize: "0.75rem", color: "#e03030", fontWeight: 700 }}>
                                            Wybrany
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="shop-action-btn shop-action-btn--sell" onClick={onClose}>
                                Anuluj
                            </button>
                            <button
                                className="shop-action-btn shop-action-btn--buy"
                                style={{ background: selected ? "#e03030" : undefined, opacity: selected ? 1 : 0.4 }}
                                onClick={() => selected && setConfirming(true)}
                            >
                                Dalej
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="cell-modal-title">Na pewno?</p>
                        <p style={{ fontSize: "0.8rem", color: "#888", margin: 0 }}>
                            Atak na <strong style={{ color: "#222" }}>{selected}</strong> kosztuje:
                        </p>

                        <div className="cell-modal-stats">
                            {Object.entries(NUKE_COST_MATERIALS).map(([mat, amount]) => (
                                <div className="cell-modal-stat" key={mat}>
                                    <span className="cell-modal-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <span style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 3,
                                            background: getMaterialColor(Number(mat) as Materials),
                                            flexShrink: 0,
                                            border: "1px solid rgba(0,0,0,0.1)",
                                        }} />
                                        {getMaterialName(Number(mat) as Materials)}
                                    </span>
                                    <span className="cell-modal-value" style={{ color: "#c06010" }}>
                                        ×{amount}
                                    </span>
                                </div>
                            ))}
                            <div className="cell-modal-stat" style={{ borderColor: "#f5c5c0", background: "#fdf3f2" }}>
                                <span className="cell-modal-label" style={{ fontWeight: 700, color: "#555" }}>Gotówka</span>
                                <span className="cell-modal-value" style={{ color: "#e03030", fontSize: "1rem" }}>
                                    ${NUKE_COST_MONEY.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="shop-action-btn shop-action-btn--sell" onClick={() => setConfirming(false)}>
                                Wróć
                            </button>
                            <button
                                className="shop-action-btn shop-action-btn--buy"
                                style={{ background: "#e03030" }}
                                onClick={handleNuke}
                            >
                                ☢️ Odpal
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
import { useState } from "react";
import { RoomManager } from "../../services/RoomManager";
import {
  getMaterialColor,
  getMaterialName,
  Materials,
} from "../../services/game/statics/Materials";
import { ws } from "../../services/WebsocketManager";
import { NukeLaunchAnimation } from "./NukeAnimation";
import { MaterialMarket } from "../../services/game/MaterialMarket";
import { ShopManager } from "../../services/game/ShopManager";
import { GameManager } from "../../services/game/GameManager";

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
  const [buyingMaterials, setBuyingMaterials] = useState(false);
  const [launching, setLaunching] = useState(false);

  const players = roomManager.playerList;

  const market = MaterialMarket.getInstance();
  const shop = ShopManager.getInstance();
  const inventory = GameManager.getInstance().inventory;

  const missingMaterials = (
    Object.entries(NUKE_COST_MATERIALS) as [string, number][]
  )
    .map(([mat, required]) => {
      const material = Number(mat) as Materials;
      const owned = inventory.materialCount[material] ?? 0;
      const missing = required - owned;
      return { material, required, owned, missing };
    })
    .filter((m) => m.missing > 0);

  const materialsBuyCost = missingMaterials.reduce(
    (sum, { material, missing }) =>
      sum + market.getCurrentPrice(material) * missing,
    0,
  );

  const totalCost = NUKE_COST_MONEY + (buyingMaterials ? materialsBuyCost : 0);
  const canAfford = inventory.money >= totalCost;

  async function handleNuke() {
    if (!selected) return;
    if (missingMaterials.length > 0) {
      setBuyingMaterials(true);
      return;
    }
    await fireNuke();
  }

  async function handleBuyAndNuke() {
    if (!canAfford) return;
    for (const { material, missing } of missingMaterials) {
      shop.buy(material, missing);
    }
    setBuyingMaterials(false);
    await fireNuke();
  }

  async function fireNuke() {
    const result = await ws.request(
      "send_atomic_bomb",
      "player_nuke",
      selected!,
    );
    if (result.ok) {
      setLaunching(true);
    }
  }

  if (launching) {
    return <NukeLaunchAnimation target={selected!} onDone={onClose} />;
  }

  if (buyingMaterials) {
    return (
      <div className="panel-overlay" onClick={onClose}>
        <div
          className="cell-modal"
          style={{ maxWidth: 360, width: "100%" }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="cell-modal-title">Brakuje materiałów</p>
          <p style={{ fontSize: "0.8rem", color: "#888", margin: 0 }}>
            Kupić brakujące materiały po cenach rynkowych przed odpaleniem?
          </p>

          <div className="cell-modal-stats">
            {missingMaterials.map(({ material, missing }) => {
              const price = market.getCurrentPrice(material);
              return (
                <div className="cell-modal-stat" key={material}>
                  <span
                    className="cell-modal-label"
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: getMaterialColor(material),
                        flexShrink: 0,
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                    />
                    {getMaterialName(material)}
                    <span style={{ color: "#bbb" }}>×{missing}</span>
                  </span>
                  <span
                    className="cell-modal-value"
                    style={{ color: "#c06010" }}
                  >
                    ${(price * missing).toLocaleString()}
                  </span>
                </div>
              );
            })}

            <div
              className="cell-modal-stat"
              style={{ borderColor: "#f5c5c0", background: "#fdf3f2" }}
            >
              <span
                className="cell-modal-label"
                style={{ fontWeight: 700, color: "#555" }}
              >
                Łącznie
              </span>
              <span
                className="cell-modal-value"
                style={{ color: "#e03030", fontSize: "1rem" }}
              >
                ${(materialsBuyCost + NUKE_COST_MONEY).toLocaleString()}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="shop-action-btn shop-action-btn--sell"
              onClick={() => setBuyingMaterials(false)}
            >
              Wróć
            </button>
            <button
              className={`shop-action-btn shop-action-btn--buy ${!canAfford ? "shop-action-btn--disabled" : ""}`}
              style={{ background: canAfford ? "#e03030" : undefined }}
              disabled={!canAfford}
              onClick={handleBuyAndNuke}
            >
              ☢️ Kup i odpal
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!confirming) {
    return (
      <div className="panel-overlay" onClick={onClose}>
        <div
          className="cell-modal"
          style={{ maxWidth: 360, width: "100%" }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="cell-modal-title">☢️ Rakieta Atomowa</p>
          <p style={{ fontSize: "0.8rem", color: "#888", margin: 0 }}>
            Wybierz cel ataku nuklearnego.
          </p>

          <div className="cell-modal-stats">
            {players.map((player) => (
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
                <span
                  className="cell-modal-label"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  {player.name}
                </span>
                {selected === player.name && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#e03030",
                      fontWeight: 700,
                    }}
                  >
                    Wybrany
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="shop-action-btn shop-action-btn--sell"
              onClick={onClose}
            >
              Anuluj
            </button>
            <button
              className="shop-action-btn shop-action-btn--buy"
              style={{
                background: selected ? "#e03030" : undefined,
                opacity: selected ? 1 : 0.4,
              }}
              onClick={() => selected && setConfirming(true)}
            >
              Dalej
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div
        className="cell-modal"
        style={{ maxWidth: 360, width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="cell-modal-title">Na pewno?</p>
        <p style={{ fontSize: "0.8rem", color: "#888", margin: 0 }}>
          Atak na <strong style={{ color: "#222" }}>{selected}</strong>{" "}
          kosztuje:
        </p>

        <div className="cell-modal-stats">
          {(Object.entries(NUKE_COST_MATERIALS) as [string, number][]).map(
            ([mat, required]) => {
              const material = Number(mat) as Materials;
              const owned = inventory.materialCount[material] ?? 0;
              const isMissing = owned < required;
              return (
                <div
                  className="cell-modal-stat"
                  key={mat}
                  style={
                    isMissing
                      ? { borderColor: "#f5c5c0", background: "#fdf3f2" }
                      : undefined
                  }
                >
                  <span
                    className="cell-modal-label"
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: getMaterialColor(material),
                        flexShrink: 0,
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                    />
                    {getMaterialName(material)}
                  </span>
                  <span
                    className="cell-modal-value"
                    style={{ color: isMissing ? "#e03030" : "#c06010" }}
                  >
                    ×{required}
                    {isMissing && (
                      <span style={{ fontSize: "0.75rem", marginLeft: 4 }}>
                        (masz {owned})
                      </span>
                    )}
                  </span>
                </div>
              );
            },
          )}
          <div
            className="cell-modal-stat"
            style={{ borderColor: "#f5c5c0", background: "#fdf3f2" }}
          >
            <span
              className="cell-modal-label"
              style={{ fontWeight: 700, color: "#555" }}
            >
              Gotówka
            </span>
            <span
              className="cell-modal-value"
              style={{ color: "#e03030", fontSize: "1rem" }}
            >
              ${NUKE_COST_MONEY.toLocaleString()}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="shop-action-btn shop-action-btn--sell"
            onClick={() => setConfirming(false)}
          >
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
      </div>
    </div>
  );
}

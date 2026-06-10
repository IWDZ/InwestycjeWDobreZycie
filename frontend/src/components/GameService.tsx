import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHammer,
  faMap,
  faChartBar,
  faUsers,
  faShop,
} from "@fortawesome/free-solid-svg-icons";
import { BuildPanel } from "./gamePanels/BuildPanel";
import {
  getMaterialColor,
  getMaterialName,
  MATERIAL_MAP,
  Materials,
} from "../services/game/statics/Materials";
import { PlotPanel } from "./gamePanels/PlotPanel";
import { StatsPanel } from "./gamePanels/StatsPanel";
import { ShopPanel } from "./gamePanels/ShopPanel";
import { LeaderboardPanel } from "./gamePanels/LeaderboardPanel";
import { GameMap } from "./GameMap";
import { BUILDINGS, getBuildingById } from "../services/game/statics/BuildingData";
import { GameManager } from "../services/game/GameManager";
import { ws } from "../services/WebsocketManager";
import { roomManager } from "./LobbyService";
import { MaterialMarket } from "../services/game/MaterialMarket";
import { BuyMaterialsMenu } from "./BuyMenu";
import { NukeMenu } from "./gamePanels/NukeMenu";

const TABS: { id: string; label: string; icon: any }[] = [
  { id: "build", label: "Buduj", icon: faHammer },
  { id: "plots", label: "Ploty", icon: faMap },
  { id: "shop", label: "Sklep", icon: faShop },
  { id: "stats", label: "Statystyki", icon: faChartBar },
  { id: "players", label: "Gracze", icon: faUsers },
];

const materials = Object.values(Materials).filter(
  (v) => typeof v === "number",
) as Materials[];

type GamePhase = "idle" | "countdown" | "playing";

export interface GameServiceRef {
  shouldStart: boolean;
  onGameEnd: () => void;
}

interface PendingBuild {
  buildingName: string;
  startLocation: [number, number];
  isVertical: boolean;
}

interface MissingMaterial {
  material: Materials;
  amount: number;
}

export function GameService({ shouldStart, onGameEnd }: GameServiceRef) {
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle");
  const [countdown, setCountdown] = useState(3);
  const [activeTab, setActiveTab] = useState("");
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const gameManager = GameManager.getInstance();
  const [placingBuilding, setPlacingBuilding] = useState<
    (typeof BUILDINGS)[0] | null
  >(null);
  const [, forceUpdate] = useState(0);
  const [moneyPopups, setMoneyPopups] = useState<
    { id: number; amount: number; x: number; type: "increase" | "decrease" }[]
  >([]);
  const [isVertical, setIsVertical] = useState(false);
  const [buyMenuMissing, setBuyMenuMissing] = useState<
    MissingMaterial[] | null
  >(null);
  const [pendingBuild, setPendingBuild] = useState<PendingBuild | null>(null);
  const [nukeOpen, setNukeOpen] = useState(false);
  const [tick, setTick] = useState(1);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") setIsVertical((v) => !v);
      if (e.key === "Escape") {
        setPlacingBuilding(null);
        setActiveTab("");
        setMaterialsOpen(false);
        setBuyMenuMissing(null);
        setPendingBuild(null);
        setNukeOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    setIsVertical(false);
  }, [placingBuilding]);

  useEffect(() => {
    const onMoneyIncrease = (amount: number) => {
      const id = Date.now();
      const x = Math.random() * 60 - 30;
      setMoneyPopups((prev) => [...prev, { id, amount, x, type: "increase" }]);
      setTimeout(
        () => setMoneyPopups((prev) => prev.filter((p) => p.id !== id)),
        1000,
      );
    };
    const onMoneyDecrease = (amount: number) => {
      const id = Date.now() + 1;
      const x = Math.random() * 60 - 30;
      setMoneyPopups((prev) => [...prev, { id, amount, x, type: "decrease" }]);
      setTimeout(
        () => setMoneyPopups((prev) => prev.filter((p) => p.id !== id)),
        1000,
      );
    };
    const onFieldUpdate = (data: any) => {
      gameManager.plotManager.syncFromServer(data);
      forceUpdate((v) => v + 1);
    };
    const onHappinessUpdate = (amount: number) => {
      gameManager.happiness.level = amount;
    };
    const onMoneyUpdate = (data: number) => {
      gameManager.inventory.money = data;
      forceUpdate((v) => v + 1);
    };
    const onMaterialsUpdate = (data: Record<string, number>) => {
      gameManager.inventory.syncMaterials(data);
      forceUpdate((v) => v + 1);
    };
    
    const onTickUpdate = (data: number) => {
      setTick(data+1);
    };
    
    ws.register_handler("tick_update", onTickUpdate);
    ws.register_handler("materials_update", onMaterialsUpdate);
    ws.register_handler("game_end", onGameEnd);
    ws.register_handler(
      "material_prices_update",
      (data: Record<string, number>) => {
        const market = MaterialMarket.getInstance();
        const updates = Object.entries(data)
          .filter(([, price]) => price != null)
          .map(([key, price]) => ({
            mat: MATERIAL_MAP[key.toLowerCase()],
            value: price,
          }))
          .filter((x) => x.mat !== undefined);
        market.addMaterialPrice(updates);
      },
    );
    ws.register_handler("money_increase", onMoneyIncrease);
    ws.register_handler("money_decrease", onMoneyDecrease);
    ws.register_handler("field_update", onFieldUpdate);
    ws.register_handler("happiness_update", onHappinessUpdate);
    ws.register_handler("money_update", onMoneyUpdate);

    return () => {
      ws.unregister_handler("tick_update", onTickUpdate);
      ws.unregister_handler("money_increase", onMoneyIncrease);
      ws.unregister_handler("money_decrease", onMoneyDecrease);
      ws.unregister_handler("field_update", onFieldUpdate);
      ws.unregister_handler("happiness_update", onHappinessUpdate);
      ws.unregister_handler("game_end", onGameEnd);
      ws.unregister_handler("money_update", onMoneyUpdate);
      ws.unregister_handler("materials_update", onMaterialsUpdate);
    };
  }, []);

  function stopGame() {
    setGamePhase("idle");
  }

  function startGame() {
    setGamePhase("countdown");
    setCountdown(3);
  }

  useEffect(() => {
    if (shouldStart) startGame();
    else stopGame();
  }, [shouldStart]);

  useEffect(() => {
    if (gamePhase !== "countdown") return;
    if (countdown === 0) {
      const t = setTimeout(() => setGamePhase("playing"), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [gamePhase, countdown]);

  async function tryCreateBuilding(payload: PendingBuild) {
    const result = await ws.request<typeof payload, void>(
      "create_building",
      "max_population_update",
      { ...payload },
    );

    if (!result.ok && result.error === "Not Enough Materials") {
      const building = Object.values(BUILDINGS).find(
        (b) => b.id.toLowerCase() === payload.buildingName,
      );
      if (building) {
        const missing: MissingMaterial[] = Object.entries(building.materialCost)
          .map(([key, required]) => {
            const mat = Number(key) as Materials;
            const have = gameManager.inventory.materialCount[mat] ?? 0;
            return {
              material: mat,
              amount: Math.max(0, (required as number) - have),
            };
          })
          .filter(({ amount }) => amount > 0);
        setPendingBuild(payload);
        setBuyMenuMissing(missing);
      }
    }
  }

  function happinessColor(pct: number): string {
    if (pct === 50) return "#f5a800";
    if (pct > 50) return "#1D9E75";
    return "#e03030";
  }

  if (gamePhase === "idle") return <></>;

  if (gamePhase === "countdown") {
    return (
      <div className="game-wrapper">
        <div className="game-container game-countdown-screen">
          <span key={countdown} className="game-countdown-number">
            {countdown === 0 ? "START!" : countdown}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="game-wrapper">
        <div className="game-container">
          <header className="game-header">
            <div className="game-header-left">
              <span className="game-city-name">Miasto</span>
              <span className="game-turn-info">Tick {tick}</span>
            </div>

            <div className="game-money-info" style={{ position: "relative" }}>
              <span className="game-money-symbol">$</span>
              <p className="game-money" id="game-money">
                {gameManager.inventory.money}
              </p>
              {moneyPopups.map((popup) => (
                <span
                  key={popup.id}
                  className={`money-popup money-popup--${popup.type}`}
                  style={{ left: `calc(50% + ${popup.x}px)` }}
                >
                  {popup.type === "increase" ? "+" : "-"}
                  {popup.amount}
                </span>
              ))}
            </div>

            <div className="game-header-right">
              <div className="game-happiness">
                <span className="happiness-label">Zadowolenie</span>
                <div className="happiness-progress-bar">
                  <div
                    className="happiness-fill"
                    style={{
                      width: `${gameManager.happiness.level}%`,
                      background: happinessColor(gameManager.happiness.level),
                    }}
                  />
                </div>
                <span
                  className="happiness-percentage"
                  id="happiness-percentage"
                  style={{ color: happinessColor(gameManager.happiness.level) }}
                >
                  {gameManager.happiness.level}%
                </span>
              </div>

              <div
                className="materials-button"
                onClick={() => setMaterialsOpen((o) => !o)}
              >
                <span>Surowce</span>
                <span
                  className={`materials-arrow ${materialsOpen ? "open" : ""}`}
                >
                  ▾
                </span>

                {materialsOpen && (
                  <div className="materials-dropdown">
                    <p className="materials-dropdown-title">Magazyn</p>
                    <div className="materials-grid">
                      {materials.map((mat) => (
                        <div key={mat} className="material-item">
                          <div
                            className="material-swatch"
                            style={{ background: getMaterialColor(mat) }}
                          />
                          <div className="material-info">
                            <span className="material-name">
                              {getMaterialName(mat)}
                            </span>
                            <span className="material-value">
                              {gameManager.inventory.materialCount[mat]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {gameManager.plotManager.hasBuilding("nuclear_reactor") && (
                <button
                  className="materials-button"
                  style={{ borderColor: "#e03030", color: "#e03030" }}
                  onClick={() => setNukeOpen(true)}
                >
                  ☢️
                </button>
              )}
            </div>
          </header>

          <main className="game-map">
            {placingBuilding && (
              <div className="placing-bar">
                <span>
                  Budowanie: <strong>{placingBuilding.name}</strong>
                </span>
                <button onClick={() => setPlacingBuilding(null)}>Anuluj</button>
              </div>
            )}
            <GameMap
              placingBuilding={placingBuilding}
              isVertical={isVertical}
              onPlotClick={
                placingBuilding
                  ? (plotId) => {
                      const row = Math.floor(plotId / 7);
                      const col = plotId % 7;
                      tryCreateBuilding({
                        buildingName: placingBuilding.id.toLowerCase(),
                        startLocation: [row, col],
                        isVertical,
                      });
                    }
                  : undefined
              }
            />
          </main>

          <footer className="game-footer">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`game-nav-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <FontAwesomeIcon icon={tab.icon} className="game-nav-icon" />
                <span>{tab.label}</span>
              </button>
            ))}
          </footer>
        </div>
      </div>

      {nukeOpen && (
        <NukeMenu
          roomManager={roomManager}
          onClose={() => setNukeOpen(false)}
        />
      )}
      
      {buyMenuMissing && pendingBuild && (
        <BuyMaterialsMenu
          missingMaterials={buyMenuMissing}
          onCancel={() => {
            setBuyMenuMissing(null);
            setPendingBuild(null);
          }}
          buildingCost={getBuildingById(pendingBuild.buildingName)?.moneyCost ?? 0}
          onConfirm={() => {
            const build = pendingBuild;
            setBuyMenuMissing(null);
            setPendingBuild(null);
            tryCreateBuilding(build);
          }}
        />
      )}

      {activeTab &&
        createPortal(
          <div className="panel-overlay" onClick={() => setActiveTab("")}>
            <div className="panel-popup" onClick={(e) => e.stopPropagation()}>
              {activeTab === "build" && (
                <BuildPanel
                  onSelectBuilding={(b) => {
                    setPlacingBuilding(b);
                    setActiveTab("");
                  }}
                />
              )}
              {activeTab === "plots" && <PlotPanel />}
              {activeTab === "stats" && <StatsPanel />}
              {activeTab === "shop" && <ShopPanel />}
              {activeTab === "players" && <LeaderboardPanel />}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

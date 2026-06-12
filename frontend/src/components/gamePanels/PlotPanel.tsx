import { useCallback, useEffect, useState } from "react";
import { GameManager } from "../../services/game/GameManager";
import { ws } from "../../services/WebsocketManager";
import { showError } from "../../services/ErrorManager";

export function PlotPanel() {
  const manager = GameManager.getInstance();
  const plotManager = manager.plotManager;
  const [, forceUpdate] = useState(0);

  const handleUnlock = useCallback(
    async (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      const row = Math.floor(index / plotManager.gridSize);
      const col = index % plotManager.gridSize;
      const result = await ws.request("buy_cell", "money_decrease", [row, col]);
      if (!result.ok) {
        showError(result.error)
      }
      forceUpdate(v => v + 1);
    },
    [plotManager, manager]
  );

  const size = plotManager.gridSize;
  const unlockedSet = plotManager.unlockedPlots;

  return (
    <div className="plot-panel">
      <p className="panel-title">Wybierz działkę</p>
      <div
        className="plot-grid"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {Array.from({ length: size * size }, (_, i) => {
          const unlocked = unlockedSet.has(i);
          const row = Math.floor(i / size);

          return (
            <div
              key={i}
              className={`plot-cell ${unlocked ? "plot-cell--unlocked" : "plot-cell--locked"
                } ${row === 0 ? "plot-cell--first-row" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="plot-tooltip">
                <span className="plot-tooltip-title">Działka {i + 1}</span>
                {unlocked ? (
                  <span className="plot-tooltip-unlocked">Odblokowana</span>
                ) : (
                  <>
                    <span className="plot-tooltip-price">
                      Cena: ${plotManager.nextCellPrice?.toLocaleString() ?? "—"}
                    </span>
                    <button
                      className="plot-tooltip-btn"
                      onClick={(e) => handleUnlock(e, i)}
                    >
                      Odblokuj
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
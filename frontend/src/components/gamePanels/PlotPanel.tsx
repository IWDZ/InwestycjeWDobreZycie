import { useCallback, useState } from "react";
import { GameManager } from "../../services/game/GameManager";

export function PlotPanel() {
  const plotManager = GameManager.getInstance().plotManager;

  const [, forceUpdate] = useState(0);

  const handleUnlock = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      plotManager.unlockPlot(index);
      forceUpdate(v => v + 1);
    },
    [plotManager]
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
          const price = plotManager.getPrice(i);

          const row = Math.floor(i / size);
          return (
            <div
              key={i}
              className={`plot-cell ${unlocked ? "plot-cell--unlocked" : "plot-cell--locked"
                } ${row === 0 ? "plot-cell--first-row" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {(
                <div className="plot-tooltip">
                  <span className="plot-tooltip-title">
                    Działka {i + 1}
                  </span>

                  {unlocked ? (
                    <span className="plot-tooltip-unlocked">
                      Odblokowana
                    </span>
                  ) : (
                    <>
                      <span className="plot-tooltip-price">
                        Cena: ${price.toLocaleString()}
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
import { GameManager } from "../services/game/GameManager";
import { useState, useEffect } from "react";
import {
  Building,
  BUILDING_ICONS,
  getBuildingById,
  getBuildingName,
} from "../services/game/statics/BuildingData";
import { createPortal } from "react-dom";
import { ws } from "../services/WebsocketManager";
import { useLocale } from "../locale/Locale";

interface GameMapFuncs {
  onPlotClick?: (plotId: number) => void;
  placingBuilding?: Building | null;
  isVertical?: boolean;
}

interface CellModal {
  cell: any;
  plotIndex: number;
  anchorRect: DOMRect;
}

export function GameMap({
  onPlotClick,
  placingBuilding,
  isVertical = false,
}: GameMapFuncs) {
  const l = useLocale();
  const plotManager = GameManager.getInstance().plotManager;
  const { gridSize } = plotManager;
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);
  const [hoveredPlot, setHoveredPlot] = useState<number | null>(null);
  const [cellModal, setCellModal] = useState<CellModal | null>(null);

  useEffect(() => {
    const onFieldUpdate = () => {
      if (!cellModal) return;

      const row = Math.floor(cellModal.plotIndex / gridSize);
      const col = cellModal.plotIndex % gridSize;

      const updatedCell = plotManager.field?.[row]?.[col];

      if (!updatedCell) {
        setCellModal(null);
        return;
      }

      setCellModal((prev) =>
        prev
          ? {
              ...prev,
              cell: updatedCell,
            }
          : prev,
      );
    };

    ws.register_handler("field_update", onFieldUpdate);

    return () => {
      ws.unregister_handler("field_update", onFieldUpdate);
    };
  }, [cellModal, gridSize]);

  useEffect(() => {
    if (!cellModal) return;
  
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCellModal(null);
      }
    };
  
    window.addEventListener("keydown", onKeyDown);
  
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [cellModal]);

  const getOccupiedIndices = (anchorIndex: number): number[] => {
    if (!placingBuilding) return [];
    const rowStart = Math.floor(anchorIndex / gridSize);
    const colStart = anchorIndex % gridSize;
    const height = isVertical ? placingBuilding.width : placingBuilding.height;
    const width = isVertical ? placingBuilding.height : placingBuilding.width;
    const indices = [];
    for (let y = rowStart; y < rowStart + height; y++) {
      for (let x = colStart; x < colStart + width; x++) {
        indices.push(y * gridSize + x);
      }
    }
    return indices;
  };

  const canPlace = (indices: number[]): boolean => {
    for (const idx of indices) {
      const row = Math.floor(idx / gridSize);
      const col = idx % gridSize;
      if (row >= gridSize || col >= gridSize) return false;
      const cell = plotManager.field[row]?.[col];
      if (cell === undefined) return false;
      if (cell !== null) return false;
    }
    return true;
  };

  const hoveredIndices =
    hoveredPlot !== null ? getOccupiedIndices(hoveredPlot) : [];
  const placeable = hoveredIndices.length > 0 && canPlace(hoveredIndices);
  const hasEnoughMoney = placingBuilding
    ? GameManager.getInstance().inventory.money >= placingBuilding.moneyCost
    : true;

  return (
    <>
      <div
        className="game-grid"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {Array.from({ length: gridSize * gridSize }, (_, i) => {
          const col = i % gridSize;
          const row = Math.floor(i / gridSize);
          const unlocked = plotManager.isUnlocked(i);
          const isPort = col === 0;
          const cell = plotManager.field[row]?.[col];
          const icon = cell?.buildingName
            ? BUILDING_ICONS[cell.buildingName]
            : null;

          let placingClass = "";
          if (placingBuilding && unlocked) {
            if (!hasEnoughMoney) {
              placingClass = "plot-cannot-place";
            } else if (hoveredIndices.includes(i)) {
              placingClass = placeable ? "plot-can-place" : "plot-cannot-place";
            }
          }

          if (!unlocked) return <div key={i} className="plot plot-hidden" />;
          return (
            <div
              key={i}
              className={[
                "plot",
                "plot-unlocked",
                isPort ? "plot-port" : "",
                onPlotClick
                  ? "plot-placing-target"
                  : selectedPlot === i
                    ? "plot-selected"
                    : "",
                placingClass,
              ].join(" ")}
              onMouseEnter={() => setHoveredPlot(i)}
              onMouseLeave={() => setHoveredPlot(null)}
              onClick={(event) => {
                if (onPlotClick) {
                  onPlotClick(i);
                } else if (cell && typeof cell === "object") {
                  const rect = (
                    event.currentTarget as HTMLElement
                  ).getBoundingClientRect();
                  setCellModal({ cell, plotIndex: i, anchorRect: rect });
                } else {
                  setSelectedPlot(i);
                }
              }}
            >
              {icon && <span className="plot-icon">{icon}</span>}
            </div>
          );
        })}
      </div>

      {cellModal &&
        createPortal(
          <div
            className="cell-modal"
            style={{
              position: "fixed",
              left: cellModal.anchorRect.left + cellModal.anchorRect.width / 2,
              top: cellModal.anchorRect.top - 8,
              transform: "translate(-50%, -100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="cell-modal-close"
              onClick={() => setCellModal(null)}
            >
              ✕
            </button>
            <h2 className="cell-modal-title">
              {getBuildingName(cellModal.cell.buildingName) ??
                cellModal.cell.buildingName}
            </h2>
            <div className="cell-modal-stats">
              <div className="cell-modal-stat">
                <span className="cell-modal-label">{l.t("map.jobs")}</span>
                <span className="cell-modal-value">
                  {cellModal.cell.workers} /{" "}
                  {getBuildingById(cellModal.cell.buildingName)?.jobs}
                </span>
              </div>
              <div className="cell-modal-stat">
                <span className="cell-modal-label">{l.t("map.housing")}</span>
                <span className="cell-modal-value">
                  {cellModal.cell.residents} /{" "}
                  {getBuildingById(cellModal.cell.buildingName)?.apartments}
                </span>
              </div>
            </div>
            <button
              className="cell-modal-delete"
              onClick={() => {
                const row = Math.floor(cellModal.plotIndex / gridSize);
                const col = cellModal.plotIndex % gridSize;
                ws.notify("delete_building", [row, col]);
                setCellModal(null);
              }}
            >
              {l.t("map.deletebuilding")}
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

import { BUILDINGS, BuildingType } from "../../services/game/statics/BuildingData";
import { getMaterialColor, getMaterialName, Materials } from "../../services/game/statics/Materials";

interface BuildPanelProps {
  onSelectBuilding: (building: typeof BUILDINGS[0]) => void;
}

export function BuildPanel({onSelectBuilding}: BuildPanelProps) {
  const groupedBuildings = Object.values(BuildingType).map(type => ({
    type,
    buildings: BUILDINGS.filter(b => b.type === type)
  }));

  return (
    <div className="panel">
      <p className="panel-title">Wybierz budynek</p>

      {groupedBuildings.map(group => (
        <div key={group.type} className="build-category">
          <p className="build-category-title">{group.type}</p>

          <div className="build-grid">
            {group.buildings.map(b => (
              <div
                key={b.id}
                className={`build-card ${b.locked ? "build-card--locked" : ""}`}
                onClick={() => {
                  if (b.locked) return;
                  onSelectBuilding(b);
                }}
              >
                {b.locked && (
                  <div className="build-locked-label">
                    Osiągnięto limit
                  </div>
                )}

                <div className="build-card-top">
                  <span className="build-name">{b.name}</span>
                  <span className="build-size">
                    {b.width}×{b.height}
                  </span>
                </div>

                <div className="build-badges">
                  {b.apartments > 0 && (
                    <span
                      className="badge badge-apartments"
                      title="Mieszkania"
                    >
                      {b.apartments} lokali
                    </span>
                  )}

                  {b.jobs > 0 && (
                    <span
                      className="badge badge-jobs"
                      title="Miejsca pracy"
                    >
                      {b.jobs} miejsc pracy
                    </span>
                  )}

                  {b.happiness !== 0 && (
                    <span
                      className={`badge badge-happiness ${b.happiness < 0
                        ? "badge-happiness--neg"
                        : ""
                        }`}
                      title="Zadowolenie"
                    >
                      {b.happiness > 0
                        ? `+${b.happiness}`
                        : b.happiness}{" "}
                      zadowolenie
                    </span>
                  )}
                </div>

                {Object.entries(b.materialCost).length > 0 && (
                  <div className="build-materials">
                    {(Object.entries(b.materialCost) as [string, number][])
                      .map(([matKey, qty]) => {
                        const mat = Number(matKey) as Materials;
                        return (
                          <span key={matKey} className="build-material-badge">
                            <span
                              className="build-material-swatch"
                              style={{ background: getMaterialColor(mat) }}
                            />
                            {qty} x {getMaterialName(mat)}
                          </span>
                        );
                      })}
                  </div>
                )}
                <span className="build-cost">
                  ${b.moneyCost.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
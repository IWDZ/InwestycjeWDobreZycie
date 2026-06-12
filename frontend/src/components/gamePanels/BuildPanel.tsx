import { useEffect, useRef, useState } from "react";
import { BUILDINGS, BuildingType } from "../../services/game/statics/BuildingData";
import { getMaterialColor, getMaterialName, Materials } from "../../services/game/statics/Materials";

interface BuildPanelProps {
  onSelectBuilding: (building: typeof BUILDINGS[0]) => void;
}

const savedScrollPos = { value: 0 };

export function BuildPanel({ onSelectBuilding }: BuildPanelProps) {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  
    const scrollable = document.querySelector(".panel-popup") as HTMLElement;
    if (!scrollable) return;
  
    const frame = requestAnimationFrame(() => {
      scrollable.scrollTop = savedScrollPos.value;
    });
  
    const handleScroll = () => {
      savedScrollPos.value = scrollable.scrollTop;
    };
  
    scrollable.addEventListener("scroll", handleScroll);
    return () => {
      cancelAnimationFrame(frame);
      scrollable.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const query = search.toLowerCase().trim();

  const groupedBuildings = Object.values(BuildingType).map(type => ({
    type,
    buildings: BUILDINGS.filter(b =>
      b.type === type &&
      (query === "" || b.name.toLowerCase().includes(query))
    )
  })).filter(group => group.buildings.length > 0);

  return (
    <div className="panel">
      <p className="panel-title">Wybierz budynek</p>

      <input
        ref={searchRef}
        type="text"
        className="build-search"
        placeholder="Szukaj budynku..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

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
                  <div className="build-locked-label">Osiągnięto limit</div>
                )}
                <div className="build-card-top">
                  <span className="build-name">{b.name}</span>
                  <span className="build-size">{b.width}×{b.height}</span>
                </div>
                <div className="build-badges">
                  {b.apartments > 0 && (
                    <span className="badge badge-apartments" title="Mieszkania">
                      {b.apartments} lokali
                    </span>
                  )}
                  {b.jobs > 0 && (
                    <span className="badge badge-jobs" title="Miejsca pracy">
                      {b.jobs} miejsc pracy
                    </span>
                  )}
                  {b.moneyEarn > 0 && (
                    <span className="badge badge-earn">{b.moneyEarn} $ za prac.</span>
                  )}
                  {b.happiness !== 0 && (
                    <span
                      className={`badge badge-happiness ${b.happiness < 0 ? "badge-happiness--neg" : ""}`}
                      title="Zadowolenie"
                    >
                      {b.happiness > 0 ? `+${b.happiness}` : b.happiness}{" "}zadowolenie
                    </span>
                  )}
                </div>
                {Object.entries(b.materialCost).length > 0 && (
                  <div className="build-materials">
                    {(Object.entries(b.materialCost) as [string, number][]).map(([matKey, qty]) => {
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
                <span className="build-cost">${b.moneyCost.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
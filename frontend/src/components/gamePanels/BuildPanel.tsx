import { useEffect, useRef, useState } from "react";
import { BUILDINGS, BuildingType, getBuildingName, getBuildingTypeName } from "../../services/game/statics/BuildingData";
import { getMaterialColor, getMaterialName, Materials } from "../../services/game/statics/Materials";
import { useLocale } from "../../locale/Locale";

interface BuildPanelProps {
  onSelectBuilding: (building: typeof BUILDINGS[0]) => void;
}

const savedScrollPos = { value: 0 };

export function BuildPanel({ onSelectBuilding }: BuildPanelProps) {
  const l = useLocale();
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

  const groupedBuildings = (Object.values(BuildingType) as BuildingType[]).map(type => ({
    type,
    buildings: BUILDINGS.filter(b =>
      b.type === type &&
      (query === "" || getBuildingName(b.id).toLowerCase().includes(query))
    )
  })).filter(group => group.buildings.length > 0);

  return (
    <div className="panel">
      <p className="panel-title">{l.t("build.selectbuilding")}</p>

      <input
        ref={searchRef}
        type="text"
        className="build-search"
        placeholder={l.t("build.search")}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {groupedBuildings.map(group => (
        <div key={group.type} className="build-category">
          <p className="build-category-title">{getBuildingTypeName(group.type)}</p>
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
                  <div className="build-locked-label">{l.t("build.limitreached")}</div>
                )}
                <div className="build-card-top">
                  <span className="build-name">{b.name}</span>
                  <span className="build-size">{b.width}×{b.height}</span>
                </div>
                <div className="build-badges">
                  {b.apartments > 0 && (
                    <span className="badge badge-apartments" title="Mieszkania">
                      {l.t("build.units", b.apartments)}
                    </span>
                  )}
                  {b.jobs > 0 && (
                    <span className="badge badge-jobs" title="Miejsca pracy">
                      {l.t("build.jobs", b.jobs)}
                    </span>
                  )}
                  {b.moneyEarn > 0 && (
                    <span className="badge badge-earn">{l.t("build.earn", b.moneyEarn)}</span>
                  )}
                  {b.happiness !== 0 && (
                    <span
                      className={`badge badge-happiness ${b.happiness < 0 ? "badge-happiness--neg" : ""}`}
                    >
                      {b.happiness > 0 ? "+" : ""}{b.happiness} {l.t("build.happiness")}
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
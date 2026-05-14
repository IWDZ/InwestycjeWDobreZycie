import { BUILDINGS } from "../../services/game/statics/BuildingData";

export function BuildPanel() {
  return (
    <div className="panel">
      <p className="panel-title">Wybierz budynek</p>
      <div className="build-grid">
        {BUILDINGS.map(b => (
          <div
            key={b.id}
            className={`build-card ${b.locked ? "build-card--locked" : ""}`}
            onClick={() => {
              if (b.locked) return;
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
              {b.happiness !== 0 && (
                <span className={`badge badge-happiness ${b.happiness < 0 ? 'badge-happiness--neg' : ''}`} title="Zadowolenie">
                  {b.happiness > 0 ? `+${b.happiness}` : b.happiness} zadowolenie
                </span>
              )}
            </div>

            <span className="build-cost">${b.moneyCost.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
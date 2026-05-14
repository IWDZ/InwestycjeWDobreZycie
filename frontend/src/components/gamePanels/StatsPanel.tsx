export function StatsPanel() {
    const earnedMoney = 0;
    const spentMoney = 0;
    const jobsTaken = 3;
    const jobsAvailable = 2;
    const population = 3;
    const apartmentsAvailable = 2;
    const spentOnMaterials = 0;
    const earnedOnMaterials = 0;
    const buildingsBuilt = 1;
    const turnsPlayed = 0;

    const netMoney = earnedMoney - spentMoney;
    const netMaterials = earnedOnMaterials - spentOnMaterials;

    const totalJobs = jobsTaken + jobsAvailable;
    const jobFillRate = totalJobs > 0
        ? Math.round((jobsTaken / totalJobs) * 100)
        : 0;

    const totalHousing = population + apartmentsAvailable;
    const housingFillRate = totalHousing > 0
        ? Math.round((population / totalHousing) * 100)
        : 0;

    const getFillClass = (rate: number) => {
        if (rate >= 80) return "stats-bar-fill stats-bar-fill--danger";
        if (rate >= 50) return "stats-bar-fill stats-bar-fill--warning";
        return "stats-bar-fill stats-bar-fill--safe";
    };

    return (
        <div className="panel">
            <p className="panel-title">Miasto</p>

            <p className="stats-section-label">Pieniądze</p>
            <div className="stats-grid">

                <div className="stats-card stats-card--positive">
                    <div className="stats-body">
                        <span className="stats-label">Przychód</span>
                        <span className="stats-value">${earnedMoney.toLocaleString()}</span>
                    </div>
                </div>

                <div className="stats-card stats-card--negative">
                    <div className="stats-body">
                        <span className="stats-label">Wydatki</span>
                        <span className="stats-value">${spentMoney.toLocaleString()}</span>
                    </div>
                </div>

                <div className={`stats-card ${netMoney >= 0 ? "stats-card--positive" : "stats-card--negative"} stats-card--wide`}>
                    <div className="stats-body">
                        <span className="stats-label">Saldo</span>
                        <span className="stats-value">
                            {netMoney >= 0 ? "+" : ""}${netMoney.toLocaleString()}
                        </span>
                    </div>
                </div>

            </div>

            <p className="stats-section-label">Materiały</p>
            <div className="stats-grid">

                <div className="stats-card stats-card--positive">
                    <div className="stats-body">
                        <span className="stats-label">Sprzedane</span>
                        <span className="stats-value">${earnedOnMaterials.toLocaleString()}</span>
                    </div>
                </div>

                <div className="stats-card stats-card--negative">
                    <div className="stats-body">
                        <span className="stats-label">Zakupy</span>
                        <span className="stats-value">${spentOnMaterials.toLocaleString()}</span>
                    </div>
                </div>

                <div className={`stats-card ${netMaterials >= 0 ? "stats-card--positive" : "stats-card--negative"} stats-card--wide`}>
                    <div className="stats-body">
                        <span className="stats-label">Różnica</span>
                        <span className="stats-value">
                            {netMaterials >= 0 ? "+" : ""}${netMaterials.toLocaleString()}
                        </span>
                    </div>
                </div>

            </div>

            <p className="stats-section-label">Ludzie</p>
            <div className="stats-grid">

                <div className="stats-card">
                    <div className="stats-body">
                        <span className="stats-label">Mieszkańcy</span>
                        <span className="stats-value">{population.toLocaleString()}</span>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-body">
                        <span className="stats-label">Wolne mieszkania</span>
                        <span className="stats-value">{apartmentsAvailable.toLocaleString()}</span>
                    </div>
                </div>
                <div className="stats-card stats-card--wide stats-card--bar">
                    <div className="stats-body" style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span className="stats-label">Wykorzystanie</span>
                            <span className="stats-value stats-value--sm">{housingFillRate}%</span>
                        </div>
                        <div className="stats-bar-track">
                            <div
                                className={getFillClass(housingFillRate)}
                                style={{ width: `${housingFillRate}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <p className="stats-section-label">Praca</p>
            <div className="stats-grid">

                <div className="stats-card">
                    <div className="stats-body">
                        <span className="stats-label">Zatrudnieni</span>
                        <span className="stats-value">{jobsTaken.toLocaleString()}</span>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-body">
                        <span className="stats-label">Wolne etaty</span>
                        <span className="stats-value">{jobsAvailable.toLocaleString()}</span>
                    </div>
                </div>

                <div className="stats-card stats-card--wide stats-card--bar">
                    <div className="stats-body" style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span className="stats-label">Wykorzystanie</span>
                            <span className="stats-value stats-value--sm">{jobFillRate}%</span>
                        </div>
                        <div className="stats-bar-track">
                            <div
                                className={getFillClass(jobFillRate)}
                                style={{ width: `${jobFillRate}%` }}
                            />
                        </div>
                    </div>
                </div>

            </div>

            <p className="stats-section-label">Miasto</p>
            <div className="stats-grid">

                <div className="stats-card">
                    <div className="stats-body">
                        <span className="stats-label">Budynki</span>
                        <span className="stats-value">{buildingsBuilt}</span>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-body">
                        <span className="stats-label">Tury</span>
                        <span className="stats-value">{turnsPlayed}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
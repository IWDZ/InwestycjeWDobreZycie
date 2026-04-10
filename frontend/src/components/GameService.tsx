import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHammer, faMap, faChartBar, faUsers,
    faShop
} from '@fortawesome/free-solid-svg-icons'

const TABS: { id: string; label: string; icon: any }[] = [
    { id: 'build', label: 'Buduj', icon: faHammer },
    { id: 'plots', label: 'Ploty', icon: faMap },
    { id: 'shop', label: 'Sklep', icon: faShop },
    { id: 'stats', label: 'Statystyki', icon: faChartBar },
    { id: 'players', label: 'Gracze', icon: faUsers },
]

export function GameService() {
    const [activeTab, setActiveTab] = useState("")
    const [materialsOpen, setMaterialsOpen] = useState(false)
    const [happiness, setHappiness] = useState(50);

    function happinessColor(pct: number): string {
        if (pct === 50) return '#f5a800'
        if (pct > 50) return '#1D9E75'
        return '#e03030'
    }

    return (
        <>
            <div className="game-wrapper">
                <div className="game-container">
                    <header className="game-header">
                        <div className="game-header-left">
                            <span className="game-city-name">Miasto</span>
                            <span className="game-turn-info">Tura 1</span>
                        </div>

                        <div className="game-money-info">
                            <span className="game-money-symbol">$</span>
                            <p className="game-money" id="game-money">10000</p>
                        </div>

                        <div className="game-header-right">
                            <div className="game-happiness">
                                <span className="happiness-label">Zadowolenie</span>
                                <div className="happiness-progress-bar">
                                    <div
                                        className="happiness-fill"
                                        style={{ width: `${happiness}%`, background: happinessColor(happiness)}}
                                    />
                                </div>
                                <span className="happiness-percentage" id="happiness-percentage" style={{color: happinessColor(happiness)}}>
                                    {happiness}%
                                </span>
                            </div>

                            <div
                                className="materials-button"
                                onClick={() => setMaterialsOpen(o => !o)}
                            >
                                <span>Surowce</span>
                                <span className={`materials-arrow ${materialsOpen ? 'open' : ''}`}>▾</span>

                                {materialsOpen && (
                                    <div className="materials-dropdown">
                                        <p className="materials-dropdown-title">Magazyn</p>
                                        <div className="materials-grid">

                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    <main className="game-map">

                    </main>


                    <footer className="game-footer">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                className={`game-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <FontAwesomeIcon icon={tab.icon} className="game-nav-icon" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </footer>
                </div>
            </div>
        </>
    )
}
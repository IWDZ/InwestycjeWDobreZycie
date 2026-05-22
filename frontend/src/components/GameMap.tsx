import { GameManager } from "../services/game/GameManager";
import { useState } from "react";

export function GameMap() {
    const plotManager = GameManager.getInstance().plotManager;
    const { gridSize } = plotManager;
    const [selectedPlot, setSelectedPlot] = useState<number | null>(null);

    return (
        <div
            className="game-grid"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
            {Array.from({ length: gridSize * gridSize }, (_, i) => {
                const col = i % gridSize;
                const unlocked = plotManager.isUnlocked(i);
                const isPort = col === 0;

                if (!unlocked) return <div key={i} className="plot plot-hidden" />

                return (
                    <div
                        key={i}
                        className={[
                            'plot',
                            'plot-unlocked',
                            isPort ? 'plot-port' : '',
                            selectedPlot === i ? 'plot-selected' : ''
                        ].join(' ')}
                        onClick={() => setSelectedPlot(i)}
                    />
                )
            })}
        </div>
    )
}
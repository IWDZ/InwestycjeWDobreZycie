import { GameManager } from "../services/game/GameManager";

interface GameEndProps {
  onBackToLobby: () => void;
  isNuked: boolean;
}

export function GameEnd({ onBackToLobby, isNuked }: GameEndProps) {
  const leaderboard = GameManager.getInstance().leaderboard;
  const sorted = Object.entries(leaderboard.playerList).sort(
    ([, a], [, b]) => b!.worth - a!.worth,
  );

  return (
    <div className="gameend-screen">
      <div className="gameend-card">
        <div className="gameend-header">
          {isNuked && <h1 className="gameend-title">Dostałeś atomówką</h1>}
          {!isNuked && <h1 className="gameend-title">Koniec gry</h1>}
        </div>

        <div className="leaderboard-player-list">
          {isNuked && <p className="panel-title">Wyniki teraźniejsze</p>}
          {!isNuked && <p className="pane-title">Wyniki końcowe</p>}
          {sorted.map(([id, player], index) => (
            <div key={id} className="leaderboard-player">
              <span className="leaderboard-place">{`#${index + 1}`}</span>
              <span className="leaderboard-name">{player!.username}</span>
              <span className="leaderboard-money">
                ${player!.worth.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <button className="gameend-back-btn" onClick={onBackToLobby}>
          Wróć do lobby
        </button>
      </div>
    </div>
  );
}

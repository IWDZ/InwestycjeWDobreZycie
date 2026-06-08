import { GameManager } from "../services/game/GameManager";

interface GameEndProps {
  onBackToLobby: () => void;
}

export function GameEnd({ onBackToLobby }: GameEndProps) {
  const leaderboard = GameManager.getInstance().leaderboard;
  const sorted = Object.entries(leaderboard.playerList)
    .sort(([, a], [, b]) => b!.worth - a!.worth);


  return (
    <div className="gameend-screen">
      <div className="gameend-card">
        <div className="gameend-header">
          <h1 className="gameend-title">Koniec gry</h1>
        </div>

        <div className="leaderboard-player-list">
          <p className="panel-title">Wyniki końcowe</p>
          {sorted.map(([id, player], index) => (
            <div key={id} className="leaderboard-player">
              <span className="leaderboard-place">
                {`#${index + 1}`}
              </span>
              <span className="leaderboard-name">{player!.username}</span>
              <span className="leaderboard-money">${player!.worth.toLocaleString()}</span>
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
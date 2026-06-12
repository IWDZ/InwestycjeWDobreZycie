import { useLocale } from "../locale/Locale";
import { GameManager } from "../services/game/GameManager";

interface GameEndProps {
  onBackToLobby: () => void;
  isNuked: boolean;
}

export function GameEnd({ onBackToLobby, isNuked }: GameEndProps) {
  const l = useLocale();
  const leaderboard = GameManager.getInstance().leaderboard;
  const sorted = Object.entries(leaderboard.playerList).sort(
    ([, a], [, b]) => b!.worth - a!.worth,
  );

  return (
    <div className="gameend-screen">
      <div className="gameend-card">
        <h1 className="gameend-title">
          {isNuked ? l.t("gameend.nuked") : l.t("gameend.title")}
        </h1>

        <div className="leaderboard-player-list">
          <p className="panel-title">
            {isNuked ? l.t("gameend.results") : l.t("gameend.finalresults")}
          </p>
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
          {l.t("ui.returntolobby")}
        </button>
      </div>
    </div>
  );
}

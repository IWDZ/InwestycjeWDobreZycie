import { useEffect, useState } from "react";
import { GameManager } from "../../services/game/GameManager";

export function LeaderboardPanel() {
  const leaderboard = GameManager.getInstance().leaderboard;
  const [playerList, setPlayerList] = useState(leaderboard.playerList);

  useEffect(() => {
    const handler = () => setPlayerList({ ...leaderboard.playerList });
    leaderboard.onChange.push(handler);
    return () => {
      leaderboard.onChange = leaderboard.onChange.filter(
        (cb) => cb !== handler,
      );
    };
  }, []);

  return (
    <>
      <div className="panel">
        <p className="panel-title">Leaderboard</p>

        <div className="leaderboard-player-list">
          {Object.entries(playerList)
            .sort(([, a], [, b]) => b!.worth - a!.worth)
            .map(([id, player], index) => (
              <div key={id} className="leaderboard-player">
                <span className="leaderboard-place">#{index + 1}</span>
                <span className="leaderboard-name">{player!.username}</span>
                <span className="leaderboard-money">${player!.worth}</span>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

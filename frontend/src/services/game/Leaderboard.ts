import { ws } from "../WebsocketManager";

export type PlayerLeaderboard = {
  worth: number;
  username: string;
};

export class Leaderboard {
  public playerList: Partial<Record<number, PlayerLeaderboard>>;
  public onChange: (() => void)[] = [];

  public constructor() {
    this.playerList = {};
    ws.register_handler("update_leaderboard", (data: unknown) => {
      console.log(data)
      this.updateLeaderboard(data as Record<number, PlayerLeaderboard>)
    })
    ws.register_handler("game_end", (data: any) => {
      console.log(data)
      this.updateLeaderboard(data.leaderboard as Record<number, PlayerLeaderboard>)
    })
  }

  public updateLeaderboard(rec: Record<number, PlayerLeaderboard>) {
    this.playerList = rec;
    this.onChange.forEach((cb) => cb());
  }
}

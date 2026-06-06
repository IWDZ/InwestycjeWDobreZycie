export type PlayerLeaderboard = {
  money: number;
  name: string;
};

export class Leaderboard {
  public playerList: Partial<Record<number, PlayerLeaderboard>>;
  public onChange: (() => void)[] = [];

  public constructor() {
    this.playerList = {};
  }

  public updateLeaderboard(rec: Record<number, PlayerLeaderboard>) {
    this.playerList = rec;
    this.onChange.forEach((cb) => cb());
  }
}


export type PlayerLeaderboard = {
    money: number,
    name: string
}

export class Leaderboard {
    public playerList: Partial<Record<number, PlayerLeaderboard>>

    public constructor() {
        this.playerList = {}
    }

}
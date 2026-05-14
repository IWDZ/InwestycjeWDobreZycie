import { PlotManager } from "./PlotManager";

export class GameManager {
    private static instance: GameManager;

    public plotManager: PlotManager;

    private constructor() {
        this.plotManager = new PlotManager();
    }

    public static getInstance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    public startGame() {
        this.plotManager = new PlotManager();
    }

    public reset() {
        this.plotManager = new PlotManager();
    }
}
import { PlotManager } from "./PlotManager";

export class GameManager {
    public plotManager: PlotManager;

    constructor() {
        this.plotManager = new PlotManager();
    }

    public startGame() {
        // Reset poprzednich danych
        this.plotManager = new PlotManager();
    }
}
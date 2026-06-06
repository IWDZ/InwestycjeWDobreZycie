import { Inventory } from "./Inventory";
import { Leaderboard } from "./Leaderboard";
import { PlotManager } from "./PlotManager";
import { ShopManager } from "./ShopManager";
import { Happiness } from "./Happiness";

export class GameManager {
  private static instance: GameManager;

  public plotManager: PlotManager;
  public shopManager: ShopManager;
  public inventory: Inventory;
  public leaderboard: Leaderboard;
  public happiness: Happiness;

  private constructor() {
    this.plotManager = new PlotManager();
    this.inventory = new Inventory();
    this.shopManager = new ShopManager();
    this.leaderboard = new Leaderboard();
    this.happiness = new Happiness();
  }

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public startGame() {
    this.plotManager = new PlotManager();
    this.inventory = new Inventory();
    this.leaderboard = new Leaderboard();
    this.shopManager = new ShopManager();
    this.happiness = new Happiness();
  }

  public reset() {
    this.plotManager = new PlotManager();
    this.inventory = new Inventory();
    this.leaderboard = new Leaderboard();
    this.shopManager = new ShopManager();
    this.happiness = new Happiness();
  }
}

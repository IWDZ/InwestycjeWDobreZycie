import { Inventory } from "./Inventory";
import { Leaderboard } from "./Leaderboard";
import { PlotManager } from "./PlotManager";
import { ShopManager } from "./ShopManager";
import { Happiness } from "./Happiness";
import { ws } from "../WebsocketManager";
import { BUILDINGS, parseBuildingsFromServer, setBuildings } from "./statics/BuildingData";

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

  public startGame(data: any) {
    this.plotManager = new PlotManager();
    this.plotManager.syncFromServer(data.field)
    
    this.inventory = Inventory.getInstance();
    this.inventory.money = data.money;
    
    this.leaderboard = new Leaderboard();
    
    this.shopManager = ShopManager.getInstance();
    
    this.happiness = new Happiness();
    this.happiness.level = data.happiness;

    setBuildings(parseBuildingsFromServer(data.buildings));

    ws.socket.onAny((event, data) => {
      console.log("[GameManager] ws event:", event, data);
    });
  }

  public reset() {
    this.plotManager = new PlotManager();
    this.inventory = new Inventory();
    this.leaderboard = new Leaderboard();
    this.shopManager = new ShopManager();
    this.happiness = new Happiness();
  }
}

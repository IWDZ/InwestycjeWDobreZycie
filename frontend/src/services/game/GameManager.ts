import { Inventory } from "./Inventory";
import { Leaderboard } from "./Leaderboard";
import { PlotManager } from "./PlotManager";
import { ShopManager } from "./ShopManager";
import { Happiness } from "./Happiness";
import { ws } from "../WebsocketManager";
import { BUILDINGS, parseBuildingsFromServer, setBuildings } from "./statics/BuildingData";
import { MaterialMarket } from "./MaterialMarket";
import { MATERIAL_MAP, Materials } from "./statics/Materials";

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
    this.inventory.syncMaterials(data.playerMaterials)
    
    this.leaderboard = new Leaderboard();
    
    this.shopManager = ShopManager.getInstance();

    const market = MaterialMarket.getInstance();
    const updates = Object.entries(data.materialPrices)
      .filter(([, price]) => price != null)
      .map(([key, price]) => ({
        mat: MATERIAL_MAP[key.toLowerCase()],
        value: price,
      }))
      .filter((x) => x.mat !== undefined) as { mat: Materials; value: number}[];
    market.addMaterialPrice(updates);
    
    this.happiness = new Happiness();
    this.happiness.level = data.happiness;

    setBuildings(parseBuildingsFromServer(data.buildings));

    ws.socket.offAny(this.logDebug);
    ws.socket.onAny(this.logDebug);
  }

  private logDebug(event: unknown, data: unknown) {
    console.log("[GameManager] ws event:", event, data);
  }

  public reset() {
    this.plotManager = new PlotManager();
    this.inventory = new Inventory();
    this.leaderboard = new Leaderboard();
    this.shopManager = new ShopManager();
    this.happiness = new Happiness();
  }
}

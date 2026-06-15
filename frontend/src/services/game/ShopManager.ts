import { MATERIAL_SERVER_KEY, Materials } from "./statics/Materials";
import { MaterialMarket } from "./MaterialMarket";
import { Inventory } from "./Inventory";
import { ws } from "../WebsocketManager";
import { roomManager } from "../../components/MainMenuService";

export class ShopManager {
  private static instance: ShopManager;
  public static getInstance(): ShopManager {
    if (!ShopManager.instance) {
      ShopManager.instance = new ShopManager();
    }
    return ShopManager.instance;
  }

  public buy(material: Materials, count: number): boolean {
    const inventory = Inventory.getInstance();
    const materialMarket = MaterialMarket.getInstance();
    const materialPrice = materialMarket.getCurrentPrice(material);
    if (!inventory.hasEnoughMoney(materialPrice * count)) {
      return false;
    }
    ws.notify("buy_material", {
      gameCode: roomManager.roomId,
      material: MATERIAL_SERVER_KEY[material],
      amount: count,
    });
    return true;
  }

  public sell(material: Materials, count: number): boolean {
    const inventory = Inventory.getInstance();
    if (!inventory.hasEnoughMaterials(material, count)) {
      return false;
    }
    ws.notify("sell_material", {
      gameCode: roomManager.roomId,
      material: MATERIAL_SERVER_KEY[material],
      amount: count,
    });
    return true;
  }
}

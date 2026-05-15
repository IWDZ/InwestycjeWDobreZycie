import { Materials } from "./statics/Materials"
import { Inventory } from "./Inventory"
import { MaterialMarket } from "./MaterialMarket";

export class ShopManager {
    private static instance: ShopManager;

    public static getInstance(): ShopManager {
        if (!ShopManager.instance) {
            ShopManager.instance = new ShopManager();
        }
        return ShopManager.instance;
    }

    public buy(material: Materials, count: number): boolean {
        var inventory = Inventory.getInstance();
        var materialMarket = MaterialMarket.getInstance();

        var materialPrice = materialMarket.getCurrentPrice(material);

        if (!inventory.hasEnoughMoney(materialPrice * count)) {
            return false
        }

        // request do serwa ze kupujemy materialy

        inventory.removeMoney(materialPrice * count);
        inventory.addMaterials(material, count);
        return true
    }

    public sell(material: Materials, count: number): boolean {
        var inventory = Inventory.getInstance();
        var materialMarket = MaterialMarket.getInstance();

        var materialPrice = materialMarket.getCurrentPrice(material);

        if (!inventory.hasEnoughMaterials(material, count)) {
            return false
        }

        // request do serwa ze sprzedajemy materialy

        inventory.addMoney(materialPrice * count);
        inventory.removeMaterials(material, count);
        return true
    }
}
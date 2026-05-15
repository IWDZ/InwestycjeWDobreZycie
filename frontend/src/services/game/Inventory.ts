import { Materials } from "./statics/Materials";

export class Inventory {
    public static instance: Inventory;

    public materialCount: Partial<Record<Materials, number>>;
    public money: number;

    public constructor() {
        this.materialCount = {}
        this.money = 0;
    }

    public static getInstance(): Inventory {
        if (!Inventory.instance)
            Inventory.instance = new Inventory();
        return Inventory.instance;
    }

    public addMaterials(material: Materials, count: number) {
        if (this.materialCount[material]) {
            this.materialCount[material] += count;
        } else {
            this.materialCount[material] = count;
        }
    }

    public hasEnoughMaterials(material: Materials, count: number): boolean {
        if (!this.materialCount[material]) {
            return false;
        }

        return this.materialCount[material] >= count
    }

    public removeMaterials(material: Materials, count: number): boolean {
        if (this.materialCount[material] && this.materialCount[material] > count) {
            this.materialCount[material] -= count;
            return true;
        }

        return false;
    }

    public addMoney(c: number) {
        this.money += c;
    }

    public hasEnoughMoney(c: number) {
        return this.money >= c;
    }

    public removeMoney(c: number): boolean {
        if (this.hasEnoughMoney(c)) {
            this.money -= c;
            return true
        }
        return false;
    }
}
import { Materials } from "./statics/Materials";

export class MaterialMarket {
    public static instance: MaterialMarket;

    public prices: Partial<Record<Materials, number>>
    public priceHistory: Partial<Record<Materials, Array<number>>>

    public constructor() {
        this.prices = {}
        this.priceHistory = {}
    }

    public static getInstance(): MaterialMarket {
        if (!MaterialMarket.instance)
            MaterialMarket.instance = new MaterialMarket();
        return MaterialMarket.instance;
    }

    public getCurrentPrice(mat: Materials): number {
        if (!this.prices[mat]) {
            return 0;
        }

        return this.prices[mat]
    }

    public getPriceHistory(mat: Materials): Array<number> {
         if (!this.priceHistory[mat]) {
            return new Array();
        }

        return this.priceHistory[mat]
    }
}
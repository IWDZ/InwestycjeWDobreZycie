import { Materials } from "./statics/Materials";

type MaterialValue = {
    mat: Materials,
    value: number
}

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

    public addMaterialPrice(mats: MaterialValue[]) {
        mats.forEach(mat => {
            if (this.prices[mat.mat] !== undefined) {
                const history = this.priceHistory[mat.mat] ?? []
                this.priceHistory[mat.mat] = history
                history.push(this.prices[mat.mat]!)
            }
            this.prices[mat.mat] = mat.value
        });
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
import { Materials } from "./Materials"

enum BuildingName {
    
}

class BuildingDatabaseEntry {
    public name: BuildingName
    public materialCost: Array<Materials>
    public moneyCost: number;

    constructor(name: BuildingName, materialCost: Array<Materials>, moneyCost: number) {
        this.name = name
        this.materialCost = materialCost;
        this.moneyCost = moneyCost;
    }
}
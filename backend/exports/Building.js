import res from "express/lib/response.js";
import { BUILDINGS } from "../gameStorage.js";

class Building {
    #id;
    #building;
    #startLocation;
    #isVertical;
    buildingName
    workers;
    residents;

    constructor(id, building, startLocation, isVertical) {
        this.#id = id;
        this.#building = building;
        this.#startLocation = startLocation;
        this.#isVertical = isVertical;
        this.buildingName = building.NAME;
        if (this.buildingName === BUILDINGS.TOWN_HALL.NAME) {
            this.workers = 3;
            this.residents = 3;
        }
    }

    get id() {
        return this.#id;
    }

    get building() {
        return this.#building;
    }

    get startLocation() {
        return this.#startLocation;
    }

    get isVertical() {
        return this.#isVertical;
    }
}

export default Building;
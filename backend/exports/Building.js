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
        this.workers = this.residents = this.buildingName === BUILDINGS.TOWN_HALL.NAME ? 3 : 0;
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
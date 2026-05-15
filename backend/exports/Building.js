import { BUILDINGS } from "../gameStorage";

class Building {
    #id;
    #building;
    #startLocation;
    #isVertical

    constructor(id, building, startLocation, isVertical) {
        this.#id = id;
        this.#building = building;
        this.#startLocation = startLocation;
        this.#isVertical = isVertical;
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
import { BUILDINGS } from "../gameStorage";

class Building {
    #id;
    #building = BUILDINGS.TOWN_HALL;

    constructor(building, id) {
        this.#building = building;
        
    }
}

export default Building;
import util from "util";
import { BUILDINGS, START_TOWN_HALL_POPULATION } from "../gameStorage.js";
import Person from "./Person.js";

class Building {
    #id;
    #building;
    #startLocation;
    #isVertical;
    buildingName;
    #workers;
    #residents;
    workersCount;
    residentsCount;

    constructor(id, building, startLocation, isVertical) {
        this.#id = id;
        this.#building = building;
        this.#startLocation = startLocation;
        this.#isVertical = isVertical;
        this.buildingName = building.NAME;
        this.#workers = [];
        this.#residents = [];
        this.workersCount = this.residentsCount = 0;
        if (this.buildingName === BUILDINGS.TOWN_HALL.NAME) {
            for (let i = 0; i < START_TOWN_HALL_POPULATION; i++) {
                const person = new Person(startLocation, startLocation);
                this.addWorker(person);
                this.addResident(person);
            }
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

    get workers() {
        return this.#workers;
    }

    get residents() {
        return this.#residents;
    }

    addWorker(person) {
        this.#workers.push(person);
        this.workersCount++;
    }
    
    removeWorker(personToRemove) {
        this.#workers = this.#workers.filter(person => person !== personToRemove);
        this.workersCount--;
    }

    addResident(person) {
        this.#residents.push(person);
        this.residentsCount++;
    }

    removeResident(personToRemove) {
        this.#residents = this.#residents.filter(person => person !== personToRemove);
        this.residentsCount--;
    }
}

export default Building;
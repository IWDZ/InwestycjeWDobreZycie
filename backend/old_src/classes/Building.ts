import { FieldLocation } from "../../../shared/types/types.js"
import { BuildingName, BuildingObject, BUILDINGS, START_TOWN_HALL_POPULATION } from "../config/buildings.js";
import { Materials } from "../config/materials.js";
import Person from "./Person.js";

class Building {
    private readonly _id: number;
    private readonly _startLocation: FieldLocation;
    private readonly _isVertical: boolean;

    public readonly buildingName: BuildingName;
    public readonly moneyPerJob: number;
    public readonly width: number;
    public readonly height: number;
    public readonly happiness: number;
    public readonly jobs: number;
    public readonly apartments: number;
    public readonly materialCost: Partial<Materials>;
    public readonly moneyCost: number;

    private _workers: Person[];
    private _residents: Person[];
    public workersCount: number;
    public residentsCount: number;

    constructor(id: number, building: BuildingObject, startLocation: FieldLocation, isVertical: boolean) {
        this._id = id;
        this._startLocation = startLocation;
        this._isVertical = isVertical;
        this.buildingName = building.NAME;
        this.moneyPerJob = building.MONEY_PER_JOB;
        this.width = building.WIDTH;
        this.height = building.HEIGHT;
        this.happiness = building.HAPPINESS;
        this.jobs = building.JOBS;
        this.apartments = building.APARTMENTS;
        this.materialCost = building.MATERIAL_COST;
        this.moneyCost = building.MONEY_COST;
        this._workers = [];
        this._residents = [];
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
        return this._id;
    }

    /* get building() {
        return this._building;
    }*/

    get startLocation() {
        return this._startLocation;
    }

    get isVertical() {
        return this._isVertical;
    }

    get workers() {
        return this._workers;
    }

    get residents() {
        return this._residents;
    }

    addWorker(person: Person) {
        this._workers.push(person);
        this.workersCount++;
    }
    
    removeWorker(personToRemove: Person) {
        this._workers = this._workers.filter(person => person !== personToRemove);
        this.workersCount--;
    }

    addResident(person: Person) {
        this._residents.push(person);
        this.residentsCount++;
    }

    removeResident(personToRemove: Person) {
        this._residents = this._residents.filter(person => person !== personToRemove);
        this.residentsCount--;
    }
}

export default Building;
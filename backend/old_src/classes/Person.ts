import { FieldLocation } from "../../../shared/types/types.js";
import { getNextRandomAvailableApartmentBuilding, getNextRandomAvailableJobBuilding } from "../utils/buildingUtils.js";

class Person {
    private _jobLocation: FieldLocation;
    private _apartmentLocation: FieldLocation;

    constructor(jobLocation: FieldLocation, apartmentLocation: FieldLocation) {
        this._jobLocation = jobLocation;
        this._apartmentLocation = apartmentLocation;
    }

    get jobLocation() {
        return this._jobLocation;
    }

    get apartmentLocation() {
        return this._apartmentLocation;
    }

    relocateJob(game, player) {
        const field = player.field;

        if (player.population > player.jobSpaces) {
            const { y, x } = this._apartmentLocation;
            const apartmentBuilding = field[y][x];
            apartmentBuilding.removeResident(this);
            const jobBuilding = field[this._jobLocation.y][this._jobLocation.x];
            player.income -= jobBuilding.building.MONEY_PER_JOB;
            player.population--;
            game.populationPool++;
            return;
        }

        const { y, x } = this._jobLocation;
        const jobBuilding = field[y][x];
        const newJobBuilding = getNextRandomAvailableJobBuilding(player, new Set([field[y][x].id]));
        this._jobLocation = newJobBuilding.startLocation;
        newJobBuilding.addWorker(this);
        player.income -= jobBuilding.building.MONEY_PER_JOB;
        player.income += newJobBuilding.building.MONEY_PER_JOB;
    }

    relocateApartment(game, player) {
        const field = player.field;

        if (player.population > player.apartmentSpaces) {
            const { y, x } = this._jobLocation;
            const jobBuilding = field[y][x];
            jobBuilding.removeWorker(this);
            player.income -= jobBuilding.building.MONEY_PER_JOB;
            player.population--;
            game.populationPool++;
            return;
        }

        const { y, x } = this._apartmentLocation;
        const apartmentBuilding = getNextRandomAvailableApartmentBuilding(player, new Set([field[y][x].id]));
        this._apartmentLocation = apartmentBuilding.startLocation;
        apartmentBuilding.addResident(this);
    }
}

export default Person;
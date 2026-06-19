import { getNextRandomAvailableApartmentBuilding, getNextRandomAvailableJobBuilding } from "../utils/buildingUtils.js";

class Person {
    #jobLocation;
    #apartmentLocation;

    constructor(jobLocation, apartmentLocation) {
        this.#jobLocation = jobLocation;
        this.#apartmentLocation = apartmentLocation;
    }

    get jobLocation() {
        return this.#jobLocation;
    }

    get apartmentLocation() {
        return this.#apartmentLocation;
    }

    relocateJob(game, player) {
        const field = player.field;

        if (player.population > player.jobSpaces) {
            const { y, x } = this.#apartmentLocation;
            const apartmentBuilding = field[y][x];
            apartmentBuilding.removeResident(this);
            const jobBuilding = field[this.#jobLocation.y][this.#jobLocation.x];
            player.income -= jobBuilding.building.MONEY_PER_JOB;
            player.population--;
            game.populationPool++;
            return;
        }

        const { y, x } = this.#jobLocation;
        const jobBuilding = field[y][x];
        const newJobBuilding = getNextRandomAvailableJobBuilding(player, new Set([field[y][x].id]));
        this.#jobLocation = newJobBuilding.startLocation;
        newJobBuilding.addWorker(this);
        player.income -= jobBuilding.building.MONEY_PER_JOB;
        player.income += newJobBuilding.building.MONEY_PER_JOB;
    }

    relocateApartment(game, player) {
        const field = player.field;

        if (player.population > player.apartmentSpaces) {
            const { y, x } = this.#jobLocation;
            const jobBuilding = field[y][x];
            jobBuilding.removeWorker(this);
            player.income -= jobBuilding.building.MONEY_PER_JOB;
            player.population--;
            game.populationPool++;
            return;
        }

        const { y, x } = this.#apartmentLocation;
        const apartmentBuilding = getNextRandomAvailableApartmentBuilding(player, new Set([field[y][x].id]));
        this.#apartmentLocation = apartmentBuilding.startLocation;
        apartmentBuilding.addResident(this);
    }
}

export default Person;
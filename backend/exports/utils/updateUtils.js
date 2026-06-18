import Person from "../classes/Person.js";
import { HAPPINESS_MULTIPLIER, MATERIAL_PRICES, MATERIALS, MIN_POPULATION, START_HAPPINESS, WORK_MULTIPLIER } from "../gameStorage.js";
import { getNextRandomAvailableJobBuilding, getNextRandomAvailableApartmentBuilding, getEmptyApartments, getEmptyJobs, getNextRandomOccupiedJobBuilding } from "./buildingUtils.js";
import { getHappiness } from "./playerUtils.js";

export function increasePopulation(game, player, populationToAdd) {
    const pool = game.populationPool;
    const population = player.population;
    const jobSpaces = player.jobSpaces;
    const apartmentSpaces = player.apartmentSpaces;

    if (population + populationToAdd > jobSpaces){
        populationToAdd = jobSpaces - population;
    }
    if (population + populationToAdd > apartmentSpaces) {
        populationToAdd = apartmentSpaces - population;
    }
    if (pool < populationToAdd) populationToAdd = pool;
    if (populationToAdd === 0) return;

    assignPopulation(player, populationToAdd);

    player.population += populationToAdd;
    game.populationPool -= populationToAdd;
}

export function assignPopulation(player, populationToAssign) {
    const ignoredJobBuildingIDs = new Set();
    const ignoredApartmentBuildingIDs = new Set();
    let jobBuilding = getNextRandomAvailableJobBuilding(player, ignoredJobBuildingIDs);
    let apartmentBuilding = getNextRandomAvailableApartmentBuilding(player, ignoredApartmentBuildingIDs);

    while (populationToAssign > 0) {
        ({ jobBuilding, apartmentBuilding } = verifyBuildingAvailability(player, jobBuilding, apartmentBuilding, ignoredJobBuildingIDs, ignoredApartmentBuildingIDs))

        populationToAssign = populateBatch(player, jobBuilding, apartmentBuilding, populationToAssign);
    }
}

export function verifyBuildingAvailability(player, jobBuilding, apartmentBuilding, ignoredJobBuildingIDs, ignoredApartmentBuildingIDs) {
    let emptyJobs = getEmptyJobs(jobBuilding);
    let emptyApartments = getEmptyApartments(apartmentBuilding);
    
    if (emptyJobs === 0) {
        jobBuilding = getNextRandomAvailableJobBuilding(player, ignoredJobBuildingIDs);
    }
    if (emptyApartments === 0) {
        apartmentBuilding = getNextRandomAvailableApartmentBuilding(player, ignoredApartmentBuildingIDs);
    }

    return { jobBuilding, apartmentBuilding };
}

export function populateBatch(player, jobBuilding, apartmentBuilding, populationToAdd) {
    let emptyJobs = getEmptyJobs(jobBuilding);
    let emptyApartments = getEmptyApartments(apartmentBuilding);

    const count = Math.min(emptyJobs, emptyApartments, populationToAdd);
    
    for (let i = 0; i < count; i ++) {
        const person = new Person(jobBuilding.startLocation, apartmentBuilding.startLocation);

        jobBuilding.addWorker(person)
        player.income += jobBuilding.building.MONEY_PER_JOB;
        apartmentBuilding.addResident(person);
    }

    return populationToAdd - count;
}

export function decreasePopulation(game, player, populationToRemove) {
    const population = player.population;
    
    if (population - populationToRemove < MIN_POPULATION) populationToRemove = population - MIN_POPULATION;
    if (populationToRemove === 0) return;

    removePopulation(player, removePopulation);

    player.population -= populationToRemove;
    game.populationPool += populationToRemove;
}

export function removePopulation(player, populationToRemove) {
    const ignoredIDs = new Set();
    let jobBuilding = getNextRandomOccupiedJobBuilding(player, ignoredIDs);

    while (populationToRemove > 0) {
        jobBuilding = verifyBuildingOccupancy(player, jobBuilding, ignoredIDs)

        populationToRemove = removeBatch(player, jobBuilding, populationToRemove);
    }
}

export function verifyBuildingOccupancy(player, jobBuilding, ignoredIDs) {
    if (jobBuilding.workersCount === 0) {
        jobBuilding = getNextRandomOccupiedJobBuilding(player, ignoredIDs);
    }

    return jobBuilding;
}

export function removeBatch(player, jobBuilding, populationToRemove) {
    const workers = jobBuilding.workers;
    const field = player.field;
    let index = 0;
    while (jobBuilding.workersCount > 0 && populationToRemove > 0) {
        removePerson(field, jobBuilding, workers[index]);
        player.income -= jobBuilding.building.MONEY_PER_JOB;
        index++;
        populationToRemove--;
    }

    return populationToRemove;
}

export function removePerson(field, jobBuilding, personToRemove) {
    const { y, x } = person.apartmentLocation;
    const apartmentBuilding = field[y][x];

    jobBuilding.removeWorker(personToRemove);
    apartmentBuilding.removeResident(personToRemove);
}

function scaleChange(base, volatility) {
    return 1 + (base - 1) * volatility;
}

export function updateMarket(game) {
    const marketVolatility = game.settings.MARKET_VOLATILITY;
    for (const material of Object.values(MATERIALS)) {
        let newPrice = game.materialPrices[material];

        if (Math.random() < 0.5) {
            if (isMaterialPriceAboveMultiplier(newPrice, material, 1/3))
                newPrice *= scaleChange(Math.random() * 0.2 + 0.8, marketVolatility);
        } else {
            if (!isMaterialPriceAboveMultiplier(newPrice, material, 2.5))
                newPrice *= scaleChange(Math.random() * 0.2 + 1, marketVolatility);
        }

        if (isMaterialPriceAboveMultiplier(newPrice, material, 2.5)) newPrice = MATERIAL_PRICES[material] * 2.5;
        if (!isMaterialPriceAboveMultiplier(newPrice, material, 1/3)) newPrice = MATERIAL_PRICES[material] * (1/3);
        game.materialPrices[material] = Math.round(newPrice);
    }
}

export function updatePopulation(game) {
    for (const player of game.players) {
        const population = player.population;
        const jobSpaces = player.jobSpaces;

        const happinessFactor = (getHappiness(player) - START_HAPPINESS) * HAPPINESS_MULTIPLIER;
        const workFactor = (jobSpaces - population) * WORK_MULTIPLIER;

        const rawChange = (happinessFactor + workFactor) * (Math.random() * 0.6 + 0.7);
        let populationChange = rawChange >= 0 ? Math.ceil(rawChange) : Math.floor(rawChange);
        
        if (populationChange < 0) {
            decreasePopulation(game, player, Math.abs(populationChange));
        }else{
            increasePopulation(game, player, populationChange);
        }
    }
}

export function isMaterialPriceAboveMultiplier(newPrice, material, multiplier) {
    return newPrice > MATERIAL_PRICES[material] * multiplier;
}
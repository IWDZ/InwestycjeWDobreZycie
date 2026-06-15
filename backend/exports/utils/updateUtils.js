import { HAPPINESS_MULTIPLIER, MATERIAL_PRICES, MATERIALS, START_HAPPINESS, WORK_MULTIPLIER } from "../gameStorage.js";
import { getWorstAvailableBuilding, getWorstOccupiedBuilding } from "./buildingUtils.js";
import { getHappiness } from "./playerUtils.js";

export function increasePopulation(player, workersToIncrease, residentsToIncrease = workersToIncrease, ignoredIDs = new Set()) {
    if (workersToIncrease <= 0 && residentsToIncrease <= 0) return true;
    const population = player.population;
    if (population.workingPopulation + workersToIncrease > population.maxWorkingPopulation ||
        population.livingPopulation + residentsToIncrease > population.maxLivingPopulation) return false;
    
    const worstBuilding = getWorstAvailableBuilding(player, ignoredIDs);

    const emptyJobs = worstBuilding.building.JOBS - worstBuilding.workers;
    const emptyApartments = worstBuilding.building.APARTMENTS - worstBuilding.residents;

    if (emptyJobs >= workersToIncrease) {
        population.workingPopulation += workersToIncrease;
        worstBuilding.workers += workersToIncrease;
        workersToIncrease = 0;
    }else{
        population.workingPopulation += emptyJobs;
        workersToIncrease -= emptyJobs;
        worstBuilding.workers += emptyJobs;
    }

    if (emptyApartments >= residentsToIncrease) {
        population.livingPopulation += residentsToIncrease;
        worstBuilding.residents += residentsToIncrease;
        residentsToIncrease = 0;
    }else{
        population.livingPopulation += emptyApartments;
        residentsToIncrease -= emptyApartments;
        worstBuilding.residents += emptyApartments;
    }

    ignoredIDs.add(worstBuilding.id);
    return increasePopulation(player, workersToIncrease, residentsToIncrease, ignoredIDs);
}

export function decreasePopulation(player, workersToDecrease, residentsToDecrease = workersToDecrease, ignoredIDs = new Set()) {
    if (workersToDecrease <= 0 && residentsToDecrease <= 0) return true;
    const population = player.population;
    if (population.workingPopulation - workersToDecrease < 2) return false;

    const worstBuilding = getWorstOccupiedBuilding(player, ignoredIDs);

    if (worstBuilding.workers >= workersToDecrease) {
        population.workingPopulation -= workersToDecrease;
        worstBuilding.workers -= workersToDecrease;
        workersToDecrease = 0;
    }else{
        population.workingPopulation -= worstBuilding.workers;
        workersToDecrease -= worstBuilding.workers;
        worstBuilding.workers = 0;
    }

    if (worstBuilding.residents >= residentsToDecrease) {
        population.livingPopulation -= residentsToDecrease;
        worstBuilding.residents -= residentsToDecrease;
        residentsToDecrease = 0;
    }else{
        population.livingPopulation -= worstBuilding.residents;
        residentsToDecrease -= worstBuilding.residents;
        worstBuilding.residents = 0;
    }

    ignoredIDs.add(worstBuilding.id);
    return decreasePopulation(player, workersToDecrease, residentsToDecrease, ignoredIDs);
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
        const happinessFactor = (getHappiness(player) - START_HAPPINESS) * HAPPINESS_MULTIPLIER;
        const workFactor = (player.population.maxWorkingPopulation - player.population.workingPopulation) * WORK_MULTIPLIER;
        const rawChange = (happinessFactor + workFactor) * (Math.random() * 0.6 + 0.7);
        const populationChange = rawChange >= 0 ? Math.ceil(rawChange) : Math.floor(rawChange);
        if (populationChange < 0) {
            if(decreasePopulation(player, Math.abs(populationChange))) game.settings.POPULATION += Math.abs(populationChange);
        }else{
            if (game.settings.POPULATION >= populationChange)
                if(increasePopulation(player, populationChange)) game.settings.POPULATION -= populationChange;
        }
    }
}

export function isMaterialPriceAboveMultiplier(newPrice, material, multiplier) {
    return newPrice > MATERIAL_PRICES[material] * multiplier;
}
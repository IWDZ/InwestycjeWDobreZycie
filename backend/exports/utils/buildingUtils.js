import { BUILDINGS, EMPTY_CELL_INDICATOR, MAX_FIELD_SIZE } from "../gameStorage.js";
import Building from "../Building.js";
import { removeMaterials, removeMoney, returnMaterials, returnMoney } from "./inventoryUtils.js";
import { sendFieldUpdate, sendHappinessUpdate, sendMaterialsUpdate, sendMaxPopulationUpdate, sendMoneyDecrease, sendMoneyIncrease, sendMoneyUpdate, sendPopulationUpdate } from "../clientUpdates.js"
import { decreasePopulation } from "./updateUtils.js";

export function getCurrentBuildingId(game) {
    return game.settings.NEXT_BUILDING_ID++;
}

export function getBuildingByName(buildingName) {
    return Object.values(BUILDINGS).find(b => b.NAME === buildingName);
}

export function hasRequiredBuilding(building, field) {
    if (!building.REQUIRED_BUILDING) return true;
    for (let y = 0; y < MAX_FIELD_SIZE; y++) {
        for (let x = 0; x < MAX_FIELD_SIZE; x++) {
            const cell = field[y][x];
            if ((cell instanceof Building) && cell.buildingName === building.REQUIRED_BUILDING) {
                return true;
            }
        }
    }
    return false;
}

export function placeBuilding(game, player, field, buildingBounds, building, isVertical) {
    const { rowStart, columnStart, rowEnd, columnEnd } = buildingBounds;
    const id = getCurrentBuildingId(game);
    const buildingObject = new Building(id, building, [rowStart, columnStart], isVertical);
    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            field[y][x] = buildingObject;
        }
    }
    player.happiness += building.HAPPINESS;
    player.population.maxLivingPopulation += building.APARTMENTS;
    player.population.maxWorkingPopulation += building.JOBS;

    removeMaterials(player, building.MATERIAL_COST);
    removeMoney(player, building.MONEY_COST);

    sendFieldUpdate(player);
    sendHappinessUpdate(player);
    sendMaterialsUpdate(player);
    sendMoneyDecrease(player, building.MONEY_COST);
    sendMoneyUpdate(player);
    sendMaxPopulationUpdate(player);
}

export function isTownHall(buildingName) {
    return buildingName === BUILDINGS.TOWN_HALL.NAME;
}

export function getBuildingBounds(buildingObject) {
    const {building, startLocation, isVertical} = buildingObject;
    const height = isVertical ? building.WIDTH : building.HEIGHT;
    const width = isVertical ? building.HEIGHT : building.WIDTH;

    const rowStart = startLocation[0];
    const columnStart = startLocation[1];

    return {
        rowStart,
        columnStart,
        rowEnd: rowStart + height - 1,
        columnEnd: columnStart + width - 1
    };
}

export function canDeleteBuilding(field, buildingId, buildingBounds) {
    const { rowStart, columnStart, rowEnd, columnEnd } = buildingBounds;
    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            const cell = field[y][x];
            if (!(cell instanceof Building) || cell.id !== buildingId) {
                return false;
            }
        }
    }
    return true;
}

export function deleteBuilding(game, player, field, buildingBounds) {
    const { rowStart, columnStart, rowEnd, columnEnd } = buildingBounds;
    const buildingObject = field[rowStart][columnStart];
    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            field[y][x] = EMPTY_CELL_INDICATOR;
        }
    }
    const building = buildingObject.building;
    player.happiness -= building.HAPPINESS;
    const population = player.population;
    
    population.workingPopulation -= buildingObject.workers;
    population.livingPopulation -= buildingObject.residents;
    population.maxLivingPopulation -= building.APARTMENTS;
    population.maxWorkingPopulation -= building.JOBS;

    if (population.livingPopulation > population.maxLivingPopulation || population.workingPopulation > population.maxWorkingPopulation) {
        const livingPopulationDifference = population.livingPopulation - population.maxLivingPopulation;
        const workingPopulationDifference = population.workingPopulation - population.maxWorkingPopulation;
        const populationToDecrease = livingPopulationDifference > workingPopulationDifference ? livingPopulationDifference : workingPopulationDifference;
        if (decreasePopulation(player, populationToDecrease)) game.settings.POPULATION += populationToDecrease;
    }

    returnMaterials(player, building.MATERIAL_COST);
    const returningMoney = returnMoney(player, building.MONEY_COST);

    sendMoneyIncrease(player, returningMoney);
    sendFieldUpdate(player);
    sendHappinessUpdate(player);
    sendMaterialsUpdate(player);
    sendMoneyUpdate(player);
    sendPopulationUpdate(game);
}

export function getWorstAvailableBuilding(player, blockedIDs) {
    let worstBuilding = null;
    let minSalary = Infinity;
    for (let y = 0; y < MAX_FIELD_SIZE; y++) {
        for (let x = 0; x < MAX_FIELD_SIZE; x++) {
            const cell = player.field[y][x];
            if (cell instanceof Building && cell.building.MONEY_PER_JOB < minSalary && (cell.building.JOBS - cell.workers > 0 || cell.building.APARTMENTS - cell.residents > 0) && !blockedIDs.has(cell.id)) {
                minSalary = cell.building.MONEY_PER_JOB;
                worstBuilding = cell;
            }
        }
    }

    return worstBuilding;
}

export function getWorstOccupiedBuilding(player, blockedIDs) {
    let worstBuilding = null;
    let minSalary = Infinity;
    for (let y = 0; y < MAX_FIELD_SIZE; y++) {
        for (let x = 0; x < MAX_FIELD_SIZE; x++) {
            const cell = player.field[y][x];
            if (cell instanceof Building && cell.building.MONEY_PER_JOB < minSalary && (cell.workers > 0 || cell.residents > 0) && !blockedIDs.has(cell.id)) {
                minSalary = cell.building.MONEY_PER_JOB;
                worstBuilding = cell;
            }
        }
    }

    return worstBuilding;
}
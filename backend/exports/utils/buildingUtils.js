import { BUILDINGS, EMPTY_CELL_INDICATOR, MAX_FIELD_SIZE } from "../gameStorage.js";
import Building from "../classes/Building.js";
import { removeMaterials, removeMoney, returnMaterials, returnMoney } from "./inventoryUtils.js";
import { sendFieldUpdate, sendHappinessUpdate, sendMaterialsUpdate, sendCapacityUpdate, sendMoneyDecrease, sendMoneyIncrease, sendMoneyUpdate, sendPopulationUpdate } from "../clientUpdates.js"
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
    const buildingObject = new Building(id, building, { y: rowStart, x: columnStart }, isVertical);
    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            field[y][x] = buildingObject;
        }
    }
    player.buildingCount++;
    player.happiness += building.HAPPINESS;
    player.jobSpaces += building.JOBS;
    player.apartmentSpaces += building.APARTMENTS;

    removeMaterials(player, building.MATERIAL_COST);
    removeMoney(player, building.MONEY_COST);

    sendFieldUpdate(player);
    sendHappinessUpdate(player);
    sendMaterialsUpdate(player);
    sendMoneyDecrease(player, building.MONEY_COST);
    sendMoneyUpdate(player);
    sendCapacityUpdate(player);
}

export function isTownHall(buildingName) {
    return buildingName === BUILDINGS.TOWN_HALL.NAME;
}

export function getBuildingBounds(buildingObject) {
    const {building, startLocation, isVertical} = buildingObject;
    const height = isVertical ? building.WIDTH : building.HEIGHT;
    const width = isVertical ? building.HEIGHT : building.WIDTH;

    const rowStart = startLocation.y;
    const columnStart = startLocation.x;

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
    
    const building = buildingObject.building;

    player.buildingCount--;
    player.happiness -= building.HAPPINESS;
    player.jobSpaces -= building.JOBS;
    player.apartmentSpaces -= building.APARTMENTS;

    for (const person of buildingObject.workers) {
        person.relocateJob(game, player);
    }
    for (const person of buildingObject.residents) {
        person.relocateApartment(game, player);
    }

    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            field[y][x] = EMPTY_CELL_INDICATOR;
        }
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

export function getEmptyJobs(buildingObject) {
    return buildingObject.building.JOBS - buildingObject.workersCount;
}

export function getEmptyApartments(buildingObject) {
    return buildingObject.building.APARTMENTS - buildingObject.residentsCount;
}

export function getNextRandomAvailableJobBuilding(player, ignoredIDs) {
    const availableBuildings = [];
    let totalWeight = 0;

    const field = player.field;
    for (let y = 0; y < MAX_FIELD_SIZE; y++) {
        for (let x = 0; x < MAX_FIELD_SIZE; x++) {
            const cell = field[y][x];
            if (!(cell instanceof Building) || ignoredIDs.has(cell.id)) continue;

            const weight = getEmptyJobs(cell);
            totalWeight += weight;
            availableBuildings.push({ cell, weight });
        }
    }

    let random = Math.random() * totalWeight;
    let chosenBuilding = null;

    for (const building of availableBuildings) {
        random -= building.weight;
        if (random <= 0) {
            chosenBuilding = building.cell;
            break;
        }
    }

    ignoredIDs.add(chosenBuilding.id);
    return chosenBuilding;
}

export function getNextRandomAvailableApartmentBuilding(player, ignoredIDs) {
    const availableBuildings = [];
    let totalWeight = 0;

    const field = player.field;
    for (let y = 0; y < MAX_FIELD_SIZE; y++) {
        for (let x = 0; x < MAX_FIELD_SIZE; x++) {
            const cell = field[y][x];
            if (!(cell instanceof Building) || ignoredIDs.has(cell.id)) continue;

            const weight = getEmptyApartments(cell);
            totalWeight += weight;
            availableBuildings.push({ cell, weight });
        }
    }

    let random = Math.random() * totalWeight;
    let chosenBuilding = null;

    for (const building of availableBuildings) {
        random -= building.weight;
        if (random <= 0) {
            chosenBuilding = building.cell;
            break;
        }
    }

    ignoredIDs.add(chosenBuilding.id);
    return chosenBuilding;
}

export function getBuildingFullnessFactor(buildingObject) {
    return buildingObject.workersCount / buildingObject.building.JOBS;
}

export function getBuildingIncome(buildingObject) {
    return buildingObject.building.MONEY_PER_JOB * buildingObject.workersCount;
}

export function getAverageIncome(player) {
    return player.totalIncome / player.buildingCount;
}

export function getNextRandomOccupiedJobBuilding(player, ignoredIDs) {
    const occupiedBuildings = [];
    let totalWeight = 0;

    for (let y = 0; y < MAX_FIELD_SIZE; y++) {
        for (let x = 0; x < MAX_FIELD_SIZE; x++) {
            const cell = player.field[y][x];
            if (!(cell instanceof Building) || ignoredIDs.has(cell.id)) continue;

            const fullnessFactor = getBuildingFullness(cell);
            const incomeFactor = getBuildingIncome(cell) / getAverageIncome(player);
            const weight = (0.4 * fullnessFactor) + (0.6 * incomeFactor);
            
            occupiedBuildings.push({ cell, weight });
            totalWeight += weight;
        }
    }

    let random = Math.random() * totalWeight;
    let chosenBuilding = null;

    for (const building of occupiedBuildings) {
        random -= building.weight;
        if (random <= 0) {
            chosenBuilding = building.cell;
            break;
        }
    }

    ignoredIDs.add(chosenBuilding.id);
    return chosenBuilding;
}
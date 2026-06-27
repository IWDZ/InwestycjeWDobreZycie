import Building from "../classes/Building.js";
import { removeMaterials, removeMoney, returnMaterials, returnMoney } from "./inventoryUtils.js";
import { sendFieldUpdate, sendHappinessUpdate, sendMaterialsUpdate, sendCapacityUpdate, sendMoneyDecrease, sendMoneyIncrease, sendMoneyUpdate, sendPopulationUpdate } from "../updates/clientUpdates.js"
import { GameMatch } from "../config/games.js";
import { BuildingBounds, BuildingName, BuildingObject, BUILDINGS } from "../config/buildings.js";
import { Field, MAX_FIELD_SIZE } from "../config/fields.js";
import { Player } from "../config/players.js";
import { FieldLocation } from "../../../shared/types/types.js";

export function getCurrentBuildingId(game: GameMatch) {
    return game.nextBuildingId++;
}

export function getBuildingByName(buildingName: BuildingName): BuildingObject {
    return Object.values(BUILDINGS).find(b => b.NAME === buildingName);
}

export function hasRequiredBuilding(building: BuildingObject, field: Field) {
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

export function placeBuilding(game: GameMatch, player: Player, field: Field, buildingBounds: BuildingBounds, building: BuildingObject, isVertical: boolean) {
    const { rowStart, columnStart, rowEnd, columnEnd } = buildingBounds;
    const id = getCurrentBuildingId(game);
    const buildingObject = new Building(id, building, { y: rowStart, x: columnStart }, isVertical);
    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            field[y][x].building = buildingObject;
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

export function isTownHall(buildingName: BuildingName) {
    return buildingName === BUILDINGS.TOWN_HALL.NAME;
}

export function getBuildingBounds(buildingObject: Building | {
        width: number;
        height: number;
        startLocation: FieldLocation;
        isVertical: boolean;
    }): BuildingBounds {
    const {width, height, startLocation, isVertical} = buildingObject;
    const placementHeight = isVertical ? width : height;
    const placementWidth = isVertical ? height : width;

    const rowStart = startLocation.y;
    const columnStart = startLocation.x;

    return {
        rowStart,
        columnStart,
        rowEnd: rowStart + placementHeight - 1,
        columnEnd: columnStart + placementWidth - 1
    };
}

export function canDeleteBuilding(field: Field, buildingId: number, buildingBounds: BuildingBounds) {
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

export function deleteBuilding(game: GameMatch, player: Player, field: Field, buildingBounds: BuildingBounds) {
    const { rowStart, columnStart, rowEnd, columnEnd } = buildingBounds;
    const buildingObject = field[rowStart][columnStart].building;

    player.buildingCount--;
    player.happiness -= buildingObject.happiness;
    player.jobSpaces -= buildingObject.jobs;
    player.apartmentSpaces -= buildingObject.apartments;

    for (const person of buildingObject.workers) {
        person.relocateJob(game, player);
    }
    for (const person of buildingObject.residents) {
        person.relocateApartment(game, player);
    }

    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            field[y][x].isOwned = false;
        }
    }

    returnMaterials(player, buildingObject.materialCost);
    const returningMoney = returnMoney(player, buildingObject.moneyCost);

    sendMoneyIncrease(player, returningMoney);
    sendFieldUpdate(player);
    sendHappinessUpdate(player);
    sendMaterialsUpdate(player);
    sendMoneyUpdate(player);
    sendPopulationUpdate(game);
}

export function getEmptyJobs(buildingObject: Building) {
    return buildingObject.jobs - buildingObject.workersCount;
}

export function getEmptyApartments(buildingObject: Building) {
    return buildingObject.apartments - buildingObject.residentsCount;
}

export function getNextRandomAvailableJobBuilding(player: Player, ignoredIDs: Set<number>) {
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

export function getNextRandomAvailableApartmentBuilding(player: Player, ignoredIDs: Set<number>) {
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

export function getBuildingFullnessFactor(buildingObject: Building) {
    return buildingObject.workersCount / buildingObject.jobs;
}

export function getBuildingIncome(buildingObject: Building) {
    return buildingObject.moneyPerJob * buildingObject.workersCount;
}

export function getAverageIncome(player: Player) {
    return player.totalIncome / player.buildingCount;
}

export function getNextRandomOccupiedJobBuilding(player: Player, ignoredIDs: Set<number>) {
    const occupiedBuildings = [];
    let totalWeight = 0;

    for (let y = 0; y < MAX_FIELD_SIZE; y++) {
        for (let x = 0; x < MAX_FIELD_SIZE; x++) {
            const cell = player.field[y][x];
            if (!(cell instanceof Building) || ignoredIDs.has(cell.id)) continue;

            const fullnessFactor = getBuildingFullnessFactor(cell);
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
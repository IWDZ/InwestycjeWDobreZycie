import { BUILDINGS, GAME_CODE_CHARACTERS, GAME_CODE_LENGTH, GAMES, HAPPINESS_MULTIPLIER, MATERIAL_PRICES, MAX_FIELD_SIZE, POPULATION, START_HAPPINESS, START_MATERIALS, WORK_MULTIPLIER, WORTH_PER_PERSON } from "../gameStorage.js";
import Building from "./Building.js";

export function getCurrentBuildingId(game) {
    return game.settings.NEXT_BUILDING_ID++;
}

export function getGame(gameCode) {
    return GAMES.get(gameCode);
}

export function isValidData(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
}

export function getDefaultSettings(populationPool, marketVolatility) {
    return {
        POPULATION: ((populationPool / 100) * POPULATION),
        MARKET_VOLATILITY: marketVolatility,
        NEXT_BUILDING_ID: 1
    };
}

export function getDefaultClientGameDataObject(game, player) {
    return {
        population: game.settings.POPULATION,
        money: player.money,
        happiness: player.happiness,
        field: player.field,
        buildings: BUILDINGS
    };
}

export function isHost(game, socketId) {
    return game.host.socketId === socketId;
}

export function getFieldMiddle() {
    return Math.floor(MAX_FIELD_SIZE / 2);
}

export function createField(middle) {
    const field = Array.from({ length: MAX_FIELD_SIZE }, () => Array.from({ length: MAX_FIELD_SIZE }, () => undefined));
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            field[middle+i][middle+j] = null;
        }
    }
    return field;
}

export function setUpPlayer(game, player, middle) {
    player.field = createField(middle);
    player.field[middle][middle] = new Building(BUILDINGS.TOWN_HALL, getCurrentBuildingId(game), [middle, middle], false);
    player.happiness = START_HAPPINESS;
    player.materials = { ...START_MATERIALS };
    player.money = START_MONEY;
    player.population = {
        livingPopulation: 3,
        workingPopulation: 3,
        maxLivingPopulation: 5,
        maxWorkingPopulation: 5
    }
}

export function getBuildingByName(buildingName) {
    return Object.values(BUILDINGS).find(b => b.name === buildingName);
}

export function getPlayer(game, socketId) {
    return game.players.find(p => p.socketId === socketId);
}

export function hasRequiredBuilding(building, field) {
    if (!building.REQUIRED_BUILDING) return true;
    for (let y = 0; y < MAX_FIELD_SIZE; y++) {
        for (let x = 0; x < MAX_FIELD_SIZE; x++) {
            const cell = field[y][x];
            if (cell?.building?.NAME === building.REQUIRED_BUILDING) {
                return true;
            }
        }
    }
    return false;
}

export function hasRequiredMaterials(materialCost, materials) {
    return Object.entries(materialCost).every(([material, requiredAmount]) => materials[material] >= requiredAmount);
}

export function hasRequiredMoney(moneyCost, money) {
    return money >= moneyCost;
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

export function isPlacementInBounds(rowEnd, columnEnd) {
    return rowEnd <= (MAX_FIELD_SIZE - 1) && columnEnd <= (MAX_FIELD_SIZE - 1)
}

export function hasPlacementError(buildingName, field, rowStart, columnStart, rowEnd, columnEnd) {
    if (buildingName === BUILDINGS.PORT.NAME && columnStart !== 0) {
        return "A port can only be placed on the far-left cell";
    }
    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            if (field[y][x] === undefined) {
                return "Out Of Available Space";
            }
            if (field[y][x] !== null) {
                return "Space Occupied";
            }
        }
    }
    return false;
}

export function buyMaterial(game, player, material, amount) {
    const cost = game.materialPrices[material] * amount;
    if (!hasRequiredMoney(cost, player.money)) {
        return false;
    }

    removeMoney(player, cost);
    player.materials[material] += amount;

    return true;
}

export function sellMaterial(game, player, material, amount) {
    const materialCostObject = {[material]: amount};
    if (!hasRequiredMaterials(materialCostObject, player.materials)) {
        return false;
    }

    removeMaterials(player, materialCostObject);
    
    const cost = game.materialPrices[material] * amount;
    player.money += cost;

    return true;
}

export function returnMaterials(player, materialsToReturn) {
    Object.entries(materialsToReturn).every(([material, amount]) => player.materials[material] += Math.floor(amount / 2));
}

export function removeMaterials(player, materialsToRemove) {
    Object.entries(materialsToRemove).forEach(([material, requiredAmount]) => player.materials[material] -= requiredAmount);
}

export function returnMoney(player, moneyToReturn) {
    player.money += Math.floor(moneyToReturn / 2);
}

export function removeMoney(player, moneyToRemove) {
    player.money -= moneyToRemove;
}

export function placeBuilding(player, field, rowStart, columnStart, rowEnd, columnEnd, buildingId, building, isVertical) {
    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            field[y][x] = new Building(buildingId, building, [rowStart, columnStart], isVertical);
        }
    }
    player.population.maxLivingPopulation += building.APARTMENTS;
    player.population.maxWorkingPopulation += building.JOBS;
}

export function isTownHall(buildingName) {
    return buildingName === BUILDINGS.TOWN_HALL.NAME;
}

export function couldDeleteBuilding(game, player, buildingObject, field) {
    const { rowStart, columnStart, rowEnd, columnEnd } = getBuildingBounds(buildingObject);
    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            if (field[y][x] !== buildingObject) {
                return false;
            }
            field[y][x] = null;
        }
    }
    const building = buildingObject.building;
    const population = player.population;
    
    population.workingPopulation -= buildingObject.workers;
    population.livingPopulation -= buildingObject.residents;
    population.maxLivingPopulation -= building.APARTMENTS;
    population.maxWorkingPopulation -= building.JOBS;

    if (population.livingPopulation > population.maxLivingPopulation || population.workingPopulation > population.maxWorkingPopulation) {
        const livingPopulationDifference = population.livingPopulation - population.maxLivingPopulation;
        const workingPopulationDifference = population.workingPopulation - population.maxWorkingPopulation;
        const populationToDecrease = livingPopulationDifference > workingPopulationDifference ? livingPopulationDifference : workingPopulationDifference;
        decreasePopulation(player, populationToDecrease);
    }
    return true;
}

export function increasePopulation(player, workersToIncrease, residentsToIncrease = workersToIncrease, ignoredIDs = []) {
    if (workersToIncrease <= 0 && residentsToIncrease <= 0) return true;
    const population = player.population;
    if (population.workingPopulation + workersToIncrease > population.maxWorkingPopulation ||
        population.livingPopulation + residentsToIncrease > population.maxLivingPopulation) return false;
    
    const worstBuilding = getWorstBuilding(player, ignoredIDs);

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

    ignoredIDs.push(worstBuilding.id);
    return increasePopulation(player, workersToIncrease, residentsToIncrease, ignoredIDs);
}

export function decreasePopulation(player, workersToDecrease, residentsToDecrease = workersToDecrease, ignoredIDs = []) {
    if (workersToDecrease <= 0 && residentsToDecrease <= 0) return true;
    const population = player.population;
    if (population.workingPopulation - workersToDecrease < 2) return false;

    const worstBuilding = getWorstBuilding(player, ignoredIDs);

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

    ignoredIDs.push(worstBuilding.id);
    return decreasePopulation(player, workersToDecrease, residentsToDecrease, ignoredIDs);
}

export function getWorstBuilding(player, blockedIDs) {
    let worstY = 0;
    let worstX = 0;
    let minSalary = Infinity;
    for (let y = 0; y < MAX_FIELD_SIZE; y++) {
        for (let x = 0; x < MAX_FIELD_SIZE; x++) {
            if (player.field[y][x] instanceof Building && player.field[y][x].building.MONEY_PER_JOB < minSalary && (player.field[y][x].workers > 0 || player.field[y][x].residents > 0) && !blockedIDs.includes(player.field[y][x].id)) {
                minSalary = player.field[y][x].building.MONEY_PER_JOB;
                worstY = y;
                worstX = x;
            }
        }
    }

    return player.filter[y][x];
}

export function generateGameCode() {
    let gameCode;
    do {
        gameCode = "";
        for (let i = 0; i < GAME_CODE_LENGTH; i++) {
            gameCode += GAME_CODE_CHARACTERS[Math.floor(Math.random() * GAME_CODE_CHARACTERS.length)];
        }
    } while (GAMES.has(gameCode));
    return gameCode;
}

export function getDefaultGameObject(gameCode, username, socketId, playersAmount) {
    return {
        host: {
            username: username,
            socketId: socketId
        },
        players: [
            {
                username: username,
                socketId: socketId
            }
        ],
        maxPlayers: playersAmount,
        started: false,
        gameCode: gameCode
    };
}

export function isPlayerInGame(socketId) {
    for (const game of GAMES.values()) {
        if (game.players.some(player => player.socketId === socketId)) return true;
    }
    return false;
}

export function isGameFull(game) {
    return game.players.length >= game.maxPlayers;
}

export function hasGameStarted(game) {
    return game.started;
}

export function hasPlayerWithUsername(game, username) {
    return game.players.some(player => player.username.toLowerCase() === username.toLowerCase())
}

export function hasPlayer(game, socketId) {
    return game.players.some(player => player.socketId === socketId);
}

export function removePlayer(game, socketId) {
    game.players = game.players.filter(player => player.socketId !== socketId);
}

export function isMaterialPriceAboveMultiplier(game, material, multiplier) {
    return game.materialPrices[material] > MATERIAL_PRICES[material] * multiplier;
}

export function updateMarket(game, currentTick) {
    for (const material in MATERIALS) {
        const net = currentTick.purchases[material] - currentTick.sales[material];
        let newPrice = game.materialPrices[material];
        if (net === 0) {
            const changeNumber = Math.floor(Math.random() * 3);
            if (changeNumber === 1) {
                if (isMaterialPriceAboveMultiplier(game, material, 1/3))
                    newPrice *= Math.random() * 0.2 + 0.8;
            }else if (changeNumber === 2) {
                if (!isMaterialPriceAboveMultiplier(game, material, 2.5))
                    newPrice *= Math.random() * 0.2 + 1;
            }
        }else if (net > 0) {
            while (net > 0 && !isMaterialPriceAboveMultiplier(game, material, 2.5)) {
                if (isMaterialPriceAboveMultiplier(game, material, 1.5)) {
                    newPrice *= 1.005;
                }else{
                    newPrice *= 1.01;
                }
                net--;
            }
        }else{
            while (net > 0 && !isMaterialPriceAboveMultiplier(game, material, 1/3)) {
                if (isMaterialPriceAboveMultiplier(game, material, 1.5)) {
                    newPrice *= 0.99;
                }else if (isMaterialPriceAboveMultiplier(game, material, 0.5)) {
                    newPrice *= 0.998;
                }else{
                    newPrice *= 0.995;
                }
                net--;
            }
        }
        game.materialPrices[material] *= newPrice * game.settings.MARKET_VOLATILITY;
    }
}

export function updatePopulation(game) {
    for (const player of game.players) {
        const happinessFactor = (player.happiness - START_HAPPINESS) * HAPPINESS_MULTIPLIER;
        const workFactor = (player.population.maxWorkingPopulation - player.population.workingPopulation) * WORK_MULTIPLIER;
        const rawChange = (happinessFactor + workFactor) * (Math.random() * 0.6 + 0.7);
        const populationChange = rawChange >= 0 ? Math.ceil(rawChange) : Math.floor(rawChange);
        if (populationChange < 0) {
            if(decreasePopulation(player, Math.abs(populationChange))) game.settings.POPULATION += populationChange;
        }else{
            if(increasePopulation(player, populationChange)) game.settings.POPULATION -= populationChange;
        }
    }
}

export function sumUpPlayers(game) {
    for (const player of game.players) {
        const moneyWorth = player.money;
        let materialWorth = {};
        for (const [material, amount] of Object.entries(player.materials)){
            const moneyBeforeSelling = player.money;
            sellMaterial(game, player, material, amount);
            materialWorth = {...materialWorth, [material]: player.money - moneyBeforeSelling};
        }
        const field = player.field;
        const ignoredIDs = [];
        let buildingsWorth = 0;
        for (let y = 0; y < MAX_FIELD_SIZE; y++) {
            for (let x = 0; x < MAX_FIELD_SIZE; x++) {
                const cell = field[y][x];
                if (!(cell instanceof Building) || ignoredIDs.includes(cell.id)) continue;
                const worth = cell.building.MONEY_COST;
                buildingsWorth += worth;
                player.money += worth;
                ignoredIDs.push(cell.id);
            }
        }
        const populationWorth = player.population.livingPopulation * WORTH_PER_PERSON;
        player.money += populationWorth;
        player.worth = {
            moneyWorth: moneyWorth,
            materialWorth: materialWorth,
            buildingsWorth: buildingsWorth,
            populationWorth: populationWorth,
            totalWorth: player.money
        }
    }

    const leaderboard = [...game.players].sort((a, b) => b.worth.totalWorth - a.worth.totalWorth).map(player => (
        {
            username: player.username,
            worth: player.worth.totalWorth
        }
    ));
    return leaderboard;
}

export function endGame(game) {
    clearInterval(game.gameTickInterval);
    GAMES.delete(game.gameCode);
}
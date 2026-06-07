import { BUILDINGS, CELL_PRICE_INCREASE, DEFAULT_CELL_PRICE, EMPTY_CELL_INDICATOR, ERRORS, GAME_CODE_CHARACTERS, GAME_CODE_LENGTH, GAME_DURATION_TICKS, GAME_TICK_SECONDS, GAMES, HAPPINESS_MULTIPLIER, MARKET_UPDATE_TICK_INTERVAL, MATERIAL_PRICES, MATERIALS, MAX_FIELD_SIZE, PLAYERS, POPULATION, SECONDS_BEFORE_GAME_START, START_HAPPINESS, START_MATERIALS, START_MONEY, WORK_MULTIPLIER, WORTH_PER_PERSON } from "../gameStorage.js";
import { io } from "../server.js";
import Building from "./Building.js";

export function setPlayerGame(socketId, gameCode) {
    PLAYERS.set(socketId, gameCode);
}

export function throwError(socketId, errorMessage) {
    io.to(socketId).emit("error", errorMessage);
}

export function getCurrentBuildingId(game) {
    return game.settings.NEXT_BUILDING_ID++;
}

export function createGame(gameCode, username, socketId, playersAmount) {
    GAMES.set(gameCode, createDefaultGameObject(gameCode, username, socketId, playersAmount));
}

export function getGame(socketId) {
    return GAMES.get(PLAYERS.get(socketId));
}

export function hasEnoughPlayers(game) {
    return game.players.length >= MIN_PLAYERS;
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
        buildings: BUILDINGS,
        materials: MATERIALS,
        materialPrices: game.materialPrices,
        playerMaterials: player.materials
    };
}

export function startGame(game, populationPool, marketVolatility) {
    game.started = true;
    game.settings = getDefaultSettings(populationPool, marketVolatility);
    game.currentTick = {
        tickNumber: 1,
        sales: Object.fromEntries(Object.values(MATERIALS).map(material => [material, 0])),
        purchases: Object.fromEntries(Object.values(MATERIALS).map(material => [material, 0]))
    };
    game.materialPrices = { ...MATERIAL_PRICES};
    setTimeout(() => game.gameTickInterval = setInterval(() => doGameTick(game), GAME_TICK_SECONDS * 1000), SECONDS_BEFORE_GAME_START * 1000);
}

export function isHost(game, socketId) {
    return game.host.socketId === socketId;
}

export function getFieldMiddle() {
    return Math.floor(MAX_FIELD_SIZE / 2);
}

export function createField(middle) {
    const field = Array.from({ length: MAX_FIELD_SIZE }, () => Array.from({ length: MAX_FIELD_SIZE }, () => null));
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            field[middle+i][middle+j] = EMPTY_CELL_INDICATOR;
        }
    }
    return field;
}

export function setUpPlayer(game, player) {
    const middle = getFieldMiddle();
    player.field = createField(middle);
    player.field[middle][middle] = new Building(getCurrentBuildingId(game), BUILDINGS.TOWN_HALL, [middle, middle], false);
    player.nextCellPrice = DEFAULT_CELL_PRICE;
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
    return Object.values(BUILDINGS).find(b => b.NAME === buildingName);
}

export function getPlayer(game, socketId) {
    return game.players.find(p => p.socketId === socketId);
}

export function generateIncome(player) {
    const field = player.field;
    const ignoredIDs = [];
    let income = 0;
    for (let y = 0; y < MAX_FIELD_SIZE; y++) {
        for (let x = 0; x < MAX_FIELD_SIZE; x++) {
            const cell = field[y][x];
            if (!(cell instanceof Building) || ignoredIDs.includes(cell.id)) continue;
            income += cell.building.MONEY_PER_JOB * cell.workers;
            ignoredIDs.push(cell.id);
        }
    }
    addMoney(player, income);
    return income;
}

export function isCellBought(cell) {
    return cell instanceof Building || cell === EMPTY_CELL_INDICATOR;
}

export function hasAdjacentCell(field, location) {
    const y = location[0];
    const x = location[1];

    return (
        isCellBought(field[y-1]?.[x]) ||
        isCellBought(field[y+1]?.[x]) ||
        isCellBought(field[y]?.[x-1]) ||
        isCellBought(field[y]?.[x+1])
    );
}

export function buyCell(player, location) {
    if (!hasRequiredMoney(player.nextCellPrice, player.money)) return false;

    removeMoney(player, player.nextCellPrice);
    const y = location[0];
    const x = location[1];
    player.field[y][x] = EMPTY_CELL_INDICATOR;
    player.nextCellPrice += CELL_PRICE_INCREASE;

    sendMoneyDecrease(player, player.nextCellPrice - CELL_PRICE_INCREASE);
    sendFieldUpdate(player);
    sendMoneyUpdate(player);
    sendCellPriceUpdate(player);

    return true;
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

export function buyMaterial(game, player, material, amount) {
    const cost = game.materialPrices[material] * amount;
    if (!hasRequiredMoney(cost, player.money)) {
        return false;
    }

    removeMoney(player, cost);
    addMaterials(player, {[material]: amount});
    
    game.currentTick.purchases += amount;

    sendMoneyDecrease(player, cost);
    sendMoneyUpdate(player);
    sendMaterialsUpdate(player);

    return true;
}

export function sellMaterial(game, player, material, amount) {
    const materialCostObject = {[material]: amount};
    if (!hasRequiredMaterials(materialCostObject, player.materials)) {
        return false;
    }

    removeMaterials(player, materialCostObject);
    const cost = game.materialPrices[material] * amount;
    addMoney(cost);

    game.currentTick.sales += amount;

    sendMoneyIncrease(player, cost);
    sendMoneyUpdate(player);
    sendMaterialsUpdate(player);

    return true;
}

export function returnMaterials(player, materialsToReturn) {
    Object.entries(materialsToReturn).every(([material, amount]) => player.materials[material] += Math.floor(amount / 2));
}

export function addMaterials(player, materialsToAdd) {
    Object.entries(materialsToAdd).forEach(([material, amount]) => player.materials[material] += amount);
}

export function removeMaterials(player, materialsToRemove) {
    Object.entries(materialsToRemove).forEach(([material, requiredAmount]) => player.materials[material] -= requiredAmount);
}

export function returnMoney(player, amount) {
    const moneyToReturn = Math.floor(amount / 2)
    addMoney(player, moneyToReturn);
    return moneyToReturn;
}

export function addMoney(player, amount) {
    player.money += amount;
}

export function removeMoney(player, amount) {
    player.money -= amount;
}

export function placeBuilding(game, player, field, buildingBounds, building, isVertical) {
    const { rowStart, columnStart, rowEnd, columnEnd } = buildingBounds;
    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            field[y][x] = new Building(getCurrentBuildingId(game), building, [rowStart, columnStart], isVertical);
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

export function isPlacementInBounds(buildingBounds) {
    const { rowEnd, columnEnd } = buildingBounds;
    return rowEnd <= (MAX_FIELD_SIZE - 1) && columnEnd <= (MAX_FIELD_SIZE - 1)
}

export function hasPlacementError(buildingName, field, buildingBounds) {
    const { rowStart, columnStart, rowEnd, columnEnd } = buildingBounds;
    if (buildingName === BUILDINGS.PORT.NAME && columnStart !== 0) {
        return ERRORS.PORT_ERROR;
    }
    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            if (field[y][x] === null) {
                return ERRORS.CELL_NOT_OWNED;
            }
            if (field[y][x] instanceof Building) {
                return ERRORS.CELL_OCCUPIED;
            }
        }
    }
    return false;
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
            const cell = player.field[y][x];
            if (cell instanceof Building && cell.building.MONEY_PER_JOB < minSalary && (cell.building.JOBS - cell.workers > 0 || cell.building.APARTMENTS - cell.residents > 0) && !blockedIDs.includes(cell.id)) {
                minSalary = cell.building.MONEY_PER_JOB;
                worstY = y;
                worstX = x;
            }
        }
    }

    return player.field[worstY][worstX];
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

export function createDefaultGameObject(gameCode, username, socketId, playersAmount) {
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
    return PLAYERS.get(socketId);
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

export function addPlayer(game, username, socketId) {
    game.players.push({
        username: username,
        socketId: socketId
    });
    setPlayerGame(socketId, game.gameCode);
}

export function removePlayer(game, socketId) {
    game.players = game.players.filter(player => player.socketId !== socketId);
    setPlayerGame(socketId, null);
}

export function isMaterialPriceAboveMultiplier(newPrice, material, multiplier) {
    return newPrice > MATERIAL_PRICES[material] * multiplier;
}

function scaleChange(base, volatility) {
    return 1 + (base - 1) * volatility;
}

export function updateMarket(game, currentTick) {
    const marketVolatility = game.settings.MARKET_VOLATILITY;
    for (const material of Object.values(MATERIALS)) {
        let net = currentTick.purchases[material] - currentTick.sales[material];
        let newPrice = game.materialPrices[material];
        if (net === 0) {
            const changeNumber = Math.floor(Math.random() * 3);
            if (changeNumber === 1) {
                if (isMaterialPriceAboveMultiplier(newPrice, material, 1/3))
                    newPrice *= scaleChange(Math.random() * 0.2 + 0.8, marketVolatility);
            }else if (changeNumber === 2) {
                if (!isMaterialPriceAboveMultiplier(newPrice, material, 2.5))
                    newPrice *= scaleChange(Math.random() * 0.2 + 1, marketVolatility);
            }
        }else if (net > 0) {
            while (net > 0 && !isMaterialPriceAboveMultiplier(newPrice, material, 2.5)) {
                if (isMaterialPriceAboveMultiplier(newPrice, material, 1.5)) {
                    newPrice *= scaleChange(1.005, marketVolatility);
                }else{
                    newPrice *= scaleChange(1.01, marketVolatility);
                }
                net--;
            }
        }else{
            while (net < 0 && !isMaterialPriceAboveMultiplier(newPrice, material, 1/3)) {
                if (isMaterialPriceAboveMultiplier(newPrice, material, 1.5)) {
                    newPrice *= scaleChange(0.99, marketVolatility);
                }else if (isMaterialPriceAboveMultiplier(newPrice, material, 0.5)) {
                    newPrice *= scaleChange(0.998, marketVolatility);
                }else{
                    newPrice *= scaleChange(0.995, marketVolatility);
                }
                net++;
            }
        }

        if (isMaterialPriceAboveMultiplier(newPrice, material, 2.5)) newPrice = MATERIAL_PRICES[material] * 2.5;
        if (!isMaterialPriceAboveMultiplier(newPrice, material, 1/3)) newPrice = MATERIAL_PRICES[material] * (1/3)
        game.materialPrices[material] = Math.round(newPrice);
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

export function closeGame(game) {
    clearInterval(game.gameTickInterval);
    GAMES.delete(game.gameCode);
}

export function endGame(game) {
    const leaderboard = sumUpPlayers(game);
    for (const player of game.players) {
        const socketId = player.socketId;
        io.to(socketId).emit("game_end", {
            worth: player.worth,
            leaderboard: leaderboard
        });
        removePlayer(game, socketId);
    }
    closeGame(game);
}

export function doGameTick(game) {
    const currentTick = game.currentTick;

    for (const player of game.players) {
        sendMoneyIncrease(player, generateIncome(player));
        sendMoneyUpdate(player);
    }

    if (currentTick.tickNumber >= GAME_DURATION_TICKS) {
        return endGame(game);
    }

    if (currentTick.tickNumber % MARKET_UPDATE_TICK_INTERVAL === 0) {
        updateMarket(game, currentTick);
        sendMaterialPricesUpdate(game);
        currentTick.sales = currentTick.purchases = 0;
    }

    updatePopulation(game);
    sendPopulationUpdate(game);
    for (const player of game.players) {
        sendFieldUpdate(player);
        sendTickNumberUpdate(player, currentTick.tickNumber);
    }

    currentTick.tickNumber++;
}
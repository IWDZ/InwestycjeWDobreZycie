import Building from "../exports/Building.js";
import { sendCellPriceUpdate, sendFieldUpdate, sendHappinessUpdate, sendMaterialPricesUpdate, sendMaterialsUpdate, sendMaxPopulationUpdate, sendMoneyDecrease, sendMoneyIncrease, sendMoneyUpdate, sendPopulationUpdate } from "../exports/clientUpdates.js";
import { getDefaultSettings, getGame, isValidData, isHost, getCurrentBuildingId, setUpPlayer, getFieldMiddle, createField, getDefaultClientGameDataObject, getBuildingByName, getPlayer, hasRequiredBuilding, hasRequiredMaterials, hasRequiredMoney, getBuildingBounds, isPlacementInBounds, hasPlacementError, removeMaterials, removeMoney, placeBuilding, isTownHall, couldDeleteBuilding, returnMaterials, returnMoney, isMaterialPriceAboveMultiplier, updateMarket, buyMaterial, closeGame, sumUpPlayers, decreasePopulation, increasePopulation, updatePopulation, hasAdjacentCell, buyCell, generateIncome, endGame, hasGameStarted, throwError } from "../exports/utils.js";
import { CELL_PRICE_INCREASE, ERRORS, GAME_DURATION_TICKS, GAME_TICK_SECONDS, GAMES, HAPPINESS_MULTIPLIER, MARKET_UPDATE_TICK_INTERVAL, MATERIAL_PRICES, MATERIALS, MAX_FIELD_SIZE, MIN_PLAYERS, POPULATION, SECONDS_BEFORE_GAME_START, START_HAPPINESS, START_MONEY, WORK_MULTIPLIER } from "../gameStorage.js";
import { io } from "../server.js";

function gameLogic(socket) {
    socket.on("start_game", data => {
        if (!isValidData(data)) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }
        const {gameCode, populationPool, marketVolatility} = data;

        if (typeof gameCode !== "string" || 
            !Number.isInteger(populationPool) || populationPool < 50 || populationPool > 100 ||
            !Number.isInteger(marketVolatility)) {
                return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const game = getGame(gameCode);
        if (!game) {
            return throwError(socket.id, ERRORS.GAME_NOT_FOUND);
        }
        
        if (game.players.length < MIN_PLAYERS) {
            return throwError(socket.id, ERRORS.NOT_ENOUGH_PLAYERS);
        }

        if (hasGameStarted(game)) {
            return throwError(socket.id, ERRORS.GAME_ALREADY_STARTED);
        }

        game.started = true;
        game.settings = getDefaultSettings(populationPool, marketVolatility);
        game.currentTick = {
            tickNumber: 1,
            sales: Object.fromEntries(Object.values(MATERIALS).map(material => [material, 0])),
            purchases: Object.fromEntries(Object.values(MATERIALS).map(material => [material, 0]))
        };
        game.materialPrices = { ...MATERIAL_PRICES};
        setTimeout(() => game.gameTickInterval = setInterval(() => doGameTick(game), GAME_TICK_SECONDS * 1000), SECONDS_BEFORE_GAME_START * 1000);

        if (!isHost(game, socket.id)) {
            return throwError(socket.id, ERRORS.HOST_FEATURE);
        }

        const middle = getFieldMiddle();
        for (const player of game.players) {
            setUpPlayer(game, player, middle);
            io.to(player.socketId).emit("game_start", getDefaultClientGameDataObject(game, player));
        }
    });

    socket.on("buy_cell", data => {
        if (!isValidData(data)) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const { gameCode, location } = data;

        if (typeof gameCode !== "string" || !Array.isArray(location) || 
            !Number.isInteger(location[0]) || location[0] > (MAX_FIELD_SIZE - 1) || location[0] < 0 ||
            !Number.isInteger(location[1]) || location[1] > (MAX_FIELD_SIZE - 1) || location[1] < 0) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const game = getGame(gameCode);
        const player = getPlayer(game, socket.id);
        const field = player.field;

        if (!hasAdjacentCell(field, location)) {
            return throwError(socket.id, ERRORS.NO_ADJACENT_CELLS_OWNED);
        }

        if (!buyCell(player, location)) {
            return throwError(socket.id, ERRORS.NOT_ENOUGH_MONEY);
        }

        sendMoneyDecrease(player, player.nextCellPrice - CELL_PRICE_INCREASE);
        sendFieldUpdate(player);
        sendMoneyUpdate(player);
        sendCellPriceUpdate(player);
    });

    socket.on("buy_material", data => {
        if (!isValidData(data)) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const { gameCode, material, amount } = data;

        if (typeof gameCode !== "string" || !Object.values(MATERIALS).includes(material) || !Number.isInteger(amount)) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const game = getGame(socket, gameCode);
        if (!game) return throwError(socket.id, ERRORS.GAME_NOT_FOUND);

        const player = getPlayer(game, socket.id);

        if (!buyMaterial(game, player, material, amount)) {
            return throwError(socket.id, ERRORS.NOT_ENOUGH_MONEY);
        }

        const cost = game.materialPrices[material] * amount;
        sendMoneyDecrease(player, cost);
        sendMoneyUpdate(player);
        sendMaterialsUpdate(player);
    });

    socket.on("sell_material", data => {
        if (!isValidData(data)) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const { gameCode, material, amount } = data;

        if (typeof gameCode !== "string" || !Object.values(MATERIALS).includes(material) || !Number.isInteger(amount)) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const game = getGame(gameCode);
        if (!game) {
            return throwError(socket.id, ERRORS.GAME_NOT_FOUND);
        }

        const player = getPlayer(game, socket.id);

        if (!sellMaterial(game, player, material, amount)) {
            return throwError(socket.id, ERRORS.NOT_ENOUGH_MATERIALS);
        }

        const cost = game.materialPrices[material] * amount;
        sendMoneyIncrease(player, cost);
        sendMoneyUpdate(player);
        sendMaterialsUpdate(player);
    });

    socket.on("create_building", data => {
        if (!isValidData(data)) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }
        const {gameCode, buildingName, startLocation, isVertical} = data;

        if (typeof gameCode !== "string" || !Array.isArray(startLocation) || 
            !Number.isInteger(startLocation[0]) || startLocation[0] > (MAX_FIELD_SIZE - 1) || startLocation[0] < 0 || 
            !Number.isInteger(startLocation[1]) || startLocation[1] > (MAX_FIELD_SIZE - 1) || startLocation[1] < 0 || typeof isVertical !== "boolean") {
                return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const building = getBuildingByName(buildingName);
        if (!building) {
            return throwError(socket.id, ERRORS.BUILDING_NOT_FOUND);
        }

        const game = getGame(socket, gameCode);
        if (!game) {
            return throwError(socket.id, ERRORS.GAME_NOT_FOUND)
        }

        const player = getPlayer(game, socket.id);
        const field = player.field;

        if (!hasRequiredBuilding(building, field)) {
            return throwError(socket.id, ERRORS.NO_REQUIRED_BUILDING);
        }

        if (!hasRequiredMaterials(building.MATERIAL_COST, player.materials)) {
            return throwError(socket.id, ERRORS.NOT_ENOUGH_MATERIALS);
        }

        if (!hasRequiredMoney(building.MONEY_COST, player.money)) {
            return throwError(socket.id, ERRORS.NOT_ENOUGH_MONEY);
        }

        const { rowStart, columnStart, rowEnd, columnEnd } = getBuildingBounds({building, startLocation, isVertical});

        if (!isPlacementInBounds(rowEnd, columnEnd)) {
            return throwError(socket.id, ERRORS.OUT_OF_BOUNDS);
        }

        const placementErrorMessage = hasPlacementError(buildingName, field, rowStart, columnStart, rowEnd, columnEnd);
        if (placementErrorMessage) {
            return throwError(socket.id, placementErrorMessage);
        }

        const id = getCurrentBuildingId(game);
        removeMaterials(player, building.MATERIAL_COST);
        removeMoney(player, building.MONEY_COST)

        placeBuilding(player, field, rowStart, columnStart, rowEnd, columnEnd, id, building, isVertical);

        sendFieldUpdate(player);
        sendHappinessUpdate(player);
        sendMaterialsUpdate(player);
        sendMoneyDecrease(player, building.MONEY_COST);
        sendMoneyUpdate(player);
        sendMaxPopulationUpdate(player);
    });

    socket.on("delete_building", data => {
        if (!isValidData(data)) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }
        const { gameCode, location } = data;

        if (typeof gameCode !== "string" || !Array.isArray(location) ||
            !Number.isInteger(location[0]) || location[0] > (MAX_FIELD_SIZE - 1) || location[0] < 0 ||
            !Number.isInteger(location[1]) || location[1] > (MAX_FIELD_SIZE - 1) || location[1] < 0) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const y = location[0];
        const x = location[1];

        const game = getGame(socket, gameCode);
        if (!game) {
            return throwError(socket.id, ERRORS.GAME_NOT_FOUND);
        }

        const player = getPlayer(game, socket.id);
        const field = player.field;
        const buildingObject = field[y][x];

        if (!buildingObject) {
            return throwError(socket.id, ERRORS.CELL_NOT_A_BUILDING);
        }

        if (isTownHall(buildingObject.buildingName)) {
            return throwError(socket.id, ERRORS.CANNOT_DELETE_TOWN_HALL);
        }

        if (!couldDeleteBuilding(game, player, buildingObject)) {
            return throwError(socket.id, ERRORS.UNEXPECTED_BUILDING_BOUNDS);
        }

        returnMaterials(player, building.MATERIAL_COST);
        sendMoneyIncrease(player, returnMoney(player, building.MONEY_COST));

        sendFieldUpdate(player);
        sendHappinessUpdate(player);
        sendMaterialsUpdate(player);
        sendMoneyUpdate(player);
        sendPopulationUpdate(game);
    });
}

function doGameTick(game) {
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
    }

    updatePopulation(game);
    sendPopulationUpdate(game);
    for (const player of game.players) {
        sendFieldUpdate(player);
    }

    currentTick.tickNumber++;
}

export default gameLogic;
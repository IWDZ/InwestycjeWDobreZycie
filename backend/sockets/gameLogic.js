import Building from "../exports/Building.js";
import { sendCellPriceUpdate, sendFieldUpdate, sendHappinessUpdate, sendMaterialPricesUpdate, sendMaterialsUpdate, sendMaxPopulationUpdate, sendMoneyDecrease, sendMoneyIncrease, sendMoneyUpdate, sendPopulationUpdate, sendTickNumberUpdate } from "../exports/clientUpdates.js";
import { getDefaultSettings, getGame, isValidData, isHost, getCurrentBuildingId, setUpPlayer, getFieldMiddle, createField, getDefaultClientGameDataObject, getBuildingByName, getPlayer, hasRequiredBuilding, hasRequiredMaterials, hasRequiredMoney, getBuildingBounds, isPlacementInBounds, hasPlacementError, removeMaterials, removeMoney, placeBuilding, isTownHall, returnMaterials, returnMoney, isMaterialPriceAboveMultiplier, updateMarket, buyMaterial, closeGame, sumUpPlayers, decreasePopulation, increasePopulation, updatePopulation, hasAdjacentCell, buyCell, generateIncome, endGame, hasGameStarted, throwError, sellMaterial, hasEnoughPlayers, startGame, deleteBuilding, removePlayer, canDeleteBuilding } from "../exports/utils.js";
import { CELL_PRICE_INCREASE, ERRORS, GAME_DURATION_TICKS, GAME_TICK_SECONDS, GAMES, HAPPINESS_MULTIPLIER, MARKET_UPDATE_TICK_INTERVAL, MATERIAL_PRICES, MATERIALS, MAX_FIELD_SIZE, MIN_PLAYERS, POPULATION, SECONDS_BEFORE_GAME_START, START_HAPPINESS, START_MONEY, WORK_MULTIPLIER } from "../gameStorage.js";
import { io } from "../server.js";

function gameLogic(socket, socketId) {
    socket.on("start_game", settings => {
        if (!isValidData(settings)) {
            return throwError(socketId, ERRORS.INVALID_DATA);
        }
        const {populationPool, marketVolatility} = settings;

        if (!Number.isInteger(populationPool) || populationPool < 50 || populationPool > 100 ||
            typeof marketVolatility !== "number" || marketVolatility < 0.5 || marketVolatility > 5) {
                return throwError(socketId, ERRORS.INVALID_DATA);
        }

        const game = getGame(socketId);
        if (!game) {
            return throwError(socketId, ERRORS.GAME_NOT_FOUND);
        }
        
        if (!hasEnoughPlayers(game)) {
            return throwError(socketId, ERRORS.NOT_ENOUGH_PLAYERS);
        }

        if (hasGameStarted(game)) {
            return throwError(socketId, ERRORS.GAME_ALREADY_STARTED);
        }

        if (!isHost(game, socketId)) {
            return throwError(socketId, ERRORS.HOST_FEATURE);
        }

        startGame(game, populationPool, marketVolatility);

        for (const player of game.players) {
            setUpPlayer(game, player);
            io.to(player.socketId).emit("game_start", getDefaultClientGameDataObject(game, player));
        }
    });

    socket.on("buy_cell", location => {
        if (!Array.isArray(location) || 
            !Number.isInteger(location[0]) || location[0] > (MAX_FIELD_SIZE - 1) || location[0] < 0 ||
            !Number.isInteger(location[1]) || location[1] > (MAX_FIELD_SIZE - 1) || location[1] < 0) {
            return throwError(socketId, ERRORS.INVALID_DATA);
        }

        const game = getGame(socketId);
        if (!game) {
            return throwError(socketId, ERRORS.GAME_NOT_FOUND);
        }

        if (!hasGameStarted(game)) {
            return throwError(socketId, ERRORS.GAME_NOT_STARTED);
        }

        const player = getPlayer(game, socketId);
        if (!player) {
            return throwError(socketId, ERRORS.PLAYER_NOT_FOUND);
            removePlayer(game, socketId);
        }

        const field = player.field;

        if (!hasAdjacentCell(field, location)) {
            return throwError(socketId, ERRORS.NO_ADJACENT_CELLS_OWNED);
        }

        if (!buyCell(player, location)) {
            throwError(socketId, ERRORS.NOT_ENOUGH_MONEY);
        }
    });

    socket.on("buy_material", data => {
        if (!isValidData(data)) {
            return throwError(socketId, ERRORS.INVALID_DATA);
        }

        const { material, amount } = data;

        if (!Object.values(MATERIALS).includes(material) || !Number.isInteger(amount)) {
            return throwError(socketId, ERRORS.INVALID_DATA);
        }

        const game = getGame(socketId);
        if (!game) {
            return throwError(socketId, ERRORS.GAME_NOT_FOUND);
        }

        if (!hasGameStarted(game)) {
            return throwError(socketId, ERRORS.GAME_NOT_STARTED);
        }
        
        const player = getPlayer(game, socketId);
        if (!player) {
            return throwError(socketId, ERRORS.PLAYER_NOT_FOUND);
            removePlayer(game, socketId);
        }

        if (!buyMaterial(game, player, material, amount)) {
            throwError(socketId, ERRORS.NOT_ENOUGH_MONEY);
        }
    });

    socket.on("sell_material", data => {
        if (!isValidData(data)) {
            return throwError(socketId, ERRORS.INVALID_DATA);
        }

        const { material, amount } = data;

        if (!Object.values(MATERIALS).includes(material) || !Number.isInteger(amount)) {
            return throwError(socketId, ERRORS.INVALID_DATA);
        }

        const game = getGame(socketId);
        if (!game) {
            return throwError(socketId, ERRORS.GAME_NOT_FOUND);
        }

        if (!hasGameStarted(game)) {
            return throwError(socketId, ERRORS.GAME_NOT_STARTED);
        }

        const player = getPlayer(game, socketId);
        if (!player) {
            return throwError(socketId, ERRORS.PLAYER_NOT_FOUND);
            removePlayer(game, socketId);
        }

        if (!sellMaterial(game, player, material, amount)) {
            throwError(socketId, ERRORS.NOT_ENOUGH_MATERIALS);
        }
    });

    socket.on("create_building", data => {
        if (!isValidData(data)) {
            return throwError(socketId, ERRORS.INVALID_DATA);
        }
        const { buildingName, startLocation, isVertical } = data;

        if (!Array.isArray(startLocation) || 
            !Number.isInteger(startLocation[0]) || startLocation[0] > (MAX_FIELD_SIZE - 1) || startLocation[0] < 0 || 
            !Number.isInteger(startLocation[1]) || startLocation[1] > (MAX_FIELD_SIZE - 1) || startLocation[1] < 0 || typeof isVertical !== "boolean") {
                return throwError(socketId, ERRORS.INVALID_DATA);
        }

        const building = getBuildingByName(buildingName);
        if (!building) {
            return throwError(socketId, ERRORS.BUILDING_NOT_FOUND);
        }

        const game = getGame(socketId);
        if (!game) {
            return throwError(socketId, ERRORS.GAME_NOT_FOUND);
        }

        if (!hasGameStarted(game)) {
            return throwError(socketId, ERRORS.GAME_NOT_STARTED);
        }

        const player = getPlayer(game, socketId);
        if (!player) {
            return throwError(socketId, ERRORS.PLAYER_NOT_FOUND);
            removePlayer(game, socketId);
        }

        const field = player.field;

        if (!hasRequiredBuilding(building, field)) {
            return throwError(socketId, ERRORS.NO_REQUIRED_BUILDING);
        }

        if (!hasRequiredMaterials(building.MATERIAL_COST, player.materials)) {
            return throwError(socketId, ERRORS.NOT_ENOUGH_MATERIALS);
        }

        if (!hasRequiredMoney(building.MONEY_COST, player.money)) {
            return throwError(socketId, ERRORS.NOT_ENOUGH_MONEY);
        }

        const buildingBounds = getBuildingBounds({building, startLocation, isVertical});

        if (!isPlacementInBounds(buildingBounds)) {
            return throwError(socketId, ERRORS.OUT_OF_BOUNDS);
        }

        const placementErrorMessage = hasPlacementError(buildingName, field, buildingBounds);
        if (placementErrorMessage) {
            return throwError(socketId, placementErrorMessage);
        }

        placeBuilding(game, player, field, buildingBounds, building, isVertical);
    });

    socket.on("delete_building", location => {
        if (!Array.isArray(location) ||
            !Number.isInteger(location[0]) || location[0] > (MAX_FIELD_SIZE - 1) || location[0] < 0 ||
            !Number.isInteger(location[1]) || location[1] > (MAX_FIELD_SIZE - 1) || location[1] < 0) {
            return throwError(socketId, ERRORS.INVALID_DATA);
        }

        const y = location[0];
        const x = location[1];

        const game = getGame(socketId);
        if (!game) {
            return throwError(socketId, ERRORS.GAME_NOT_FOUND);
        }

        if (!hasGameStarted(game)) {
            return throwError(socketId, ERRORS.GAME_NOT_STARTED);
        }

        const player = getPlayer(game, socketId);
        if (!player) {
            return throwError(socketId, ERRORS.PLAYER_NOT_FOUND);
            removePlayer(game, socketId);
        }

        const field = player.field;
        const buildingObject = field[y][x];

        if (!buildingObject) {
            return throwError(socketId, ERRORS.CELL_NOT_A_BUILDING);
        }

        if (isTownHall(buildingObject.buildingName)) {
            return throwError(socketId, ERRORS.CANNOT_DELETE_TOWN_HALL);
        }

        const buildingBounds = getBuildingBounds(buildingObject);
        const buildingId = buildingObject.id;

        if (!canDeleteBuilding(field, buildingId, buildingBounds)) {
            return throwError(socketId, ERRORS.UNEXPECTED_BUILDING_BOUNDS);
        }

        deleteBuilding(game, player, field, buildingBounds);
    });
}

export default gameLogic;
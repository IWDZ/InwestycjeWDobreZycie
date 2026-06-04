import Building from "../exports/Building.js";
import { sendCellPriceUpdate, sendFieldUpdate, sendHappinessUpdate, sendMaterialPricesUpdate, sendMaterialsUpdate, sendMaxPopulationUpdate, sendMoneyDecrease, sendMoneyIncrease, sendMoneyUpdate, sendPopulationUpdate } from "../exports/clientUpdates.js";
import { getDefaultSettings, getGame, isValidData, isHost, getCurrentBuildingId, setUpPlayer, getFieldMiddle, createField, getDefaultClientGameDataObject, getBuildingByName, getPlayer, hasRequiredBuilding, hasRequiredMaterials, hasRequiredMoney, getBuildingBounds, isPlacementInBounds, hasPlacementError, removeMaterials, removeMoney, placeBuilding, isTownHall, couldDeleteBuilding, returnMaterials, returnMoney, isMaterialPriceAboveMultiplier, updateMarket, buyMaterial, endGame, sumUpPlayers, decreasePopulation, increasePopulation, updatePopulation, hasAdjacentCell, buyCell, generateIncome } from "../exports/utils.js";
import { BUILDINGS, CELL_PRICE_INCREASE, GAME_DURATION_TICKS, GAME_TICK_SECONDS, GAMES, HAPPINESS_MULTIPLIER, MARKET_UPDATE_TICK_INTERVAL, MATERIAL_PRICES, MATERIALS, MAX_FIELD_SIZE, POPULATION, START_HAPPINESS, START_MATERIALS, START_MONEY, WORK_MULTIPLIER } from "../gameStorage.js";

function gameLogic(io, socket) {
    socket.on("start_game", data => {
        if (!isValidData(data)) {
            socket.emit("error", "Invalid data");
            return;
        }
        const {gameCode, populationPool, marketVolatility} = data;

        if (typeof gameCode !== "string" || 
            !Number.isInteger(populationPool) || populationPool < 50 || populationPool > 100 ||
            !Number.isInteger(marketVolatility)) {
                socket.emit("error", "Invalid Data");
                return;
        }

        const game = getGame(gameCode);
        if (!game) {
            socket.emit("error", "Game Not Found");
            return;
        }
        
        game.started = true;
        game.settings = getDefaultSettings(populationPool, marketVolatility);
        game.currentTick = {
            tickNumber: 1,
            sales: Object.fromEntries(Object.values(MATERIALS).map(material => [material, 0])),
            purchases: Object.fromEntries(Object.values(MATERIALS).map(material => [material, 0]))
        };
        game.materialPrices = MATERIAL_PRICES;
        game.gameTickInterval = setInterval(() => doGameTick(game), GAME_TICK_SECONDS * 1000);

        if (!isHost(game, socket.id)) {
            socket.emit("error", "Access Denied");
            return;
        }

        const middle = getFieldMiddle();
        for (const player of game.players) {
            setUpPlayer(game, player, middle);
            io.to(player.socketId).emit("game_start", getDefaultClientGameDataObject(game, player));
        }
    });

    socket.on("buy_cell", data => {
        if (!isValidData(data)) {
            socket.emit("error", "Invalid data");
            return;
        }

        const { gameCode, location } = data;

        if (typeof gameCode !== "string" || !Array.isArray(location) || 
            !Number.isInteger(location[0]) || location[0] > (MAX_FIELD_SIZE - 1) || location[0] < 0 || 
            !Number.isInteger(location[1]) || location[1] > (MAX_FIELD_SIZE - 1) || location[1] < 0) {
            socket.emit("error", "Invalid Data");
            return;
        }

        const game = getGame(gameCode);
        const player = getPlayer(game, socket.id);
        const field = player.field;

        if (!hasAdjacentCell(field, location)) {
            socket.emit("error", "You can only buy cell adjacent to an owned cell");
            return;
        }

        if (!buyCell(player, location)) {
            socket.emit("error", "Not Enough Money");
            return;
        }

        sendMoneyDecrease(io, player, player.nextCellPrice - CELL_PRICE_INCREASE);
        sendFieldUpdate(io, player);
        sendMoneyUpdate(io, player);
        sendCellPriceUpdate(io, player);
    });

    socket.on("buy_material", data => {
        if (!isValidData(data)) {
            socket.emit("error", "Invalid data");
            return;
        }

        const { gameCode, material, amount } = data;

        if (typeof gameCode !== "string" || !Object.values(MATERIALS).includes(material) || !Number.isInteger(amount)) {
            socket.emit("error", "Invalid Data");
            return;
        }

        const game = getGame(socket, gameCode);
        if (!game) return;

        const player = getPlayer(game, socket.id);

        if (!buyMaterial(game, player, material, amount)) {
            socket.emit("error", "Not Enough Money");
            return;
        }

        const cost = game.materialPrices[material] * amount;
        sendMoneyDecrease(io, player, cost);
        sendMoneyUpdate(io, player);
        sendMaterialsUpdate(io, player);
    });

    socket.on("sell_material", data => {
        if (!isValidData(data)) {
            socket.emit("error", "Invalid data");
            return;
        }

        const { gameCode, material, amount } = data;

        if (typeof gameCode !== "string" || !Object.values(MATERIALS).includes(material) || !Number.isInteger(amount)) {
            socket.emit("error", "Invalid Data");
            return;
        }

        const game = getGame(socket, gameCode);
        if (!game) return;

        const player = getPlayer(game, socket.id);

        if (!sellMaterial(game, player, material, amount)) {
            socket.emit("error", "Not Enough Materials");
            return;
        }

        const cost = game.materialPrices[material] * amount;
        sendMoneyIncrease(io, player, cost);
        sendMoneyUpdate(io, player);
        sendMaterialsUpdate(io, player);
    });

    socket.on("create_building", data => {
        if (!isValidData(data)) {
            socket.emit("error", "Invalid data");
            return;
        }
        const {gameCode, buildingName, startLocation, isVertical} = data;

        if (typeof gameCode !== "string" || !Array.isArray(startLocation) || 
            !Number.isInteger(startLocation[0]) || startLocation[0] > (MAX_FIELD_SIZE - 1) || startLocation[0] < 0 || 
            !Number.isInteger(startLocation[1]) || startLocation[1] > (MAX_FIELD_SIZE - 1) || startLocation[1] < 0 || typeof isVertical !== "boolean") {
                socket.emit("error", "Invalid Data");
                return;
        }

        const building = getBuildingByName(buildingName);
        if (!building) {
            socket.emit("error", "Building not found");
            return;
        }

        const game = getGame(socket, gameCode);
        if (!game) return;

        const player = getPlayer(game, socket.id);
        const field = player.field;

        if (!hasRequiredBuilding(building, field)) {
            socket.emit("error", "Required Building Not Found");
            return;
        }

        if (!hasRequiredMaterials(building.MATERIAL_COST, player.materials)) {
            socket.emit("error", "Not Enough Materials");
            return;
        }

        if (hasRequiredMoney(building.MONEY_COST, player.money)) {
            socket.emit("error", "Not Enough Money");
            return;
        }

        const { rowStart, columnStart, rowEnd, columnEnd } = getBuildingBounds(building, startLocation, isVertical);

        if (isPlacementInBounds(rowEnd, columnEnd)) {
            socket.emit("error", "Out Of Bounds");
            return;
        }

        const placementErrorMessage = hasPlacementError(buildingName, field, rowStart, columnStart, rowEnd, columnEnd);
        if (placementErrorMessage) {
            socket.emit("error", placementErrorMessage);
            return;
        }

        const id = getCurrentBuildingId(game);
        removeMaterials(player, building.MATERIAL_COST);
        removeMoney(player, building.MONEY_COST)

        placeBuilding(player, field, rowStart, columnStart, rowEnd, columnEnd, id, building, isVertical);

        sendFieldUpdate(io, player);
        sendHappinessUpdate(io, player);
        sendMaterialsUpdate(io, player);
        sendMoneyDecrease(io, player, building.MONEY_COST);
        sendMoneyUpdate(io, player);
        sendMaxPopulationUpdate(io, player);
    });

    socket.on("delete_building", data => {
        if (!isValidData(data)) {
            socket.emit("error", "Invalid data");
            return;
        }
        const {gameCode, location} = data;

        if (typeof gameCode !== "string" || !Array.isArray(location)) {
            socket.emit("error", "Invalid Data");
            return;
        }

        const [y, x] = location;
        if (!Number.isInteger(y) || !Number.isInteger(x)) {
            socket.emit("error", "Invalid Data");
            return;
        }

        const game = getGame(socket, gameCode);
        if (!game) return;
        
        const player = getPlayer(game, socket.id);
        const field = player.field;
        const buildingObject = field[y][x];

        if (!buildingObject) {
            socket.emit("error", "Not a building");
            return;
        }

        if (isTownHall(buildingObject.building.NAME)) {
            socket.emit("error", "Cannot Delete The Town Hall");
            return;
        }

        if (!couldDeleteBuilding(game, player, buildingObject)) {
            socket.emit("error", "Something Went Wrong With Deleting A Building");
            return;
        }

        returnMaterials(player, building.MATERIAL_COST);
        sendMoneyIncrease(io, player, returnMoney(player, building.MONEY_COST));

        sendFieldUpdate(io, player);
        sendHappinessUpdate(io, player);
        sendMaterialsUpdate(io, player);
        sendMoneyUpdate(io, player);
        sendPopulationUpdate(io, game);
    });
}

function doGameTick(io, game) {
    const currentTick = game.currentTick;

    for (const player of game.players) {
        sendMoneyIncrease(generateIncome(player));
        sendMoneyUpdate(io, player);
    }

    if (currentTick.tickNumber >= GAME_DURATION_TICKS) {
        const leaderboard = sumUpPlayers(game);
        for (const player of game.players) {
            io.to(player.socketId).emit("game_end", {
                worth: player.worth,
                leaderboard: leaderboard
            });
        }
        return endGame(game);
    }

    if (currentTick.tickNumber % MARKET_UPDATE_TICK_INTERVAL === 0) {
        updateMarket(game, currentTick);
        sendMaterialPricesUpdate(io, game);
    }

    updatePopulation(game);
    sendPopulationUpdate(io, game);
    for (const player of game.players) {
        sendFieldUpdate(io, player);
    }

    currentTick.tickNumber++;
}

export default gameLogic;
import Building from "../exports/Building";
import { getDefaultSettings, getGame, isValidData, isHost, getCurrentBuildingId, setUpPlayer, getFieldMiddle, createField, getDefaultClientPlayerObject, getBuildingByName, getPlayer, hasRequiredBuilding, hasRequiredMaterials, hasRequiredMoney, getBuildingBounds, isPlacementInBounds, hasPlacementError, removeMaterials, removeMoney, placeBuilding, isTownHall, couldDeleteBuilding, returnMaterials, returnMoney } from "../exports/utils";
import { BUILDINGS, GAMES, MAX_FIELD_SIZE, POPULATION, START_HAPPINESS, START_MATERIALS, START_MONEY } from "../gameStorage";

function gameLogic(io, socket) {
    socket.on("start_game", data => {
        if (!isValidData(data)) {
            socket.emit("error", "Invalid data");
            return;
        }
        const {gameCode, populationPool, buildingCost, buildMarketVolatility} = data;

        if (typeof gameCode !== "string" || 
            !Number.isInteger(populationPool) || populationPool < 50 || populationPool > 100 || 
            !Number.isInteger(buildingCost) || !Number.isInteger(buildMarketVolatility)) {
                socket.emit("error", "Invalid Data");
                return;
        }

        const game = getGame(gameCode);
        if (!game) {
            socket.emit("error", "Game Not Found");
            return;
        }
        
        game.started = true;
        game.settings = getDefaultSettings(populationPool, buildingCost, buildMarketVolatility);

        if (!isHost(game, socket.id)) {
            socket.emit("error", "Access Denied");
            return;
        }

        const middle = getFieldMiddle();
        game.players.forEach(player => {
            setUpPlayer(game, player, middle);
            io.to(player.socketId).emit("game_start", getDefaultClientPlayerObject(game, player));
        });
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

        const placementErrorMessage = hasPlacementError(field, rowStart, columnStart, rowEnd, columnEnd);
        if (placementErrorMessage) {
            socket.emit("error", placementErrorMessage);
            return;
        }

        const id = getCurrentBuildingId(game);
        removeMaterials(player, building.MATERIAL_COST);
        removeMoney(player, building.MONEY_COST)

        placeBuilding(field, rowStart, columnStart, rowEnd, columnEnd, id, building, isVertical);

        socket.emit("field_update", {field, materials: player.materials, money: player.money});
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

        const { id, building, startLocation, isVertical } = buildingObject;

        if (isTownHall(building.NAME)) {
            socket.emit("error", "Cannot Delete The Town Hall");
            return;
        }

        const { rowStart, columnStart, rowEnd, columnEnd } = getBuildingBounds(building, startLocation, isVertical);

        if (!couldDeleteBuilding(field, rowStart, columnStart, rowEnd, columnEnd, buildingObject)) {
            socket.emit("error", "Something Went Wrong With Deleting A Building");
            return;
        }

        returnMaterials(player, building.MATERIAL_COST);
        returnMoney(player, building.MONEY_COST);

        socket.emit("field_update", {field, materials: player.materials, money: player.money});
    });
}

export default gameLogic;
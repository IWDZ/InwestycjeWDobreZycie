import { canDeleteBuilding, deleteBuilding, getBuildingBounds, getBuildingByName, hasRequiredBuilding, isTownHall, placeBuilding } from "../utils/buildingUtils.ts";
import { buyCell, hasAdjacentCell, hasPlacementError, isPlacementInBounds } from "../utils/fieldUtils.js";
import { getGame, hasGameEnoughPlayers, hasGameStarted, startGame } from "../utils/gameUtils.js";
import { throwError } from "../utils/generalUtils.js";
import { buyMaterial, hasRequiredMaterials, hasRequiredMoney, sellMaterial } from "../utils/inventoryUtils.js";
import { createDefaultClientGameDataObject, getPlayer, getPlayerGame, isHost, removePlayer, setUpPlayer } from "../utils/playerUtils.js";
import { io } from "../config/socket.js";
import { ERRORS } from "../../../shared/errors.js";
import { MATERIALS } from "../config/materials.js";
import { Socket } from "socket.io";
import { MAX_FIELD_SIZE } from "../config/fields.js";
import { createBuildingSchema, locationSchema, materialTransactionSchema, startGameSchema } from "../../../shared/schemas/server-event-schemas.js";
import { GameMatch } from "../config/games.ts";

function gameLogic(socket: Socket) {
    socket.on("start_game", data => {
        const result = startGameSchema.safeParse(data);
        if (!result.success) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const settings = result.data;

        const game = getGame(getPlayerGame(socket.id));
        if (!game) {
            return throwError(socket.id, ERRORS.GAME_NOT_FOUND);
        }
        
        if (!hasGameEnoughPlayers(game)) {
            return throwError(socket.id, ERRORS.NOT_ENOUGH_PLAYERS);
        }

        if (hasGameStarted(game)) {
            return throwError(socket.id, ERRORS.GAME_ALREADY_STARTED);
        }

        if (!isHost(game, socket.id)) {
            return throwError(socket.id, ERRORS.HOST_FEATURE);
        }

        startGame(game, settings);

        for (const player of game.players) {
            setUpPlayer(game, player);
            io.to(player.socketId).emit("game_start", createDefaultClientGameDataObject(game, player));
        }
    });

    socket.on("buy_cell", data => {
        const result = locationSchema.safeParse(data);
        if (!result.success) {
            return throwError(socket.id, ERRORS.INVALID_DATA)
        }

        const location = result.data;

        const game = getGame(getPlayerGame(socket.id));
        if (!game) {
            return throwError(socket.id, ERRORS.GAME_NOT_FOUND);
        }

        if (!hasGameStarted(game)) {
            return throwError(socket.id, ERRORS.GAME_NOT_STARTED);
        }

        const player = getPlayer(game, socket.id);
        if (!player) {
            removePlayer(game, socket.id);
            return throwError(socket.id, ERRORS.PLAYER_NOT_FOUND);
        }

        const field = player.field;

        if (!hasAdjacentCell(field, location)) {
            return throwError(socket.id, ERRORS.NO_ADJACENT_CELLS_OWNED);
        }

        if (!buyCell(player, location)) {
            throwError(socket.id, ERRORS.NOT_ENOUGH_MONEY);
        }
    });

    socket.on("buy_material", data => {
        const result = materialTransactionSchema.safeParse(data);
        if (!result.success) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const { material, amount } = result.data;

        const game = getGame(getPlayerGame(socket.id));
        if (!game) {
            return throwError(socket.id, ERRORS.GAME_NOT_FOUND);
        }

        if (!hasGameStarted(game)) {
            return throwError(socket.id, ERRORS.GAME_NOT_STARTED);
        }
        
        const player = getPlayer(game, socket.id);
        if (!player) {
            removePlayer(game, socket.id);
            return throwError(socket.id, ERRORS.PLAYER_NOT_FOUND);
        }

        if (!buyMaterial(game, player, material, amount)) {
            throwError(socket.id, ERRORS.NOT_ENOUGH_MONEY);
        }
    });

    socket.on("sell_material", data => {
        const result = materialTransactionSchema.safeParse(data);
        if (!result.success) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const { material, amount } = result.data;

        const game = getGame(getPlayerGame(socket.id));
        if (!game) {
            return throwError(socket.id, ERRORS.GAME_NOT_FOUND);
        }

        if (!hasGameStarted(game)) {
            return throwError(socket.id, ERRORS.GAME_NOT_STARTED);
        }

        const player = getPlayer(game, socket.id);
        if (!player) {
            removePlayer(game, socket.id);
            return throwError(socket.id, ERRORS.PLAYER_NOT_FOUND);
        }

        if (!sellMaterial(game, player, material, amount)) {
            throwError(socket.id, ERRORS.NOT_ENOUGH_MATERIALS);
        }
    });

    socket.on("create_building", data => {
        const result = createBuildingSchema.safeParse(data);
        if (!result.success) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }
        const { buildingName, location, isVertical } = result.data;

        const building = getBuildingByName(buildingName);
        if (!building) {
            return throwError(socket.id, ERRORS.BUILDING_NOT_FOUND);
        }

        const game = getGame(getPlayerGame(socket.id));
        if (!game) {
            return throwError(socket.id, ERRORS.GAME_NOT_FOUND);
        }

        if (!hasGameStarted(game)) {
            return throwError(socket.id, ERRORS.GAME_NOT_STARTED);
        }

        const player = getPlayer(game, socket.id);
        if (!player) {
            removePlayer(game, socket.id);
            return throwError(socket.id, ERRORS.PLAYER_NOT_FOUND);
        }

        const field = player.field;

        if (isTownHall(buildingName)) {
            return throwError(socket.id, ERRORS.CANNOT_PLACE_TOWN_HALL);
        }

        if (!hasRequiredBuilding(building, field)) {
            return throwError(socket.id, ERRORS.NO_REQUIRED_BUILDING);
        }

        if (!hasRequiredMaterials(building.MATERIAL_COST, player.materials)) {
            return throwError(socket.id, ERRORS.NOT_ENOUGH_MATERIALS);
        }

        if (!hasRequiredMoney(building.MONEY_COST, player.money)) {
            return throwError(socket.id, ERRORS.NOT_ENOUGH_MONEY);
        }

        const buildingBounds = getBuildingBounds({width: building.WIDTH, height: building.HEIGHT, startLocation: location, isVertical});

        if (!isPlacementInBounds(buildingBounds)) {
            return throwError(socket.id, ERRORS.OUT_OF_BOUNDS);
        }

        const placementErrorMessage = hasPlacementError(buildingName, field, buildingBounds);
        if (placementErrorMessage) {
            return throwError(socket.id, placementErrorMessage);
        }

        placeBuilding(<GameMatch>game, player, field, buildingBounds, building, isVertical);
    });

    socket.on("delete_building", data => {
        const result = locationSchema.safeParse(data);
        if (!result.success) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const { y, x } = result.data;

        const game = getGame(getPlayerGame(socket.id));
        if (!game) {
            return throwError(socket.id, ERRORS.GAME_NOT_FOUND);
        }

        if (!hasGameStarted(game)) {
            return throwError(socket.id, ERRORS.GAME_NOT_STARTED);
        }

        const player = getPlayer(game, socket.id);
        if (!player) {
            removePlayer(game, socket.id);
            return throwError(socket.id, ERRORS.PLAYER_NOT_FOUND);
        }

        const field = player.field;
        const buildingObject = field[y][x];

        if (!buildingObject) {
            return throwError(socket.id, ERRORS.CELL_NOT_A_BUILDING);
        }

        if (isTownHall(buildingObject.buildingName)) {
            return throwError(socket.id, ERRORS.CANNOT_DELETE_TOWN_HALL);
        }

        const buildingBounds = getBuildingBounds(buildingObject);
        const buildingId = buildingObject.id;

        if (!canDeleteBuilding(field, buildingId, buildingBounds)) {
            return throwError(socket.id, ERRORS.UNEXPECTED_BUILDING_BOUNDS);
        }

        deleteBuilding(<GameMatch>game, player, field, buildingBounds);
    });
}

export default gameLogic;
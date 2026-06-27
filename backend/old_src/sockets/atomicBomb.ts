import { endGame, getGame, hasGameEnoughPlayers, hasGameStarted } from "../utils/gameUtils.js";
import { throwError } from "../utils/generalUtils.js";
import { hasRequiredMaterials, hasRequiredMoney, removeMaterials, removeMoney } from "../utils/inventoryUtils.js";
import { getPlayer, getPlayerGame, removePlayer } from "../utils/playerUtils.js";
import { ATOMIC_BOMB } from "../config/sabotages.js";
import { ERRORS } from "../../../shared/errors.js"
import { io } from "../config/socket.js";
import { hasRequiredBuilding } from "../utils/buildingUtils.ts/index.js";
import { Socket } from "socket.io";
import { GameMatch } from "../config/games.js";
import { sendAtomicBombSchema } from "../../../shared/schemas/server-event-schemas.js";

function atomicBomb(socket: Socket) {
    socket.on("send_atomic_bomb", targetName => {
        const result = sendAtomicBombSchema.safeParse(targetName);
        if (!result.success) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const game = <GameMatch>getGame(getPlayerGame(socket.id));
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

        const target = game.players.find(p => p.username === targetName);
        if (!target) {
            return throwError(socket.id, ERRORS.TARGET_NOT_FOUND);
        }

        if (target.socketId === socket.id) {
            return socket.emit("error", ERRORS.SELF_NUKE);
        }

        if (!hasRequiredMoney(ATOMIC_BOMB.MONEY_COST, player.money)) {
            return throwError(socket.id, ERRORS.NOT_ENOUGH_MONEY);
        }

        if (!hasRequiredMaterials(ATOMIC_BOMB.MATERIAL_COST, player.materials)) {
            return throwError(socket.id, ERRORS.NOT_ENOUGH_MATERIALS);
        }

        if (!hasRequiredBuilding(ATOMIC_BOMB, player.field)) {
            return throwError(socket.id, ERRORS.NO_REQUIRED_BUILDING);
        }
        
        removeMoney(player, ATOMIC_BOMB.MONEY_COST);
        removeMaterials(player, ATOMIC_BOMB.MATERIAL_COST);

        io.to(target.socketId).emit("nuked", player.username);
        removePlayer(game, target.socketId);
        for (const player of game.players) {
            io.to(player.socketId).emit("player_nuke", target.username);
        }

        if (!hasGameEnoughPlayers(game)) endGame(game);
    });
}

export default atomicBomb;
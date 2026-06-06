import { getGame, getPlayer, hasEnoughPlayers, hasRequiredMaterials, hasRequiredMoney, isValidData, removeMaterials, removeMoney, removePlayer, throwError } from "../exports/utils.js";
import { ERRORS, MIN_PLAYERS, ATOMIC_BOMB } from "../gameStorage.js";
import { io } from "../server.js";

function atomicBomb(socket, socketId) {
    socket.on("send_atomic_bomb", targetName => {
        if (typeof targetName !== "string") {
            return throwError(socketId, ERRORS.INVALID_DATA);
        }

        const game = getGame(socketId);
        if (!game) {
            return throwError(socketId, ERRORS.GAME_NOT_FOUND);
        }

        const player = getPlayer(game, socketId);
        if (!player) {
            return throwError(socketId, ERRORS.PLAYER_NOT_FOUND);
            removePlayer(game, socketId);
        }

        const target = game.players.find(p => p.username === targetName);
        if (!target) {
            return throwError(socketId, ERRORS.TARGET_NOT_FOUND);
        }

        if (target.socketId === socketId) {
            return socket.emit("error", ERRORS.SELF_NUKE);
        }

        if (!hasRequiredMoney(ATOMIC_BOMB.MONEY_COST, player.money)) {
            return throwError(socketId, ERRORS.NOT_ENOUGH_MONEY);
        }

        if (!hasRequiredMaterials(ATOMIC_BOMB.MATERIAL_COST, player.materials)) {
            return throwError(socketId, ERRORS.NOT_ENOUGH_MATERIALS);
        }
        
        removeMoney(player, ATOMIC_BOMB.MONEY_COST);
        removeMaterials(player, ATOMIC_BOMB.MATERIAL_COST);

        io.to(target.socketId).emit("nuked", player.username);
        removePlayer(game, target.socketId);
        for (const player of game.players) {
            io.to(player.socketId).emit("player_nuke", target.username);
        }

        if (!hasEnoughPlayers(game)) endGame(game);
    });
}

export default atomicBomb;
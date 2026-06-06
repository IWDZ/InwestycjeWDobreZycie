import { endGame, getGame, getPlayer, hasRequiredMaterials, hasRequiredMoney, isValidData, removeMaterials, removeMoney, removePlayer } from "../exports/utils.js";
import { ERRORS, MIN_PLAYERS, ATOMIC_BOMB } from "../gameStorage.js";
import { io } from "../server.js";

function atomicBomb(socket) {
    socket.on("send_atomic_bomb", data => {
        if (!isValidData(data)) {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const { gameCode, targetName } = data;

        if (typeof gameCode !== "string" || typeof targetName !== "string") {
            return throwError(socket.id, ERRORS.INVALID_DATA);
        }

        const game = getGame(gameCode);
        if (!game) {
            return throwError(socket.id, ERRORS.GAME_NOT_FOUND);
        }

        const player = getPlayer(game, socket.id);

        const target = game.players.find(p => p.username === targetName);
        if (target.socketId === socket.id) {
            return socket.emit("error", ERRORS.SELF_NUKE);
        }

        if (!hasRequiredMoney(ATOMIC_BOMB.MONEY_COST, player.money)) {
            return throwError(socket.id, ERRORS.NOT_ENOUGH_MONEY);
        }

        if (!hasRequiredMaterials(ATOMIC_BOMB.MATERIAL_COST, player.materials)) {
            return throwError(socket.id, ERRORS.NOT_ENOUGH_MATERIALS);
        }
        
        removeMoney(player, ATOMIC_BOMB.MONEY_COST);
        removeMaterials(player, ATOMIC_BOMB.MATERIAL_COST);

        io.to(target.socketId).emit("nuked", player.username);
        removePlayer(game, target.socketId);
        for (const player of game.players) {
            io.to(player.socketId).emit("player_nuke", target.username);
        }

        if (game.players.length < MIN_PLAYERS) endGame(game);
    });
}

export default atomicBomb;
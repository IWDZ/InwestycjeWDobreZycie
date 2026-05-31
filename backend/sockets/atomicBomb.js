import { getGame, getPlayer, hasRequiredMaterials, hasRequiredMoney, isValidData, removeMaterials, removeMoney, removePlayer } from "../exports/utils.js";
import { ATOMIC_BOMB } from "../gameStorage.js";

function atomicBomb(io, socket) {
    socket.on("send_atomic_bomb", data => {
        if (!isValidData(data)) {
            socket.emit("error", "Invalid data");
            return;
        }

        const { gameCode, targetName } = data;

        if (typeof gameCode !== "string" || typeof targetName !== "string") {
            socket.emit("error", "Invalid data");
            return;
        }

        const game = getGame(gameCode);
        if (!game) {
            socket.emit("error", "Game Not Found");
            return;
        }

        const player = getPlayer(game, socket.id);

        const target = game.players.find(p => p.username === targetName);
        if (target.socketId === socket.id) {
            socket.emit("error", "You can't nuke yourself");
            return;
        }

        if (!hasRequiredMoney(ATOMIC_BOMB.MONEY_COST, player.money)) {
            socket.emit("error", "Not Enough Money");
            return;
        }

        if (!hasRequiredMaterials(ATOMIC_BOMB.MATERIAL_COST, player.materials)) {
            socket.emit("error", "Not Enough Materials");
            return;
        }
        
        removeMoney(player, ATOMIC_BOMB.MONEY_COST);
        removeMaterials(player, ATOMIC_BOMB.MATERIAL_COST);

        io.to(target.socketId).emit("nuked", player.username);
        removePlayer(game, target.socketId);
        for (const player of game.players) {
            io.to(player.socketId).emit("player_nuke", target.username);
        }
    });
}

export default atomicBomb;
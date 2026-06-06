import { GAMES } from "../gameStorage.js";
import { endGame, getGame, hasGameStarted, hasPlayer, isHost, removePlayer } from "./utils.js";

export default function leaveGame(io, socket, gameCode) {
    if (typeof gameCode !== "string") {
        socket.emit("error", "Invalid data");
        return;
    }

    const game = getGame(gameCode);
    if (!game) return;

    if (!hasPlayer(game, socket.id)) {
        socket.emit("error", "Player not in the game");
        return;
    }

    if (isHost(game, socket.id) && !hasGameStarted(game)) {
        socket.emit("left");
        for (const player of game.players) {
            io.to(player.socketId).emit("host_left");
        }
        GAMES.delete(gameCode);
        return;
    }

    removePlayer(game, socket.id);

    const usernames = game.players.map(player => player.username);

    for (const player of game.players) {
        io.to(player.socketId).emit("player_left", player.username);
    }

    socket.emit("left");

    if (game.players.length < 2) endGame(io, game);
}
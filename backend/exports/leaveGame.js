import { ERRORS, GAMES, MIN_PLAYERS } from "../gameStorage.js";
import { io } from "../server.js";
import { endGame, getGame, hasGameStarted, hasPlayer, isHost, removePlayer, throwError } from "./utils.js";

export default function leaveGame(socket, gameCode) {
    if (typeof gameCode !== "string") {
        return throwError(socket.id, ERRORS.INVALID_DATA);
    }

    const game = getGame(gameCode);
    if (!game) {
        return throwError(socket.id, ERRORS.GAME_NOT_FOUND);
    }

    if (!hasPlayer(game, socket.id)) {
        return throwError(socket.id, ERRORS.PLAYER_NOT_IN_GAME);
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

    if (game.players.length < MIN_PLAYERS) endGame(game);
}
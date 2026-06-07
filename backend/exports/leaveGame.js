import { ERRORS, GAMES, MIN_PLAYERS } from "../gameStorage.js";
import { io } from "../server.js";
import { closeGame, endGame, getGame, hasEnoughPlayers, hasGameStarted, isHost, isPlayerInGame, removePlayer, throwError } from "./utils.js";

export default function leaveGame(socket, socketId) {
    const game = getGame(socketId);
    if (!game) {
        if (isPlayerInGame(socketId)) throwError(socketId, ERRORS.GAME_NOT_FOUND);
        return;
    }

    if (isHost(game, socketId) && !hasGameStarted(game)) {
        removePlayer(game, socketId);
        socket.emit("left");
        for (const player of game.players) {
            io.to(player.socketId).emit("host_left");
            removePlayer(game, player.socketId);
        }
        return closeGame(game)
    }

    removePlayer(game, socketId);

    const usernames = game.players.map(player => player.username);

    for (const player of game.players) {
        io.to(player.socketId).emit("player_left", usernames);
    }

    socket.emit("left");

    if (!hasEnoughPlayers(game) && hasGameStarted(game)) endGame(game);
}
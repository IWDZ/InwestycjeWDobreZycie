import { ERRORS, GAMES, MIN_PLAYERS } from "../gameStorage.js";
import { io } from "../server.js";
import { endGame, getGame, hasEnoughPlayers, hasGameStarted, isHost, removePlayer, throwError } from "./utils.js";

export default function leaveGame(socket, socketId) {
    const game = getGame(socketId);
    if (!game) return;

    if (isHost(game, socketId) && !hasGameStarted(game)) {
        removePlayer(game, socketId);
        socket.emit("left");
        for (const player of game.players) {
            io.to(player.socketId).emit("host_left");
            removePlayer(game, player.socketId);
        }
        return endGame(game);
    }

    removePlayer(game, socketId);

    const usernames = game.players.map(player => player.username);

    for (const player of game.players) {
        io.to(player.socketId).emit("player_left", player.username);
    }

    socket.emit("left");

    if (!hasEnoughPlayers(game)) endGame(game);
}
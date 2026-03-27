import { games } from "../gameStorage";

function leaveGame(io, socket, gameCode) {
    if (typeof gameCode !== "string") {
        socket.emit("error", "Invalid data");
        return;
    }

    if (!games.has(gameCode)) {
        socket.emit("error", "Game Not Found");
        return;
    }

    const game = games.get(gameCode);
    const isPlayerInGame = game.players.some(player => player.socketId === socket.id);
    if (!isPlayerInGame) {
        socket.emit("error", "Player not in the game");
        return;
    }

    if (game.host.socketId === socket.id && !game.started) {
        socket.emit("left");
        games.players.forEach(player => io.to(player.socketId).emit("host_left"));
        games.delete(gameCode);
        return;
    }

    game.players = game.players.filter(player => player.socketId !== socket.id);

    const usernames = game.players.map(player => player.username);

    games.players.forEach(player => {
        io.to(player.socketId).emit("player_left", {
            players: usernames
        });
    });

    socket.emit("left");
}

export default leaveGame;
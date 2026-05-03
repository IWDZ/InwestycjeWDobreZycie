export function getGame(socket, gameCode) {
    const game = GAMES.get(gameCode);
    if(!game) socket.emit("error", "Game Not Found");
    return game;
}
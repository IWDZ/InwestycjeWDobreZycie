import { GAMES } from "../gameStorage";

function gameLogic(io, socket) {
    socket.on("start_game", data => {
        if (typeof data !== "object") {
            socket.emit("error", "Invalid data");
            return;
        }
        const {gameCode, populationPool, buildingCost, buildMarketVolatility, maxPlots} = data;

        const game = GAMES.get(gameCode);
        game.started = true;
        game.players.forEach(player => {
            player.field = Array.from({ length: 7 }, () => Array(7));

        });
    });
}

export default gameLogic;
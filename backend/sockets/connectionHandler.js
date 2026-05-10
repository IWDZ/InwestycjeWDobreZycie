import leaveGame from "../exports/leaveGame.js";

import { GAMES } from "../gameStorage.js";
import gameConnection from "./gameConnection.js";
import gameLogic from "./gameLogic.js";

function connectionHandler(io, socket) {
    gameConnection(io, socket);
    
    gameLogic(io, socket);

    socket.on("disconnect", () => {
        const inGame = Array.from(GAMES.entries()).find(([_, game]) => game.players.some(player => player.socketId === socket.id));
        if (inGame) {
            const [gameCode, _] = inGame;
            leaveGame(io, socket, gameCode);
        }
    });
}

export default connectionHandler;
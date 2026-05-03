import leaveGame from "../exports/leaveGame.js";

import { GAMES } from "../gameStorage.js";
import gameConnection from "./gameConnection.js";
import gameLogic from "./gameLogic.js";

function connectionHandler(io, socket) {
    console.log("User connected: ", socket.id);

    gameConnection(io, socket);
    
    gameLogic(io, socket);

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
        const inGame = [...GAMES.entries()].find(([_, game]) => game.players.some(player => player.socketId === socket.id));
        
        if (inGame) {
            const {gameCode} = inGame;
            leaveGame(io, socket, gameCode);
        }
    });
}

export default connectionHandler;
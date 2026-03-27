import leaveGame from "../exports/leaveGame.js";
import { games } from "../gameStorage.js";
import gameConnection from "./gameConnection.js";

function connectionHandler(io, socket) {
    console.log("User connected: ", socket.id);

    gameConnection(io, socket);

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
        const inGame = [...games.entries()].find(([_, game]) => game.players.some(player => player.socketId === socket.id));
        
        if (inGame) {
            const {gameCode} = inGame;
            leaveGame(io, socket, gameCode);
        }
    });
}

export default connectionHandler;
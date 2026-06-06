import leaveGame from "../exports/leaveGame.js";
import { isPlayerInGame, setPlayerGame } from "../exports/utils.js";

import { GAMES, PLAYERS } from "../gameStorage.js";
import { io } from "../server.js";
import gameConnection from "./gameConnection.js";
import gameLogic from "./gameLogic.js";
import atomicBomb from "./atomicBomb.js";

function connectionHandler() {
    io.on("connection", (socket) => {
        const socketId = socket.id;

        setPlayerGame(socketId, null);

        gameConnection(socket, socketId);
    
        gameLogic(socket, socketId);

        atomicBomb(socket, socketId)

        socket.on("disconnect", () => leaveGame(socket, socketId));
    });
}

export default connectionHandler;
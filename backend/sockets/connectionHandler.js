import { leaveGame, setPlayerGame } from "../exports/utils/playerUtils.js";
import { io } from "../server.js";
import gameConnection from "./gameConnection.js";
import gameLogic from "./gameLogic.js";
import atomicBomb from "./atomicBomb.js";
import { isTestMode } from "../exports/utils/generalUtils.js";
import tests from "./tests.js";

function connectionHandler() {
    io.on("connection", (socket) => {
        const socketId = socket.id;

        setPlayerGame(socketId, null);

        gameConnection(socket, socketId);
    
        gameLogic(socket, socketId);

        atomicBomb(socket, socketId);

        if (isTestMode()) {
            tests(socket, socketId);
        }

        socket.on("disconnect", () => leaveGame(socket, socketId));
    });
}

export default connectionHandler;
import { leaveGame, setPlayerGame } from "../utils/playerUtils.js";
import { io } from "../config/socket.js";
import gameConnection from "./gameConnection.js";
import gameLogic from "./gameLogic.js";
import atomicBomb from "./atomicBomb.js";
import { isTestMode } from "../utils/generalUtils.js";
import tests from "../tests/tests.js";

function connectionHandler() {
    io.on("connection", (socket) => {
        setPlayerGame(socket.id, null);

        gameConnection(socket);
    
        gameLogic(socket);

        atomicBomb(socket);

        if (isTestMode()) {
            tests(socket);
        }

        socket.on("disconnect", () => leaveGame(socket));
    });
}

export default connectionHandler;
import { ERRORS } from "../exports/gameStorage.js";
import { doGameTick, getGame, hasGameStarted } from "../exports/utils/gameUtils.js";
import { throwError } from "../exports/utils/generalUtils.js";
import { getPlayerGame } from "../exports/utils/playerUtils.js";

function tests(socket, socketId) {
    socket.on("tick", () => {
        const game = getGame(getPlayerGame(socketId));
        if (!game) {
            return throwError(socketId, ERRORS.GAME_NOT_FOUND);
        }

        if (!hasGameStarted(game)) {
            return throwError(socketId, ERRORS.GAME_NOT_STARTED);
        }

        doGameTick(game);
    });
}

export default tests;
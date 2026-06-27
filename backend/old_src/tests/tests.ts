import { Socket } from "socket.io";
import { ERRORS } from "../../../shared/errors.js";
import { doGameTick, getGame, hasGameStarted } from "../utils/gameUtils.js";
import { throwError } from "../utils/generalUtils.js";
import { getPlayerGame } from "../utils/playerUtils.js";
import { GameMatch } from "../config/games.js";

function tests(socket: Socket) {
    socket.on("tick", () => {
        const game = <GameMatch>getGame(getPlayerGame(socket.id));
        if (!game) {
            return throwError(socket.id, ERRORS.GAME_NOT_FOUND);
        }

        if (!hasGameStarted(game)) {
            return throwError(socket.id, ERRORS.GAME_NOT_STARTED);
        }

        doGameTick(game);
    });
}

export default tests;
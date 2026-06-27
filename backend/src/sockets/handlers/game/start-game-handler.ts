import { Socket } from "socket.io";
import { ERRORS } from "../../../../../shared/dist/errors/errors.js";
import { sendError } from "../../../utils/general-utils.js";
import gameService from "../../../services/GameService.js";

export function handleStartGame(socket: Socket) {
    try {
        gameService.startGame(socket.id);
    } catch (err) {
        const message = err instanceof Error ? err.message : ERRORS.UNKNOWN_ERROR;
        sendError(socket.id, message);
    }
}
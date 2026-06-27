import { Socket } from "socket.io";
import roomService from "../../../services/RoomService.js";
import { sendError } from "../../../utils/general-utils.js";
import { ERRORS } from "../../../../../shared/dist/errors/errors.js";

export function handleLeaveRoom(socket: Socket) {
    try {
        roomService.leaveRoom(socket.id);
    } catch (err) {
        const message = err instanceof Error ? err.message : ERRORS.UNKNOWN_ERROR;
        sendError(socket.id, message);
    }
}
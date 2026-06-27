import { Socket } from "socket.io";
import { joinGameSchema } from "../../../../../shared/dist/schemas/server-event-schemas.js";
import { sendError } from "../../../utils/general-utils.js";
import { ERRORS } from "../../../../../shared/dist/errors/errors.js";
import CLIENT_EVENTS from "../../../../../shared/dist/events/cleint-events.js";
import { io } from "../../../config/server/socket.config.js";
import lobbyService from "../../../services/LobbyService.js";

export function handleJoinLobby(socket: Socket, data: unknown) {
    try {
        const result = joinGameSchema.safeParse(data);
        if (!result.success) {
            return sendError(socket.id, ERRORS.INVALID_DATA);
        }

        const {username, roomCode} = result.data;

        const lobby = lobbyService.joinLobby(socket.id, username, roomCode);

        socket.join(roomCode);

        io.to(roomCode).emit(CLIENT_EVENTS.PLAYER_JOINED, username);
        socket.emit(CLIENT_EVENTS.LOBBY_JOINED, lobby.toDTO());
    } catch (err) {
        const message = err instanceof Error ? err.message : ERRORS.UNKNOWN_ERROR;
        sendError(socket.id, message);
    }
}
import { Socket } from "socket.io";
import { createGameSchema } from "../../../../../shared/dist/schemas/server-event-schemas.js"
import { sendError } from "../../../utils/general-utils.js";
import { ERRORS } from "../../../../../shared/dist/errors/errors.js";
import CLIENT_EVENTS from "../../../../../shared/dist/events/cleint-events.js"
import lobbyService from "../../../services/LobbyService.js";

export function handleCreateLobby(socket: Socket, data: unknown) {
    try {
        const result = createGameSchema.safeParse(data);
        if (!result.success) {
            return sendError(socket.id, ERRORS.INVALID_DATA);
        }

        const {username, maxPlayers, gameMode} = result.data;

        const lobby = lobbyService.createLobby(socket.id, username, maxPlayers, gameMode);

        socket.join(lobby.roomCode);

        socket.emit(CLIENT_EVENTS.LOBBY_CREATED, lobby.toDTO());
    } catch (err) {
        const message = err instanceof Error ? err.message : ERRORS.UNKNOWN_ERROR;
        sendError(socket.id, message);
    }
}
import { getPlayerRoom } from "../utils/player-utils.js";
import { ERRORS } from "../../../shared/dist/errors/errors.js";
import roomRegistry from "../state/RoomRegistry.js";
import { SocketId } from "../types/types.js";

class RoomService {
    public leaveRoom(socketId: SocketId) {
        const gameCode = getPlayerRoom(socketId);
        if (!gameCode) {
            throw new Error(ERRORS.PLAYER_NOT_IN_GAME);
        }

        const room = roomRegistry.getRoom(gameCode);
        if (!room) {
            throw new Error(ERRORS.ROOM_NOT_FOUND);
        }
        room.manager.leaveRoom(socketId, room);
    }
}

const roomService = new RoomService();

export default roomService;
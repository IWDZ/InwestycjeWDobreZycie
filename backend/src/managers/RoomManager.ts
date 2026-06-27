import CLIENT_EVENTS from "../../../shared/dist/events/cleint-events.js";
import { io } from "../config/server/socket.config.js";
import Room from "../entities/Room.js";
import socketRegistry from "../state/SocketRegistry.js";
import { SocketId } from "../types/types.js";

export default abstract class RoomManager {
    leaveRoom(socketId: SocketId, room: Room) {
        room.removePlayer(socketId);

        io.sockets.sockets.get(socketId)?.leave(room.roomCode);
        socketRegistry.removePlayer(socketId);
        io.to(room.roomCode).emit(CLIENT_EVENTS.PLAYER_LEFT);
        
        this.onLeaveRoom(socketId, room);
    }

    protected abstract onLeaveRoom(socketId: SocketId, room: Room): void;
}
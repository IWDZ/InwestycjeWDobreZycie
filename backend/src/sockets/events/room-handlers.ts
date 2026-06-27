import { Socket } from "socket.io";
import SERVER_EVENTS from "../../../../shared/dist/events/server-events.js";
import { handleLeaveRoom } from "../handlers/room/leave-room-handler.js";

export default function registerRoomHandlers(socket: Socket) {
    socket.on(SERVER_EVENTS.LEAVE_ROOM, () => handleLeaveRoom(socket));
}
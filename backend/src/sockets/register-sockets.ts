import { io } from "../config/server/socket.config.js";
import registerLobbyHandlers from "./events/lobby-handlers.js";
import registerRoomHandlers from "./events/room-handlers.js";
import { handleLeaveRoom } from "./handlers/room/leave-room-handler.js";

export default function registerSockets() {
    io.on("connection", (socket) => {

        registerLobbyHandlers(socket);
        registerRoomHandlers(socket);
        
        
        socket.on("disconnect", () => handleLeaveRoom(socket));
    });
}
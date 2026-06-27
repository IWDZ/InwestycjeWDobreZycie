import { io } from "../config/server/socket.config.js";
import { SocketId } from "../types/types.js";

export function sendError(socketId: SocketId, errorMessage: string) {
    io.to(socketId).emit("error", errorMessage);
}
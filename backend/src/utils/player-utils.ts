import socketRegistry from "../state/SocketRegistry.js";
import { SocketId } from "../types/types.js";

export function getPlayerRoom(socketId: SocketId) {
    return socketRegistry.getPlayerGame(socketId);
}
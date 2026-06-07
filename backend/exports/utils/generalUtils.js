import { io } from "../../server.js";

export function throwError(socketId, errorMessage) {
    io.to(socketId).emit("error", errorMessage);
}

export function isValidData(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
}
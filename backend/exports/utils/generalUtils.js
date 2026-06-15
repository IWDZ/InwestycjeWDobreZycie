import { io } from "../../server.js";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(import.meta.dirname, "../../.env")
});

export function throwError(socketId, errorMessage) {
    io.to(socketId).emit("error", errorMessage);
}

export function isValidData(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
}

export function isTestMode() {
    return process.env.MODE === "test";
}
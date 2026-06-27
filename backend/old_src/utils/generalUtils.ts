import { io } from "../config/socket.js";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(import.meta.dirname, "../../.env")
});

export function throwError(socketId, errorMessage) {
    io.to(socketId).emit("error", errorMessage);
}

export function isTestMode() {
    return process.env.MODE === "test";
}
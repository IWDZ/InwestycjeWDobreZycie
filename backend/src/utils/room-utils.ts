import roomRegistry from "../state/RoomRegistry.js";
import { RoomCode } from "../types/types.js";

export function getRoom(roomCode: RoomCode) {
    return roomRegistry.getRoom(roomCode)
}
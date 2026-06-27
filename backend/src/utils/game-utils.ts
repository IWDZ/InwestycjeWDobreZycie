import { ROOM_CODE_CHARACTERS, ROOM_CODE_LENGTH } from "../config/game/rooms.config.js";
import roomRegistry from "../state/RoomRegistry.js";

export function generateRoomCode() {
    let roomCode;
    do {
        roomCode = "";
        for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
            roomCode += ROOM_CODE_CHARACTERS[Math.floor(Math.random() * ROOM_CODE_CHARACTERS.length)];
        }
    } while (roomRegistry.has(roomCode));
    return roomCode;
}


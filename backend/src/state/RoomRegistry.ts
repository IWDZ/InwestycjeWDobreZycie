import Room from "../entities/Room.js";
import { RoomCode } from "../types/types.js";

class RoomRegistry {
    private readonly codeToRoom = new Map<RoomCode, Room>();

    public setRoom(roomCode: RoomCode, room: Room) {
        this.codeToRoom.set(roomCode, room);
    }

    public removeRoom(roomCode: RoomCode) {
        this.codeToRoom.delete(roomCode);
    }

    public has(roomCode: RoomCode) {
        return this.codeToRoom.has(roomCode);
    }

    public getRoom(roomCode: RoomCode) {
        return this.codeToRoom.get(roomCode);
    }
}

const roomRegistry = new RoomRegistry();

export default roomRegistry;
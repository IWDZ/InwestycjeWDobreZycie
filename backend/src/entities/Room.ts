import RoomManager from "../managers/RoomManager.js";
import { RoomCode, SocketId } from "../types/types.js";
import Player from "./Player.js";

abstract class Room {
    public readonly roomCode: RoomCode;
    public readonly players: Map<SocketId, Player>;
    public readonly manager: RoomManager;

    constructor(roomCode: RoomCode, players: Map<SocketId, Player>, manager: RoomManager) {
        this.roomCode = roomCode;
        this.players = players;
        this.manager = manager;
    }

    public getPlayersArray() {
        const players = [...this.players.values()];
        return players;
    }

    public getPlayersCount() {
        return this.players.size;
    }

    public removePlayer(socketId: SocketId) {
        this.players.delete(socketId);
    }

    public getPlayer(socketId: SocketId) {
        return this.players.get(socketId);
    }
}

export default Room;
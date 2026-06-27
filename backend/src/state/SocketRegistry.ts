import { RoomCode, SocketId } from "../types/types.js";

class SocketRegistry {
    private readonly socketToGame = new Map<SocketId, RoomCode>();

    public addPlayer(socketId: SocketId, roomCode: RoomCode) {
        this.socketToGame.set(socketId, roomCode);
    }

    public removePlayer(socketId: SocketId) {
        this.socketToGame.delete(socketId);
    }

    public has(socketId: SocketId) {
        return this.socketToGame.has(socketId);
    }

    public getPlayerGame(socketId: SocketId) {
        return this.socketToGame.get(socketId);
    }
}

const socketRegistry = new SocketRegistry();

export default socketRegistry;
import { SocketId } from "../types/types.js";

class Player {
    public readonly socketId: SocketId;
    public readonly username: string;

    constructor(socketId: SocketId, username: string) {
        this.socketId = socketId;
        this.username = username;
    }
}

export default Player;
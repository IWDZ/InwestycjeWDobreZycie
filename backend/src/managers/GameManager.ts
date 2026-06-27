import Game from "../entities/Game.js";
import Lobby from "../entities/Lobby.js";
import Room from "../entities/Room.js";
import roomRegistry from "../state/RoomRegistry.js";
import { SocketId } from "../types/types.js";
import RoomManager from "./RoomManager.js";

class GameManager extends RoomManager {
    public createGame(lobby: Lobby) {
        const game = new Game(lobby);
        roomRegistry.setRoom(game.roomCode, game);
    }
    
    protected onLeaveRoom(socketId: SocketId, room: Room): void {
        throw new Error("Method not implemented.");
    }
}

const gameManager = new GameManager();

export default gameManager;
import CLIENT_EVENTS from "../../../shared/dist/events/cleint-events.js";
import { io } from "../config/server/socket.config.js";
import Lobby from "../entities/Lobby.js"
import Player from "../entities/Player.js";
import Room from "../entities/Room.js";
import { generateRoomCode } from "../utils/game-utils.js";
import roomRegistry from "../state/RoomRegistry.js";
import socketRegistry from "../state/SocketRegistry.js";
import RoomManager from "./RoomManager.js";
import { SocketId } from "../types/types.js";
import { GameMode } from "../../../shared/dist/types/types.js";

class LobbyManager extends RoomManager {
    public createLobby(player: Player, maxPlayers: number, gameMode: GameMode) {
        const roomCode = generateRoomCode();

        const lobby = new Lobby(roomCode, player, maxPlayers, gameMode);
        
        roomRegistry.setRoom(roomCode, lobby);
        socketRegistry.addPlayer(player.socketId, roomCode);
        return lobby;
    }

    public joinLobby(player: Player, lobby: Lobby) {
        lobby.addPlayer(player);
        socketRegistry.addPlayer(player.socketId, lobby.roomCode);
    }

    protected onLeaveRoom(socketId: SocketId, room: Room): void {
        const lobby = room as Lobby;
        if (lobby.getPlayersArray().length === 0) {
            roomRegistry.removeRoom(lobby.roomCode);
        }
        if (lobby.isPlayerHost(socketId)) {
            const newHostUsername = lobby.changeHost();
            io.to(lobby.roomCode).emit(CLIENT_EVENTS.HOST_CHANGED, newHostUsername);
        }
    }
}

const lobbyManager = new LobbyManager();

export default lobbyManager;
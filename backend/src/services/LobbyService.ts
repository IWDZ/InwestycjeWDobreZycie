import Player from "../entities/Player.js";
import lobbyManager from "../managers/LobbyManager.js";
import { getPlayerRoom } from "../utils/player-utils.js";
import { ERRORS } from "../../../shared/dist/errors/errors.js";
import { getRoom } from "../utils/room-utils.js";
import { RoomCode, SocketId } from "../types/types.js";
import Lobby from "../entities/Lobby.js";
import { GameMode } from "../../../shared/dist/types/types.js";

class LobbyService {
    public createLobby(socketId: SocketId, username: string, maxPlayers: number, gameMode: GameMode) {
        if (getPlayerRoom(socketId)) {
            throw new Error(ERRORS.PLAYER_ALREADY_IN_GAME);
        }
        const player = new Player(socketId, username);
        return lobbyManager.createLobby(player, maxPlayers, gameMode);
    }

    public joinLobby(socketId: SocketId, username: string, roomCode: RoomCode) {
        if (getPlayerRoom(socketId)) {
            throw new Error(ERRORS.PLAYER_ALREADY_IN_GAME);
        }

        const lobby = getRoom(roomCode);
        if (!lobby) {
            throw new Error(ERRORS.ROOM_NOT_FOUND);
        }

        if (!(lobby instanceof Lobby)) {
            throw new Error(ERRORS.GAME_ALREADY_STARTED);
        }

        if (lobby.isFull()) {
            throw new Error(ERRORS.GAME_FULL);
        }

        if (lobby.hasPlayerWithUsername(username)) {
            throw new Error(ERRORS.USERNAME_TAKEN);
        }

        const player = new Player(socketId, username);

        lobbyManager.joinLobby(player, lobby);

        return lobby;
    }
}

const lobbyService = new LobbyService();

export default lobbyService;
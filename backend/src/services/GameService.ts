import { ERRORS } from "../../../shared/dist/errors/errors.js";
import Lobby from "../entities/Lobby.js";
import gameManager from "../managers/GameManager.js";
import { SocketId } from "../types/types.js";
import { getPlayerRoom } from "../utils/player-utils.js";
import { getRoom } from "../utils/room-utils.js";

class GameService {
    public startGame(socketId: SocketId) {
        const gameCode = getPlayerRoom(socketId);
        if (!gameCode) {
            throw new Error(ERRORS.PLAYER_NOT_IN_GAME);
        }

        const lobby = getRoom(gameCode);
        if (!lobby) {
            throw new Error(ERRORS.ROOM_NOT_FOUND);
        }

        if (!(lobby instanceof Lobby)) {
            throw new Error(ERRORS.GAME_ALREADY_STARTED);
        }

        if (lobby.isPlayerHost(socketId)) {
            throw new Error(ERRORS.HOST_FEATURE);
        }

        return gameManager.createGame(lobby);
    }
}

const gameService = new GameService();

export default gameService;
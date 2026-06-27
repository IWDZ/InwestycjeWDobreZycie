import { GAME_MODES } from "../../../shared/dist/config/game.config.js";
import { ERRORS } from "../../../shared/dist/errors/errors.js";
import { GameRules, standardGameRules } from "../config/game/game.config.js";
import gameManager from "../managers/GameManager.js";
import Lobby from "./Lobby.js";
import Room from "./Room.js";

class Game extends Room {
    private readonly systems: unknown = {}; // TODO: Systems type/interface
    private readonly gameRules: GameRules;

    constructor(lobby: Lobby) {
        super(lobby.roomCode, lobby.players, gameManager);
        switch (lobby.gameMode) {
            case GAME_MODES.STANDARD:
                this.gameRules = standardGameRules;
                break;
            default:
                console.error("ERROR: Game mode not .");
                throw new Error(ERRORS.INVALID_GAME_MODE);
        }
    }
}

export default Game;
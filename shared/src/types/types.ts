import { GAME_MODES } from "../config/game.config.js";

export type GameMode = typeof GAME_MODES[keyof typeof GAME_MODES];
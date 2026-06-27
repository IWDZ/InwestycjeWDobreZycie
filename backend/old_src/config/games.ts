import { Materials } from "./materials.js";
import { Player } from "./players.js";

export const GAME_CODE_CHARACTERS = "ABCDEFGHIJKLMNOPRSTUWVXYZabcdefghijklmnoprstuwvxyz1234567890";
export const GAME_CODE_LENGTH = 6;

export const SECONDS_BEFORE_GAME_START = 4;
export const GAME_TICK_SECONDS = 3;
export const LEADERBOARD_UPDATE_TICK_INTERVAL = 3;

export const START_MONEY = 7500;
export const START_HAPPINESS = 50;
export const WORTH_PER_PERSON = 750;
export const HAPPINESS_MULTIPLIER = 0.05;
export const WORK_MULTIPLIER = 0.02;

export const GAME_DURATION_TICKS = 240;
export const GAME_DURATION_TICKS_MIN = 120;
export const GAME_DURATION_TICKS_MAX = 600;
export const GAME_DURATION_TICKS_DEFAULT = 240;

export interface GameLobby {
    host: Player;
    players: Player[];
    maxPlayers: number;
    started: boolean;
    gameCode: string;
}

export interface GameMatch {
    gameCode: string;
    started: boolean;
    players: Player[];
    materialPrices: Materials;
    populationPool: number;
    nextBuildingId: number;
    settings: {
        GAME_DURATION_TICKS: number;
        MARKET_VOLATILITY: number;
    }
    gameTickInterval: number;
    tickNumber: number;
}

export type Game = GameLobby | GameMatch;
import { z } from "zod";
import { GAME_MODES } from "../config/game.config.js";
import { GameMode } from "../types/types.js";
import { MAX_PLAYERS, MIN_PLAYERS } from "../config/room.config.js";

export const createGameSchema = z.object({
    username: z.string(),
    maxPlayers: z.number().int().min(MIN_PLAYERS).max(MAX_PLAYERS),
    gameMode: z.enum(Object.values(GAME_MODES) as [GameMode, ...GameMode[]])
});

export const joinGameSchema = z.object({
    username: z.string(),
    roomCode: z.string()
});

export const sendAtomicBombSchema = z.string();
import z from "zod";
import { MAX_PLAYERS, MIN_PLAYERS } from "../config/room.config.js";

export const roomDTO = z.object({
    host: z.string(),
    players: z.array(z.string()),
    maxPlayers: z.number().min(MIN_PLAYERS).max(MAX_PLAYERS)
});
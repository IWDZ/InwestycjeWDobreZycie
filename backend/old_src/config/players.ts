import { isTestMode } from "../utils/generalUtils.js";
import { Field } from "./fields.js";
import { Materials } from "./materials.js";

export const MIN_PLAYERS = isTestMode() ? 1 : 2;
export const MAX_PLAYERS = 6;

export interface Player {
    socketId: string;
    username: string;
    money?: number;
    materials?: Materials;
    happiness?: number;
    jobSpaces?: number;
    apartmentSpaces?: number;
    population?: number;
    buildingCount?: number;
    income?: number;
    totalIncome?: number;
    field?: Field;
    nextCellPrice?: number;
}
import Building from "../classes/Building.js"

export const MAX_FIELD_SIZE = 7;
export const DEFAULT_CELL_PRICE = 5000;
export const CELL_PRICE_INCREASE = 1000;

export type Cell = {
    isOwned: boolean;
    building: null | Building;
}

export type Field = Cell[][];
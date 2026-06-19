import { BUILDINGS, CELL_PRICE_INCREASE, EMPTY_CELL_INDICATOR, ERRORS, MAX_FIELD_SIZE } from "../gameStorage.js";
import Building from "../classes/Building.js";
import { sendCellPriceUpdate, sendFieldUpdate, sendMoneyDecrease, sendMoneyUpdate } from "../clientUpdates.js";
import { hasRequiredMoney, removeMoney } from "./inventoryUtils.js";

export function getFieldMiddle() {
    return Math.floor(MAX_FIELD_SIZE / 2);
}

export function createField(middle) {
    const field = Array.from({ length: MAX_FIELD_SIZE }, () => Array.from({ length: MAX_FIELD_SIZE }, () => null));
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            field[middle+i][middle+j] = EMPTY_CELL_INDICATOR;
        }
    }
    return field;
}

export function isCellBought(cell) {
    return cell instanceof Building || cell === EMPTY_CELL_INDICATOR;
}

export function hasAdjacentCell(field, location) {
    const { y, x } = location;

    return (
        isCellBought(field[y-1]?.[x]) ||
        isCellBought(field[y+1]?.[x]) ||
        isCellBought(field[y]?.[x-1]) ||
        isCellBought(field[y]?.[x+1])
    );
}

export function buyCell(player, location) {
    if (!hasRequiredMoney(player.nextCellPrice, player.money)) return false;

    removeMoney(player, player.nextCellPrice);
    const { y, x } = location;
    player.field[y][x] = EMPTY_CELL_INDICATOR;
    player.nextCellPrice += CELL_PRICE_INCREASE;

    sendMoneyDecrease(player, player.nextCellPrice - CELL_PRICE_INCREASE);
    sendFieldUpdate(player);
    sendMoneyUpdate(player);
    sendCellPriceUpdate(player);

    return true;
}

export function isPlacementInBounds(buildingBounds) {
    const { rowEnd, columnEnd } = buildingBounds;
    return rowEnd <= (MAX_FIELD_SIZE - 1) && columnEnd <= (MAX_FIELD_SIZE - 1)
}

export function hasPlacementError(buildingName, field, buildingBounds) {
    const { rowStart, columnStart, rowEnd, columnEnd } = buildingBounds;
    if (buildingName === BUILDINGS.PORT.NAME && columnStart !== 0) {
        return ERRORS.PORT_ERROR;
    }
    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            if (field[y][x] === null) {
                return ERRORS.CELL_NOT_OWNED;
            }
            if (field[y][x] instanceof Building) {
                return ERRORS.CELL_OCCUPIED;
            }
        }
    }
    return false;
}
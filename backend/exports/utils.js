import { BUILDINGS, GAME_CODE_CHARACTERS, GAME_CODE_LENGTH, GAMES, MAX_FIELD_SIZE, POPULATION, START_MATERIALS } from "../gameStorage";
import Building from "./Building";

export function getCurrentBuildingId(game) {
    return game.settings.NEXT_BUILDING_ID++;
}

export function getGame(gameCode) {
    return GAMES.get(gameCode);
}

export function isValidData(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
}

export function getDefaultSettings(populationPool, buildingCost, buildMarketVolatility) {
    return {
        POPULATION: ((populationPool / 100) * POPULATION),
        BUILDING_COST: buildingCost,
        BUILD_MARKET_VOLATILITY: buildMarketVolatility,
        NEXT_BUILDING_ID: 1
    };
}

export function getDefaultClientGameDataObject(game, player) {
    return {
        population: game.settings.POPULATION,
        money: player.money,
        happiness: player.happiness,
        field: player.field,
        buildings: BUILDINGS
    };
}

export function isHost(game, socketId) {
    return game.host.socketId === socketId;
}

export function getFieldMiddle() {
    return Math.floor(MAX_FIELD_SIZE / 2);
}

export function createField(middle) {
    const field = Array.from({ length: MAX_FIELD_SIZE }, () => Array.from({ length: MAX_FIELD_SIZE }, () => undefined));
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            field[middle+i][middle+j] = null;
        }
    }
    return field;
}

export function setUpPlayer(game, player, middle) {
    player.field = createField(middle);
    player.field[middle][middle] = new Building(BUILDINGS.TOWN_HALL, getCurrentBuildingId(game), [middle, middle], false);
    player.happiness = START_HAPPINESS;
    player.materials = { ...START_MATERIALS };
    player.money = START_MONEY;
}

export function getBuildingByName(buildingName) {
    return Object.values(BUILDINGS).find(b => b.name === buildingName);
}

export function getPlayer(game, socketId) {
    return game.players.find(p => p.socketId === socketId);
}

export function hasRequiredBuilding(building, field) {
    if (!building.REQUIRED_BUILDING) return true;
    for (let y = 0; y < MAX_FIELD_SIZE; y++) {
        for (let x = 0; x < MAX_FIELD_SIZE; x++) {
            const cell = field[y][x];
            if (cell?.building?.NAME === building.REQUIRED_BUILDING) {
                return true;
            }
        }
    }
    return false;
}

export function hasRequiredMaterials(materialCost, materials) {
    return Object.entries(materialCost).every(([material, requiredAmount]) => materials[material] >= requiredAmount);
}

export function hasRequiredMoney(moneyCost, money) {
    return money >= moneyCost;
}

export function getBuildingBounds(building, startLocation, isVertical) {
    const height = isVertical ? building.WIDTH : building.HEIGHT;
    const width = isVertical ? building.HEIGHT : building.WIDTH;

    const rowStart = startLocation[0];
    const columnStart = startLocation[1];

    return {
        rowStart,
        columnStart,
        rowEnd: rowStart + height - 1,
        columnEnd: columnStart + width - 1
    };
}

export function isPlacementInBounds(rowEnd, columnEnd) {
    return rowEnd <= (MAX_FIELD_SIZE - 1) && columnEnd <= (MAX_FIELD_SIZE - 1)
}

export function hasPlacementError(field, rowStart, columnStart, rowEnd, columnEnd) {
    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            if (field[y][x] === undefined) {
                return "Out Of Available Space";
            }
            if (field[y][x] !== null) {
                return "Space Occupied";
            }
        }
    }
    return false;
}

export function returnMaterials(player, materialsToReturn) {
    Object.entries(materialsToAdd).every(([material, amount]) => player.materials[material] += Math.floor(amount / 2));
}

export function removeMaterials(player, materialsToRemove) {
    Object.entries(materialsToRemove).forEach(([material, requiredAmount]) => player.materials[material] -= requiredAmount);
}

export function returnMoney(player, moneyToReturn) {
    player.money += Math.floor(moneyToReturn / 2);
}

export function removeMoney(player, moneyToRemove) {
    player.money -= moneyToRemove;
}

export function placeBuilding(field, rowStart, columnStart, rowEnd, columnEnd, buildingId, building, isVertical) {
    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            field[y][x] = new Building(buildingId, building, [rowStart, columnStart], isVertical);
        }
    }
}

export function isTownHall(buildingName) {
    return buildingName === BUILDINGS.TOWN_HALL.NAME;
}

export function couldDeleteBuilding(field, rowStart, columnStart, rowEnd, columnEnd, buildingObject) {
    for (let y = rowStart; y <= rowEnd; y++) {
        for (let x = columnStart; x <= columnEnd; x++) {
            if (field[y][x] !== buildingObject) {
                return false;
            }
            field[y][x] = null;
        }
    }
    return true;
}

export function generateGameCode() {
    let gameCode;
    do {
        gameCode = "";
        for (let i = 0; i < GAME_CODE_LENGTH; i++) {
            gameCode += GAME_CODE_CHARACTERS[Math.floor(Math.random() * GAME_CODE_CHARACTERS.length)];
        }
    } while (GAMES.has(gameCode));
    return gameCode;
}

export function getDefaultGameObject(username, socketId, playersAmount) {
    return {
        host: {
            username: username,
            socketId: socketId
        },
        players: [
            {
                username: username,
                socketId: socketId
            }
        ],
        maxPlayers: playersAmount,
        started: false
    };
}

export function isPlayerInGame(socketId) {
    for (const game of GAMES.values()) {
        if (game.players.some(player => player.socketId === socketId)) return true;
    }
    return false;
}

export function isGameFull(game) {
    return game.players.length >= game.maxPlayers;
}

export function hasGameStarted(game) {
    return game.started;
}

export function hasPlayerWithUsername(game, username) {
    return game.players.some(player => player.username === username)
}

export function hasPlayer(game, socketId) {
    return game.players.some(player => player.socketId === socketId);
}

export function removePlayer(game, socketId) {
    game.players = game.players.filter(player => player.socketId !== socketId);
}
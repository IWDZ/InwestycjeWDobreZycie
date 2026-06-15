import { BONUS_BUILDINGS, BUILDINGS, DEFAULT_CELL_PRICE, ERRORS, MATERIALS, MAX_FIELD_SIZE, PLAYERS, START_HAPPINESS, START_MATERIALS, START_MONEY, WORTH_PER_PERSON } from "../gameStorage.js";
import { io } from "../../server.js";
import Building from "../Building.js";
import { getCurrentBuildingId } from "./buildingUtils.js";
import { createField, getFieldMiddle } from "./fieldUtils.js";
import { closeGame, endGame, getGame, hasGameEnoughPlayers, hasGameStarted } from "./gameUtils.js";
import { throwError } from "./generalUtils.js";
import { addMoney } from "./inventoryUtils.js";

export function createDefaultClientGameDataObject(game, player) {
    return {
        population: game.settings.POPULATION,
        money: player.money,
        happiness: player.happiness,
        field: player.field,
        buildings: BUILDINGS,
        materials: MATERIALS,
        materialPrices: game.materialPrices,
        playerMaterials: player.materials
    };
}

export function setUpPlayer(game, player) {
    const middle = getFieldMiddle();
    player.field = createField(middle);
    player.field[middle][middle] = new Building(getCurrentBuildingId(game), BUILDINGS.TOWN_HALL, [middle, middle], false);
    player.nextCellPrice = DEFAULT_CELL_PRICE;
    player.happiness = START_HAPPINESS;
    player.materials = { ...START_MATERIALS };
    player.money = START_MONEY;
    player.population = {
        livingPopulation: 3,
        workingPopulation: 3,
        maxLivingPopulation: 5,
        maxWorkingPopulation: 5
    }
}

export function getPlayer(game, socketId) {
    return game.players.find(p => p.socketId === socketId);
}

export function isPlayerInGame(socketId) {
    return PLAYERS.get(socketId);
}

export function hasGamePlayerWithUsername(game, username) {
    return game.players.some(player => player.username.toLowerCase() === username.toLowerCase())
}

export function addPlayer(game, username, socketId) {
    game.players.push({
        username: username,
        socketId: socketId
    });
    setPlayerGame(socketId, game.gameCode);
}

export function removePlayer(game, socketId) {
    game.players = game.players.filter(player => player.socketId !== socketId);
    setPlayerGame(socketId, null);
}

export function getHappiness(player) {
    const happiness = player.happiness;
    if (happiness > 100) {
        return 100;
    }
    if (happiness < 0) {
        return 0;
    }
    return happiness;
}

export function sumUpPlayers(game) {
    const playerWorths = [];
    for (const player of game.players) {
        const moneyWorth = player.money;
        let materialWorth = {};
        let totalWorth = player.money;
        for (const [material, amount] of Object.entries(player.materials)) {
            const cost = game.materialPrices[material] * amount;
            totalWorth += cost;
            materialWorth = {...materialWorth, [material]: cost};
        }
        const field = player.field;
        const ignoredIDs = new Set();
        let buildingsWorth = 0;
        let bonus = 0;
        const buildingBonuses = {...BONUS_BUILDINGS};
        for (let y = 0; y < MAX_FIELD_SIZE; y++) {
            for (let x = 0; x < MAX_FIELD_SIZE; x++) {
                const cell = field[y][x];
                if (!(cell instanceof Building) || ignoredIDs.has(cell.id)) continue;
                const buildingBonus = buildingBonuses[cell.buildingName];
                if (buildingBonus > 0) {
                    bonus += buildingBonus;
                    totalWorth += buildingBonus;
                    buildingBonuses[cell.buildingName] = 0;
                }
                let worth = cell.building.MONEY_COST;
                for (const [material, amount] of Object.entries(cell.building.MATERIAL_COST)) {
                    worth += Math.floor(game.materialPrices[material] * amount / 2);
                }
                buildingsWorth += worth;
                totalWorth += worth;
                ignoredIDs.add(cell.id);
            }
        }
        const populationWorth = player.population.livingPopulation * WORTH_PER_PERSON;
        totalWorth += populationWorth;
        playerWorths.push({
            username: player.username,
            moneyWorth,
            materialWorth,
            buildingsWorth,
            bonus,
            populationWorth,
            totalWorth
        });
    }

    const leaderboard = playerWorths.sort((a, b) => b.totalWorth - a.totalWorth).map(player => (
        {
            username: player.username,
            worth: player.totalWorth
        }
    ));
    return leaderboard;
}

export function isHost(game, socketId) {
    return game.host.socketId === socketId;
}

export function setPlayerGame(socketId, gameCode) {
    PLAYERS.set(socketId, gameCode);
}

export function getPlayerGame(socketId) {
    return PLAYERS.get(socketId);
}

export function generateIncome(player) {
    const field = player.field;
    const ignoredIDs = new Set();
    let income = 0;
    for (let y = 0; y < MAX_FIELD_SIZE; y++) {
        for (let x = 0; x < MAX_FIELD_SIZE; x++) {
            const cell = field[y][x];
            if (!(cell instanceof Building) || ignoredIDs.has(cell.id)) continue;
            income += cell.building.MONEY_PER_JOB * cell.workers;
            ignoredIDs.add(cell.id);
        }
    }
    addMoney(player, income);
    return income;
}

export function leaveGame(socket, socketId) {
    const game = getGame(getPlayerGame(socketId));
    if (!game) {
        if (isPlayerInGame(socketId)) throwError(socketId, ERRORS.GAME_NOT_FOUND);
        return;
    }

    if (isHost(game, socketId) && !hasGameStarted(game)) {
        removePlayer(game, socketId);
        socket.emit("left");
        for (const player of game.players) {
            io.to(player.socketId).emit("host_left");
            removePlayer(game, player.socketId);
        }
        return closeGame(game)
    }

    removePlayer(game, socketId);

    const usernames = game.players.map(player => player.username);

    for (const player of game.players) {
        io.to(player.socketId).emit("player_left", usernames);
    }

    socket.emit("left");

    if (!hasGameEnoughPlayers(game) && hasGameStarted(game)) endGame(game);
}
import { GAME_CODE_CHARACTERS, GAME_CODE_LENGTH, GAME_DURATION_TICKS, GAME_TICK_SECONDS, GAMES, LEADERBOARD_UPDATE_TICK_INTERVAL, MARKET_UPDATE_TICK_INTERVAL, MATERIAL_PRICES, MATERIALS, MIN_PLAYERS, POPULATION, SECONDS_BEFORE_GAME_START } from "../gameStorage.js";
import { io } from "../../server.js";
import { sendFieldUpdate, sendLeaderboardUpdate, sendMaterialPricesUpdate, sendMoneyIncrease, sendMoneyUpdate, sendPopulationUpdate, sendTickNumberUpdate } from "../clientUpdates.js";
import { generateIncome, removePlayer, sumUpPlayers } from "./playerUtils.js";
import { updateMarket, updatePopulation } from "./updateUtils.js";
import { isTestMode } from "./generalUtils.js";

export function createGame(gameCode, username, socketId, playersAmount) {
    GAMES.set(gameCode, createDefaultGameObject(gameCode, username, socketId, playersAmount));
}

export function getGame(gameCode) {
    return GAMES.get(gameCode);
}

export function getDefaultGameSettings(settings) {
    return {
        POPULATION: ((settings.populationPoolPercent / 100) * POPULATION),
        MARKET_VOLATILITY: settings.marketVolatility,
        GAME_DURATION_TICKS: settings.gameDurationTicks,
        NEXT_BUILDING_ID: 1
    };
}

export function startGame(game, settings) {
    game.started = true;
    game.settings = getDefaultGameSettings(settings);
    game.tickNumber = 1;
    game.materialPrices = { ...MATERIAL_PRICES};
    if(!isTestMode()) {
        setTimeout(() => game.gameTickInterval = setInterval(() => doGameTick(game), GAME_TICK_SECONDS * 1000), SECONDS_BEFORE_GAME_START * 1000);   
    }
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

export function createDefaultGameObject(gameCode, username, socketId, playersAmount) {
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
        started: false,
        gameCode: gameCode
    };
}

export function isGameFull(game) {
    return game.players.length >= game.maxPlayers;
}

export function hasGameStarted(game) {
    return game.started;
}

export function closeGame(game) {
    clearInterval(game.gameTickInterval);
    GAMES.delete(game.gameCode);
}

export function endGame(game) {
    const leaderboard = sumUpPlayers(game);
    for (const player of game.players) {
        const socketId = player.socketId;
        io.to(socketId).emit("game_end", {
            worth: player.worth,
            leaderboard: leaderboard
        });
        removePlayer(game, socketId);
    }
    closeGame(game);
}

export function doGameTick(game) {

    for (const player of game.players) {
        sendMoneyIncrease(player, generateIncome(player));
        sendMoneyUpdate(player);
    }

    if (game.tickNumber >= game.settings.GAME_DURATION_TICKS) {
        return endGame(game);
    }

    if (game.tickNumber % MARKET_UPDATE_TICK_INTERVAL === 0) {
        updateMarket(game);
        sendMaterialPricesUpdate(game);
    }

    if (game.tickNumber % LEADERBOARD_UPDATE_TICK_INTERVAL === 0) {
        sendLeaderboardUpdate(game);
    }

    updatePopulation(game);
    sendPopulationUpdate(game);
    for (const player of game.players) {
        sendFieldUpdate(player);
        sendTickNumberUpdate(player, game.tickNumber);
    }

    game.tickNumber++;
}

export function hasGameEnoughPlayers(game) {
    return game.players.length >= MIN_PLAYERS;
}
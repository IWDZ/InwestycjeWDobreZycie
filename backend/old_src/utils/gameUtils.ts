import { Game, GAME_CODE_CHARACTERS, GAME_CODE_LENGTH, GAME_TICK_SECONDS, GameLobby, GameMatch, LEADERBOARD_UPDATE_TICK_INTERVAL, SECONDS_BEFORE_GAME_START } from "../config/games.js";
import { io } from "../config/socket.js";
import { sendFieldUpdate, sendLeaderboardUpdate, sendMaterialPricesUpdate, sendMoneyIncrease, sendMoneyUpdate, sendPopulationUpdate, sendTickNumberUpdate } from "../updates/clientUpdates.js";
import { generateIncome, removePlayer, sumUpPlayers } from "./playerUtils.js";
import { updateMarket, updatePopulation } from "./updateUtils.js";
import { isTestMode } from "./generalUtils.js";
import { GamesMap } from "../storage/gameStorage.js";
import { MARKET_UPDATE_TICK_INTERVAL, MATERIAL_START_PRICES } from "../config/materials.js";
import { POPULATION_POOL } from "../config/population.js";
import { MIN_PLAYERS } from "../config/players.js";

export function createGame(gameCode: string, username: string, socketId: string, playersAmount: number) {
    GamesMap.set(gameCode, createDefaultGameObject(gameCode, username, socketId, playersAmount));
}

export function getGame(gameCode: string) {
    return GamesMap.get(gameCode);
}

export function getDefaultGameSettings(settings) {
    return {
        MARKET_VOLATILITY: settings.marketVolatility,
        GAME_DURATION_TICKS: settings.gameDurationTicks
    };
}

export function startGame(game, settings) {
    game.settings = getDefaultGameSettings(settings);
    game.tickNumber = 1;
    game.materialPrices = { ...MATERIAL_START_PRICES};
    game.populationPool = (settings.populationPoolPercent / 100) * POPULATION_POOL;
    if(!isTestMode()) {
        setTimeout(() => {
            game.gameTickInterval = setInterval(() => doGameTick(game), GAME_TICK_SECONDS * 1000);
            game.started = true;
        }, SECONDS_BEFORE_GAME_START * 1000);   
    }else{
        game.started = true;
    }
}

export function generateGameCode() {
    let gameCode: string;
    do {
        gameCode = "";
        for (let i = 0; i < GAME_CODE_LENGTH; i++) {
            gameCode += GAME_CODE_CHARACTERS[Math.floor(Math.random() * GAME_CODE_CHARACTERS.length)];
        }
    } while (GamesMap.has(gameCode));
    return gameCode;
}

export function createDefaultGameObject(gameCode: string, username: string, socketId: string, playersAmount: number): GameLobby {
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

export function isGameFull(game: GameLobby) {
    return game.players.length >= game.maxPlayers;
}

export function hasGameStarted(game: Game) {
    return game.started;
}

export function closeGame(game: GameMatch) {
    clearInterval(game.gameTickInterval);
    GamesMap.delete(game.gameCode);
}

export function endGame(game: GameMatch) {
    const leaderboard = sumUpPlayers(game);
    for (const player of game.players) {
        const socketId = player.socketId;
        io.to(socketId).emit("game_end", leaderboard);
        removePlayer(game, socketId);
    }
    closeGame(game);
}

export function doGameTick(game: GameMatch) {
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

export function hasGameEnoughPlayers(game: Game) {
    return game.players.length >= MIN_PLAYERS;
}